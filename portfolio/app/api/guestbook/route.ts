import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/db";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import logger from "../../lib/logger";
import { validateAndSanitize, securityHeaders } from "../../lib/security";

function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

async function getResolvedUserId(user: { id: string; email?: string | null }): Promise<string> {
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  });

  if (dbUser) {
    return dbUser.id;
  }

  if (user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (existingUser) {
      return existingUser.id;
    }
  }

  return user.id;
}

export async function GET() {
  noStore();
  try {
    const data = await prisma.guestBookEntry.findMany({
      include: {
        user: {
          select: {
            username: true,
            profileimage: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
    });
    
    logger.info('Guestbook entries retrieved', { count: data.length });
    const response = NextResponse.json(data);
    return applySecurityHeaders(response);
  } catch (error) {
    logger.error('Error retrieving guestbook entries', { error: error instanceof Error ? error.message : String(error) });
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return applySecurityHeaders(response);
  }
}

export async function POST(req: NextRequest) {
  noStore();
  try {
    const { message } = await req.json();
    
    const validation = validateAndSanitize(message, 500);
    if (!validation.isValid) {
      logger.warn('Invalid message attempt', { error: validation.error });
      const response = NextResponse.json({ error: validation.error }, { status: 400 });
      return applySecurityHeaders(response);
    }

    const sanitizedMessage = validation.sanitized!;

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      logger.warn('Unauthorized POST attempt');
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return applySecurityHeaders(response);
    }

    let username = 'User';
    if (user.given_name && user.family_name) {
      const nameValidation = validateAndSanitize(`${user.given_name} ${user.family_name}`, 100);
      username = nameValidation.sanitized || 'User';
    } else if (user.given_name) {
      const nameValidation = validateAndSanitize(user.given_name, 50);
      username = nameValidation.sanitized || 'User';
    } else if (user.family_name) {
      const nameValidation = validateAndSanitize(user.family_name, 50);
      username = nameValidation.sanitized || 'User';
    }

    let dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser && user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });

      if (existingUser) {
        dbUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            username: username,
            email: user.email,
            profileimage: user.picture || '',
          },
        });
        logger.info('Multi-provider authentication in guestbook - updated profile', { 
          existingUserId: existingUser.id, 
          newUserId: user.id, 
          email: user.email 
        });
      } else {
        dbUser = await prisma.user.create({
          data: {
            id: user.id,
            username: username,
            email: user.email,
            profileimage: user.picture || '',
          },
        });
      }
    } else if (dbUser) {
      dbUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          username: username,
          email: user.email || '',
          profileimage: user.picture || '',
        },
      });
    } else {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          username: username,
          email: user.email || '',
          profileimage: user.picture || '',
        },
      });
    }

    const entry = await prisma.guestBookEntry.create({
      data: {
        message: sanitizedMessage,
        userId: dbUser.id,
      },
      include: {
        user: {
          select: {
            username: true,
            profileimage: true,
          },
        },
      },
    });

    logger.info('Guestbook entry created', { entryId: entry.id, userId: dbUser.id });

    revalidatePath("/guestbook");
    const response = NextResponse.json(entry);
    return applySecurityHeaders(response);
  } catch (error) {
    logger.error('Error creating guestbook entry', { error: error instanceof Error ? error.message : String(error) });
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return applySecurityHeaders(response);
  }
}

export async function PUT(req: NextRequest) {
  noStore();
  try {
    const url = new URL(req.url);
    const messageId = url.searchParams.get('id');

    if (!messageId) {
      logger.warn('PUT request without message ID');
      const response = NextResponse.json({ error: "Message ID is required" }, { status: 400 });
      return applySecurityHeaders(response);
    }

    const { message } = await req.json();

    const validation = validateAndSanitize(message, 500);
    if (!validation.isValid) {
      logger.warn('Invalid message in PUT request', { error: validation.error });
      const response = NextResponse.json({ error: validation.error }, { status: 400 });
      return applySecurityHeaders(response);
    }

    const sanitizedMessage = validation.sanitized!;

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      logger.warn('Unauthorized PUT attempt');
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return applySecurityHeaders(response);
    }

    const resolvedUserId = await getResolvedUserId(user);

    const existingEntry = await prisma.guestBookEntry.findUnique({
      where: { id: messageId },
    });

    if (!existingEntry || existingEntry.userId !== resolvedUserId) {
      logger.warn('Unauthorized message modification attempt');
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return applySecurityHeaders(response);
    }

    const updatedEntry = await prisma.guestBookEntry.update({
      where: { id: messageId },
      data: { message: sanitizedMessage },
      include: {
        user: {
          select: {
            username: true,
            profileimage: true,
          },
        },
      },
    });

    logger.info('Guestbook entry updated', { entryId: messageId, userId: resolvedUserId });

    revalidatePath("/guestbook");
    const response = NextResponse.json(updatedEntry);
    return applySecurityHeaders(response);
  } catch (error) {
    logger.error('Error updating guestbook entry', { error: error instanceof Error ? error.message : String(error) });
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return applySecurityHeaders(response);
  }
}

export async function DELETE(req: NextRequest) {
  noStore();
  try {
    const url = new URL(req.url);
    const messageId = url.searchParams.get('id');

    if (!messageId) {
      logger.warn('DELETE request without message ID');
      const response = NextResponse.json({ error: "Message ID is required" }, { status: 400 });
      return applySecurityHeaders(response);
    }

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      logger.warn('Unauthorized DELETE attempt');
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return applySecurityHeaders(response);
    }

    const resolvedUserId = await getResolvedUserId(user);

    const existingEntry = await prisma.guestBookEntry.findUnique({
      where: { id: messageId },
    });

    if (!existingEntry || existingEntry.userId !== resolvedUserId) {
      logger.warn('Unauthorized message deletion attempt');
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return applySecurityHeaders(response);
    }

    await prisma.guestBookEntry.delete({
      where: { id: messageId },
    });

    logger.info('Guestbook entry deleted', { entryId: messageId, userId: resolvedUserId });

    revalidatePath("/guestbook");
    const response = NextResponse.json({ success: true });
    return applySecurityHeaders(response);
  } catch (error) {
    logger.error('Error deleting guestbook entry', { error: error instanceof Error ? error.message : String(error) });
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return applySecurityHeaders(response);
  }
}
