import { db } from "@/db";
import { sql } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await db.execute(sql`select 1`);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Sign up once,
            <span className="text-blue-600"> apply everywhere</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Create your profile once and apply to hundreds of internships, placements, and jobs with
            just one click. Let us handle the applications while you focus on preparation.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/signin"
              className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 border border-gray-300 transition text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Matching</h3>
            <p className="text-gray-600">
              Tell us your preferences once, and we'll show you only the most relevant opportunities
              based on your profile.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">One-Click Apply</h3>
            <p className="text-gray-600">
              Apply to multiple positions with a single click. We auto-generate personalized
              applications using your profile.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Everything</h3>
            <p className="text-gray-600">
              Keep track of all your applications in one place. Never lose track of where you've
              applied.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">Sign Up</h4>
                <p className="text-gray-600">
                  Create your account using Google, LinkedIn, or email in seconds.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">Complete Your Profile</h4>
                <p className="text-gray-600">
                  Tell us what you're looking for, upload your resume, and set your preferences.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">Browse & Apply</h4>
                <p className="text-gray-600">
                  See curated job listings matching your profile and apply with one click.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="bg-blue-600 text-white rounded-2xl p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to streamline your job search?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join thousands of students and professionals finding their dream opportunities.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
            >
              Start Applying Today
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
