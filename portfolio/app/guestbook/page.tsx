import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Form } from "../components/Form";
import { GuestBookEntriesClient } from "../components/GuestBookEntriesClient";
import { AuthProvider } from "../lib/auth";
import { prisma } from "@/app/lib/db";
import logger from "@/app/lib/logger";
import { MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guestbook",
};

async function getGuestBookEntries() {
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

    logger.info("Guestbook entries fetched from page component", {
      count: data.length,
    });
    return data;
  } catch (error) {
    logger.error("Error fetching guestbook entries from page component", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export default function GuestbookPage() {
  return (
    <AuthProvider>
      <section className="max-w-4xl w-full px-4 md:px-8 mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold lg:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-700">
            Guestbook
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
            Leave a message and be part of my journey! Your thoughts and
            well-wishes mean the world to me.
          </p>
        </div>

        <div className="space-y-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <Suspense fallback={<GuestBookFormLoading />}>
              <Form />
            </Suspense>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<LoadingMessages />}>
                  <GuestBookEntriesWrapper />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </AuthProvider>
  );
}

function GuestBookFormLoading() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="w-32 h-10" />
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingMessages() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start space-x-4 p-4 border rounded-lg"
        >
          <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function GuestBookEntriesWrapper() {
  const data = await getGuestBookEntries();
  return <GuestBookEntriesClient entries={data} />;
}
