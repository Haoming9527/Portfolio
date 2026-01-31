import { NextResponse } from "next/server";
import { prisma } from "../../lib/db";

export async function GET() {
  try {
    const count = await prisma.user.count();
    
    return NextResponse.json({ 
      status: 'active', 
      message: 'Database connection verified',
      timestamp: new Date().toISOString(),
      userCount: count 
    }, { status: 200 });
  } catch (error) {
    console.error('Keep active check failed:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : error
    }, { status: 500 });
  }
}
