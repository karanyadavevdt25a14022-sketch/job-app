import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { PDFParse } from "pdf-parse";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const status = formData.get("status") as string;
    const field = formData.get("field") as string;
    const subdomains = JSON.parse(formData.get("subdomains") as string);
    const locationPreferences = JSON.parse(formData.get("locationPreferences") as string);
    const experienceLevel = formData.get("experienceLevel") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const resume = formData.get("resume") as File | null;

    let resumeData = "", resumeFileName = "";
    let bytes: ArrayBuffer | null = null;
    if (resume) {
      bytes = await resume.arrayBuffer();
      resumeData = Buffer.from(bytes).toString("base64");
      resumeFileName = resume.name || "resume.pdf";
    }

    let parsedSkills: string[] = [];
    let parsedExperienceSummary = "";
    if (resume && bytes) {
      const parser = new PDFParse({ data: Buffer.from(bytes) });
      const result = await parser.getText();
      const rawText = result.text;
      const SKILL_BANK = ["react", "node", "python", "sql", "typescript", "next.js", "aws", "docker"];
      parsedSkills = SKILL_BANK.filter((s) => rawText.toLowerCase().includes(s));
      parsedExperienceSummary = rawText.slice(0, 500);
    }

    const existingProfile = await db.select().from(profiles).where(eq(profiles.userId, session.user.id)).limit(1);

    if (existingProfile.length > 0) {
      await db.update(profiles).set({
        status, field, subdomains, locationPreferences, experienceLevel, contactEmail,
        resumeData: resumeData || existingProfile[0].resumeData,
        resumeFileName: resumeFileName || existingProfile[0].resumeFileName,
        parsedSkills: parsedSkills.length ? parsedSkills : existingProfile[0].parsedSkills,
        parsedExperienceSummary: parsedExperienceSummary || existingProfile[0].parsedExperienceSummary,
        onboardingCompleted: true,
        updatedAt: new Date(),
      }).where(eq(profiles.userId, session.user.id));
    } else {
      await db.insert(profiles).values({
        id: uuidv4(), userId: session.user.id, status, field, subdomains, locationPreferences,
        experienceLevel, contactEmail, resumeData, resumeFileName, parsedSkills, parsedExperienceSummary,
        onboardingCompleted: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: error.message || "Failed to save profile" }, { status: 500 });
  }
}