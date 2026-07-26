import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { listings } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";

// Adzuna API integration
async function fetchFromAdzuna() {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    console.log("Adzuna: ADZUNA_APP_ID/ADZUNA_APP_KEY not set, skipping");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=20&what=software%20developer&content-type=application/json`
    );
    if (!response.ok) {
      console.error(`Adzuna: HTTP ${response.status}`, await response.text());
      return [];
    }
    const data = await response.json();
    console.log(`Adzuna: got ${data.results?.length || 0} raw results`);

   return (data.results || [])
      .filter((job: any) => job.title && job.redirect_url) // skip listings missing essentials
      .map((job: any) => ({
        id: uuidv4(),
        title: job.title,
        company: job.company?.display_name || "Not specified",
        description: job.description || "",
        source: "adzuna",
        sourceId: job.id,
        location: job.location?.display_name || "Not specified",
        url: job.redirect_url,
      deadline: null,
      tags: ["tech"],
      field: "Tech",
      experienceLevel: null,
      recipientEmail: null,
      applicationType: "external",
    }));
  } catch (error) {
    console.error("Adzuna fetch error:", error);
    return [];
  }
}

// Arbeitnow API integration (free, no auth required)
async function fetchFromArbeitnow() {
  try {
    const response = await fetch("https://www.arbeitnow.com/api/job-board-api");
    if (!response.ok) {
      console.error(`Arbeitnow: HTTP ${response.status}`, await response.text());
      return [];
    }
    const data = await response.json();
    console.log(`Arbeitnow: got ${data.data?.length || 0} raw results`);

    return (data.data || [])
      .filter((job: any) => job.title && job.url)
      .slice(0, 20)
      .map((job: any) => ({
        id: uuidv4(),
        title: job.title,
        company: job.company_name || "Not specified",
      description: job.description,
      source: "arbeitnow",
      sourceId: job.slug,
      location: job.location,
      url: job.url,
      deadline: null,
      tags: job.tags || [],
      field: "Tech",
      experienceLevel: null,
      recipientEmail: null,
      applicationType: "external",
    }));
  } catch (error) {
    console.error("Arbeitnow fetch error:", error);
    return [];
  }
}

// RemoteOK API integration (free, public)
async function fetchFromRemoteOK() {
  try {
    const response = await fetch("https://remoteok.com/api?tags=software", {
      headers: {
        // RemoteOK rejects requests without a browser-like User-Agent
        "User-Agent": "Mozilla/5.0 (compatible; career-platform/1.0)",
      },
    });
    if (!response.ok) {
      console.error(`RemoteOK: HTTP ${response.status}`, await response.text());
      return [];
    }
    const data = await response.json();
    console.log(`RemoteOK: got ${Array.isArray(data) ? data.length - 1 : 0} raw results`);

    // First item is metadata, so skip it
    return data
      .slice(1, 21)
      .filter((job: any) => job.position && job.url)
      .map((job: any) => ({
        id: uuidv4(),
        title: job.position,
        company: job.company || "Not specified",
      description: job.description || "",
      source: "remoteok",
      sourceId: job.id,
      location: "Remote",
      url: job.url,
      deadline: null,
      tags: job.tags || [],
      field: "Tech",
      experienceLevel: null,
      recipientEmail: null,
      applicationType: "external",
    }));
  } catch (error) {
    console.error("RemoteOK fetch error:", error);
    return [];
  }
}

import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Allow either: (a) a logged-in user's own session (manual "Sync Jobs" button),
    // or (b) the CRON_SECRET bearer token (for an external scheduled job later).
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const isCronCall = cronSecret && authHeader === `Bearer ${cronSecret}`;

    if (!isCronCall) {
      const session = await auth.api.getSession({ headers: request.headers });
      console.log("sync-listings session check:", session ? "SESSION FOUND" : "NO SESSION");
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const newListings = [];

    // Fetch from all sources
    const [adzunaJobs, arbeitnowJobs, remoteokJobs] = await Promise.all([
      fetchFromAdzuna(),
      fetchFromArbeitnow(),
      fetchFromRemoteOK(),
    ]);

newListings.push(...adzunaJobs, ...arbeitnowJobs, ...remoteokJobs);
    console.log(`Total listings about to insert: ${newListings.length}`);

    // Insert into database
    if (newListings.length > 0) {
      await db.insert(listings).values(newListings);
    }

    return NextResponse.json({
      success: true,
      count: newListings.length,
      sources: {
        adzuna: adzunaJobs.length,
        arbeitnow: arbeitnowJobs.length,
        remoteok: remoteokJobs.length,
      },
    });
  } catch (error: any) {
    console.error("Sync listings error:", error);
    return NextResponse.json({ error: error.message || "Failed to sync listings" }, { status: 500 });
  }
}
