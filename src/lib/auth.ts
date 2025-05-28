import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql"
    usePlural: true, // Use plural table names
    schema: schema, // Import your schema from the database
  }),
  user: {
    modelName: "usersTable", // Name of the user model
  },
  session: {
    modelName: "sessionsTable", // Name of the session model
  },
  account: {
    modelName: "accountsTable", // Name of the account model
  },
  verification: {
    modelName: "verificationsTable", // Name of the verification model
  },
  emailAndPassword: { 
    enabled: true, 
  }, 
});
