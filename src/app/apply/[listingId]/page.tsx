"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";

interface Listing {
  id: string;
  title: string;
  company: string;
  description: string | null;
  url: string;
  location: string | null;
}

interface Profile {
  contactEmail: string;
  resumeUrl: string | null;
  field: string;
  subdomains: string[];
  experienceLevel: string;
}

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const listingId = params?.listingId as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session && listingId) {
      fetchData();
    }
  }, [session, listingId]);

  const fetchData = async () => {
    try {
      const [listingsRes, profileRes] = await Promise.all([
        fetch("/api/listings"),
        fetch("/api/profile"),
      ]);

      if (listingsRes.ok && profileRes.ok) {
        const listingsData = await listingsRes.json();
        const profileData = await profileRes.json();

        const found = listingsData.listings.find((l: Listing) => l.id === listingId);
        setListing(found || null);
        setProfile(profileData.profile);

        if (found && profileData.profile) {
          generateEmail(found, profileData.profile);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load application data");
    } finally {
      setLoading(false);
    }
  };

  const generateEmail = (listing: Listing, profile: Profile) => {
    const subject = `Application for ${listing.title} at ${listing.company}`;
    const body = `Dear Hiring Manager,

I am writing to express my interest in the ${listing.title} position at ${listing.company}${listing.location ? ` (${listing.location})` : ""}.

${profile.field ? `With a background in ${profile.field}` : "I am"}${profile.experienceLevel ? ` and ${profile.experienceLevel} of experience` : ""}, I believe I would be a strong fit for this role. ${profile.subdomains.length > 0 ? `My expertise includes ${profile.subdomains.slice(0, 3).join(", ")}.` : ""}

I have attached my resume for your review. I would welcome the opportunity to discuss how my skills and experience align with your team's needs.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
${session?.user.name}`;

    setEmailSubject(subject);
    setEmailBody(body);
  };

  const handleSend = async () => {
    if (!profile?.resumeUrl) {
      setError("Please upload a resume in your profile first");
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/send-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          subject: emailSubject,
          body: emailBody,
        }),
      });

      if (response.ok) {
        alert("Application sent successfully!");
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to send application");
      }
    } catch (error) {
      setError("Failed to send application");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Listing not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Apply to Position</h1>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h2 className="font-semibold text-gray-900">{listing.title}</h2>
              <p className="text-gray-700">{listing.company}</p>
              {listing.location && <p className="text-sm text-gray-600">📍 {listing.location}</p>}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Body (review and edit)
              </label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Note:</strong> This will open the job posting in a new tab. You can use the
                generated email text above to apply directly on their website. Gmail integration for
                auto-sending is available when HR emails are provided.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Back to Dashboard
              </button>
              <a
                href={listing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-center"
              >
                Open Application Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
