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
    const existingUserById = await prisma.user.findUnique({
      where: { id: user.id }
    });

    let existingUserByEmail = null;
    if (user.email) {
      existingUserByEmail = await prisma.user.findUnique({
        where: { email: user.email }
      });
    }

    let dbUser;
    
    if (existingUserById) {
      dbUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          username: username,
          email: user.email ?? "",
          profileimage: user.picture,
        },
      });
      logger.info('Existing user updated by ID', { userId: user.id });
    } else if (existingUserByEmail) {
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
