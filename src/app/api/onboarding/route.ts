import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const status = formData.get("status") as string;
    const field = formData.get("field") as string;
    const subdomains = JSON.parse(formData.get("subdomains") as string);
    const locationPreferences = JSON.parse(formData.get("locationPreferences") as string);
    const experienceLevel = formData.get("experienceLevel") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const resume = formData.get("resume") as File | null;

    let resumeData = "";
    let resumeFileName = "";
    if (resume) {
      const bytes = await resume.arrayBuffer();
      resumeData = Buffer.from(bytes).toString("base64");
      resumeFileName = resume.name || "resume.pdf";
    }

    // Check if profile already exists
    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
      .limit(1);

    if (existingProfile.length > 0) {
      // Update existing profile
      await db
        .update(profiles)
        .set({
          status,
          field,
          subdomains,
          locationPreferences,
          experienceLevel,
          contactEmail,
          resumeData: resumeData || existingProfile[0].resumeData,
          resumeFileName: resumeFileName || existingProfile[0].resumeFileName,
          onboardingCompleted: true,
          updatedAt: new Date(),
        })
        .where(eq(profiles.userId, session.user.id));
    } else {
      // Create new profile
      await db.insert(profiles).values({
        id: uuidv4(),
        userId: session.user.id,
        status,
        field,
        subdomains,
        locationPreferences,
        experienceLevel,
        contactEmail,
        resumeData,
        resumeFileName,
        onboardingCompleted: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: error.message || "Failed to save profile" }, { status: 500 });
  }
}