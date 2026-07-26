import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({ status: applications.status, count: sql<number>`count(*)` })
    .from(applications)
    .where(eq(applications.userId, session.user.id))
    .groupBy(applications.status);

  const stats = { applied: 0, responded: 0, pending: 0, rejected: 0 };
  rows.forEach((r) => (stats[r.status as keyof typeof stats] = Number(r.count)));

  return NextResponse.json({ stats });
}