import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { listings, profiles } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile for filtering
    const userProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
      .limit(1);

    if (!userProfile.length) {
      return NextResponse.json({ listings: [] });
    }

    const profile = userProfile[0];

    // Get all listings (in production, this would be filtered by profile preferences)
    // For now, we'll return all listings and do basic filtering
    const allListings = await db
      .select()
      .from(listings)
      .orderBy(desc(listings.createdAt))
      .limit(50);

    // Basic filtering based on field
    const filteredListings = allListings.filter((listing) => {
      if (profile.field && listing.field) {
        return listing.field.toLowerCase() === profile.field.toLowerCase();
      }
      return true;
    });

    return NextResponse.json({ listings: filteredListings });
  } catch (error: any) {
    console.error("Listings fetch error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch listings" }, { status: 500 });
  }
}
