import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rawText, fileName, fileBase64 } = await request.json();
    if (!rawText) return NextResponse.json({ error: "rawText required" }, { status: 400 });

    // Naive skill extraction — swap for a real NLP/AI call later
    const SKILL_BANK = ["react", "node", "python", "sql", "typescript", "next.js", "aws", "docker"];
    const skills = SKILL_BANK.filter((s) => rawText.toLowerCase().includes(s));

    await db
      .update(profiles)
      .set({
        resumeData: fileBase64,        // keep existing base64-in-Postgres pattern
        resumeFileName: fileName,
        parsedSkills: skills,
        parsedExperienceSummary: rawText.slice(0, 500), // trimmed summary; refine later
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, session.user.id));

    return NextResponse.json({ success: true, skills });
  } catch (error: any) {
    console.error("Resume parse save error:", error);
    return NextResponse.json({ error: error.message || "Failed to save resume" }, { status: 500 });
  }
}