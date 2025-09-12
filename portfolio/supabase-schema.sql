-- Supabase SQL Schema for Portfolio Guestbook
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Drop existing tables if they exist
DROP TABLE IF EXISTS "GuestBookEntry" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "username" TEXT,
    "profileimage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create GuestBookEntry table
CREATE TABLE IF NOT EXISTS "GuestBookEntry" (
    "id" TEXT PRIMARY KEY,
    "message" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "GuestBookEntry_userId_idx" ON "GuestBookEntry"("userId");
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");

-- Enable Row Level Security
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GuestBookEntry" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for User table
CREATE POLICY "Users can view their own profile" ON "User"
    FOR SELECT USING (auth.uid()::text = "id");

CREATE POLICY "Users can update their own profile" ON "User"
    FOR UPDATE USING (auth.uid()::text = "id");

CREATE POLICY "Users can insert their own profile" ON "User"
    FOR INSERT WITH CHECK (auth.uid()::text = "id");

-- Create RLS policies for GuestBookEntry table
CREATE POLICY "Anyone can view guestbook entries" ON "GuestBookEntry"
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create guestbook entries" ON "GuestBookEntry"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update their own guestbook entries" ON "GuestBookEntry"
    FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete their own guestbook entries" ON "GuestBookEntry"
    FOR DELETE USING (auth.uid()::text = "userId");

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guestbook_entry_updated_at BEFORE UPDATE ON "GuestBookEntry"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
