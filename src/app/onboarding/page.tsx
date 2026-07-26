"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    status: "",
    field: "",
    customField: "",
    subdomains: [] as string[],
    customSubdomain: "",
    locationPreferences: [] as string[],
    customLocation: "",
    experienceLevel: "",
    contactEmail: session?.user?.email || "",
    resume: null as File | null,
  });

  const statusOptions = [
    { value: "internship", label: "Student — Looking for internship" },
    { value: "placement", label: "Student — Looking for placement" },
    { value: "job", label: "Working professional — Looking for job change" },
  ];

  const fieldOptions = ["Tech", "Non-tech", "Core engineering", "Other"];

  const subdomainOptions = [
    "Software Development",
    "Data Science",
    "Design",
    "Marketing",
    "Finance",
    "Mechanical",
    "Civil",
    "Electrical",
    "Product Management",
    "Sales",
  ];

  const locationOptions = ["Remote", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai"];

  const experienceLevels = [
    { value: "fresher", label: "Fresher" },
    { value: "0-2", label: "0-2 years" },
    { value: "2-5", label: "2-5 years" },
    { value: "5+", label: "5+ years" },
  ];

  const handleSubdomainToggle = (subdomain: string) => {
    setFormData((prev) => ({
      ...prev,
      subdomains: prev.subdomains.includes(subdomain)
        ? prev.subdomains.filter((s) => s !== subdomain)
        : [...prev.subdomains, subdomain],
    }));
  };

  const handleLocationToggle = (location: string) => {
    setFormData((prev) => ({
      ...prev,
      locationPreferences: prev.locationPreferences.includes(location)
        ? prev.locationPreferences.filter((l) => l !== location)
        : [...prev.locationPreferences, location],
    }));
  };

  const addCustomSubdomain = () => {
    if (formData.customSubdomain.trim()) {
      setFormData((prev) => ({
        ...prev,
        subdomains: [...prev.subdomains, prev.customSubdomain.trim()],
        customSubdomain: "",
      }));
    }
  };

  const addCustomLocation = () => {
    if (formData.customLocation.trim()) {
      setFormData((prev) => ({
        ...prev,
        locationPreferences: [...prev.locationPreferences, prev.customLocation.trim()],
        customLocation: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("status", formData.status);
      submitData.append("field", formData.field === "Other" ? formData.customField : formData.field);
      submitData.append("subdomains", JSON.stringify(formData.subdomains));
      submitData.append("locationPreferences", JSON.stringify(formData.locationPreferences));
      submitData.append("experienceLevel", formData.experienceLevel);
      submitData.append("contactEmail", formData.contactEmail);
      if (formData.resume) {
        submitData.append("resume", formData.resume);
      }

      const response = await fetch("/api/onboarding", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
            <p className="text-gray-600 mt-2">Help us personalize your job recommendations</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are you looking for? *
              </label>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={formData.status === option.value}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                      className="mr-2"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field/Domain *</label>
              <select
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a field</option>
                {fieldOptions.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
              {formData.field === "Other" && (
                <input
                  type="text"
                  placeholder="Specify your field"
                  value={formData.customField}
                  onChange={(e) => setFormData({ ...formData, customField: e.target.value })}
                  required
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            {/* Subdomains */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role/Specialization (select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {subdomainOptions.map((subdomain) => (
                  <label key={subdomain} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.subdomains.includes(subdomain)}
                      onChange={() => handleSubdomainToggle(subdomain)}
                      className="mr-2"
                    />
                    <span className="text-gray-700 text-sm">{subdomain}</span>
                  </label>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom role"
                  value={formData.customSubdomain}
                  onChange={(e) => setFormData({ ...formData, customSubdomain: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addCustomSubdomain}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Add
                </button>
              </div>
              {formData.subdomains.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.subdomains.map((subdomain) => (
                    <span
                      key={subdomain}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {subdomain}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            subdomains: formData.subdomains.filter((s) => s !== subdomain),
                          })
                        }
                        className="ml-2 text-blue-700 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Location Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Preferences
              </label>
              <div className="grid grid-cols-2 gap-2">
                {locationOptions.map((location) => (
                  <label key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.locationPreferences.includes(location)}
                      onChange={() => handleLocationToggle(location)}
                      className="mr-2"
                    />
                    <span className="text-gray-700 text-sm">{location}</span>
                  </label>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom location"
                  value={formData.customLocation}
                  onChange={(e) => setFormData({ ...formData, customLocation: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addCustomLocation}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Add
                </button>
              </div>
              {formData.locationPreferences.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.locationPreferences.map((location) => (
                    <span
                      key={location}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {location}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            locationPreferences: formData.locationPreferences.filter((l) => l !== location),
                          })
                        }
                        className="ml-2 text-green-700 hover:text-green-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level *
              </label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select experience level</option>
                {experienceLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email for Outreach *
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (PDF) *
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setFormData({ ...formData, resume: e.target.files?.[0] || null })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Complete Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
