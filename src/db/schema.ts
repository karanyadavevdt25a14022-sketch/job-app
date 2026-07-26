import { pgTable, text, timestamp, varchar, boolean, jsonb, integer } from "drizzle-orm/pg-core";

// Users table (authentication)
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  emailVerified: boolean("email_verified").default(false),
  name: text("name"),
  image: text("image"),
  phoneNumber: text("phone_number").unique(),
  phoneNumberVerified: boolean("phone_number_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(), // google, phone, credential
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User profiles (onboarding data)
export const profiles = pgTable("profiles", {

  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull(), // internship, placement, job
  field: text("field").notNull(), // tech, non-tech, core, other
  subdomains: jsonb("subdomains").$type<string[]>().default([]),
  locationPreferences: jsonb("location_preferences").$type<string[]>().default([]),
  experienceLevel: text("experience_level"), // fresher, 0-2, 2-5, 5+
  resumeUrl: text("resume_url"), // kept for backward compatibility, unused going forward
  resumeData: text("resume_data"), // base64-encoded PDF bytes, stored directly in Postgres
  parsedSkills: jsonb("parsed_skills").$type<string[]>().default([]),
parsedExperienceSummary: text("parsed_experience_summary"),
applicationsSentCount: integer("applications_sent_count").default(0),
applicationsResponseCount: integer("applications_response_count").default(0),
  resumeFileName: text("resume_file_name"),
  contactEmail: text("contact_email"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  
});

// --- New: Notifications table ---
export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  type: text("type").notNull(), // job_alert, application_update
  readStatus: boolean("read_status").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Job listings
export const listings = pgTable("listings", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description"),
  source: text("source").notNull(), // adzuna, jooble, arbeitnow, manual
  sourceId: text("source_id"),
  location: text("location"),
  url: text("url").notNull(),
  deadline: timestamp("deadline"),
  tags: jsonb("tags").$type<string[]>().default([]),
  field: text("field"), // tech, non-tech, core, other
  experienceLevel: text("experience_level"),
  recipientEmail: text("recipient_email"), // HR email if available
  applicationType: text("application_type"), // email, form, external
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Applications tracking
export const applications = pgTable("applications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  listingId: text("listing_id").notNull().references(() => listings.id, { onDelete: "cascade" }),
  status: text("status").default("applied"), // applied, responded, pending, rejected
  respondedAt: timestamp("responded_at"),
  emailContent: text("email_content"),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
});

// Gmail OAuth tokens for sending emails as user
export const gmailTokens = pgTable("gmail_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  scope: text("scope").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

//addition 
export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type GmailToken = typeof gmailTokens.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
