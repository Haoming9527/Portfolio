import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import logger from "../../../lib/logger";
import { validateAndSanitize } from "../../../lib/security";

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

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  noStore();
  try {
    const params = await props.params;
    const messageId = params.id;

    if (!messageId) {
      logger.warn('PUT request without message ID');
      const response = NextResponse.json({ error: "Message ID is required" }, { status: 400 });
      return response;
    }

    const { message } = await req.json();

    const validation = validateAndSanitize(message, 500);
    if (!validation.isValid) {
      logger.warn('Invalid message in PUT request', { error: validation.error });
      const response = NextResponse.json({ error: validation.error }, { status: 400 });
      return response;
    }

    const sanitizedMessage = validation.sanitized!;

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      logger.warn('Unauthorized PUT attempt');
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return response;
    }

    const resolvedUserId = await getResolvedUserId(user);

    const existingEntry = await prisma.guestBookEntry.findUnique({
      where: { id: messageId },
    });

    if (!existingEntry || existingEntry.userId !== resolvedUserId) {
      logger.warn('Unauthorized message modification attempt');
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return response;
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
    return response;
  } catch (error) {
    logger.error('Error updating guestbook entry', { error: error instanceof Error ? error.message : String(error) });
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return response;
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  noStore();
  try {
    const params = await props.params;
    const messageId = params.id;

    if (!messageId) {
      logger.warn('DELETE request without message ID');
      const response = NextResponse.json({ error: "Message ID is required" }, { status: 400 });
      return response;
    }

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      logger.warn('Unauthorized DELETE attempt');
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return response;
    }

    const resolvedUserId = await getResolvedUserId(user);

    const existingEntry = await prisma.guestBookEntry.findUnique({
      where: { id: messageId },
    });

    if (!existingEntry || existingEntry.userId !== resolvedUserId) {
      logger.warn('Unauthorized message deletion attempt');
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return response;
    }

    await prisma.guestBookEntry.delete({
      where: { id: messageId },
    });

    logger.info('Guestbook entry deleted', { entryId: messageId, userId: resolvedUserId });

    revalidatePath("/guestbook");
    const response = NextResponse.json({ success: true });
    return response;
  } catch (error) {
    logger.error('Error deleting guestbook entry', { error: error instanceof Error ? error.message : String(error) });
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return response;
  }
}
