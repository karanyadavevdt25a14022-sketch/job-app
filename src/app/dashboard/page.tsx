"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

interface Listing {
  id: string;
  title: string;
  company: string;
  description: string | null;
  source: string;
  location: string | null;
  url: string;
  deadline: string | null;
  tags: string[];
  field: string | null;
  recipientEmail: string | null;
  applicationType: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);

 useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      checkProfileThenLoad();
    }
  }, [session]);

  const checkProfileThenLoad = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (!data.profile || !data.profile.onboardingCompleted) {
        router.push("/onboarding");
        return;
      }
      fetchListings();
    } catch (error) {
      console.error("Failed to check profile:", error);
      fetchListings(); // fail open so a network hiccup doesn't lock you out
    }
  };

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/listings");
      if (response.ok) {
        const data = await response.json();
        setListings(data.listings || []);
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncListings = async () => {
    setSyncLoading(true);
    try {
      const response = await fetch("/api/sync-listings");
      if (response.ok) {
        await fetchListings();
        alert("Listings synced successfully!");
      } else {
        alert("Failed to sync listings");
      }
    } catch (error) {
      alert("Failed to sync listings");
    } finally {
      setSyncLoading(false);
    }
  };

  const handleApply = (listing: Listing) => {
    router.push(`/apply/${listing.id}`);
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Career Platform</h1>
              <p className="text-sm text-gray-600">Welcome, {session.user.name || session.user.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleSyncListings}
                disabled={syncLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {syncLoading ? "Syncing..." : "Sync Jobs"}
              </button>
              <a
                href="/onboarding"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </a>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recommended Jobs</h2>
          <p className="text-gray-600 text-sm">Based on your profile preferences</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading listings...</div>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No job listings available yet.</p>
            <button
              onClick={handleSyncListings}
              disabled={syncLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {syncLoading ? "Syncing..." : "Load Jobs"}
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                    <p className="text-gray-600 mt-1">{listing.company}</p>
                    {listing.location && (
                      <p className="text-sm text-gray-500 mt-1">📍 {listing.location}</p>
                    )}
                    {listing.description && (
                      <p className="text-sm text-gray-700 mt-3 line-clamp-2">
                        {listing.description.replace(/<[^>]*>/g, "").slice(0, 200)}...
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {listing.source}
                      </span>
                      {listing.field && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {listing.field}
                        </span>
                      )}
                      {listing.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-6 flex flex-col gap-2">
                    <button
                      onClick={() => handleApply(listing)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
                    >
                      Apply
                    </button>
                    <a
                      href={listing.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-center"
                    >
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
