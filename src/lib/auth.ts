import { betterAuth } from "better-auth";
import { phoneNumber } from "better-auth/plugins";
import twilio from "twilio";
import { db } from "@/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { users, sessions, accounts, verifications } from "@/db/schema";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

console.log("Twilio Verify Service SID loaded:", process.env.TWILIO_VERIFY_SERVICE_SID);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber }) => {
        // Twilio Verify generates and sends its own code via real SMS
        await twilioClient.verify.v2
          .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
          .verifications.create({ to: phoneNumber, channel: "sms" });
      },
      verifyOTP: async ({ phoneNumber, code }) => {
        // Ask Twilio to check the code the user typed in
        const check = await twilioClient.verify.v2
          .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
          .verificationChecks.create({ to: phoneNumber, code });
        return check.status === "approved";
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => `${phoneNumber.replace(/\D/g, "")}@phone.local`,
        getTempName: (phoneNumber) => phoneNumber,
      },
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Session = typeof auth.$Infer.Session;