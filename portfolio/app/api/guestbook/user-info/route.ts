import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import logger from "@/app/lib/logger";

export async function GET() {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user === null || !user.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let username = 'User';
  if (user.given_name && user.family_name) {
    username = `${user.given_name} ${user.family_name}`;
  } else if (user.given_name) {
    username = user.given_name;
  } else if (user.family_name) {
    username = user.family_name;
  }

  try {
    // Try to find user by ID first (most common case)
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (dbUser) {
      // Only update if data has changed to avoid unnecessary writes
      const needsUpdate = 
        dbUser.username !== username ||
        dbUser.email !== (user.email ?? "") ||
        dbUser.profileimage !== user.picture;

      if (needsUpdate) {
        dbUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            username: username,
            email: user.email ?? "",
            profileimage: user.picture,
          },
        });
        logger.info('User updated by ID', { userId: user.id });
      }
    } else if (user.email) {
      // Only check by email if user not found by ID
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email: user.email }
      });

      if (existingUserByEmail) {
        dbUser = await prisma.user.update({
          where: { id: existingUserByEmail.id },
          data: {
            username: username,
            email: user.email ?? "",
            profileimage: user.picture,
          },
        });
        
        logger.info('Multi-provider authentication detected and updated', { 
          existingUserId: existingUserByEmail.id, 
          newUserId: user.id, 
          email: user.email 
        });
      } else {
        dbUser = await prisma.user.create({
          data: {
            id: user.id,
            username: username,
            email: user.email ?? "",
            profileimage: user.picture,
          },
        });
        logger.info('New user created', { userId: user.id, email: user.email });
      }
    } else {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          username: username,
          email: user.email ?? "",
          profileimage: user.picture,
        },
      });
      logger.info('New user created', { userId: user.id, email: user.email });
    }

    logger.info('User info retrieved/updated', { userId: dbUser.id });

    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      profileimage: dbUser.profileimage,
      email_verified: true
    });
  } catch (error) {
    logger.error('Error in user-info route', { 
      error: error instanceof Error ? error.message : String(error),
      userId: user.id,
      email: user.email 
    });
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
