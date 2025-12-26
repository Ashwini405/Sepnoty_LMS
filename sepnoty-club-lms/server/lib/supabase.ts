
// import { createClient, SupabaseClient } from "@supabase/supabase-js";
// import dotenv from "dotenv";

// dotenv.config();

// let cachedJWT: string | null = null;
// let jwtExpiry = 0;

// async function getProjectJWT(): Promise<string> {
//   if (cachedJWT && Date.now() < jwtExpiry - 24 * 60 * 60 * 1000) {
//     return cachedJWT;
//   }

//   if (
//     !process.env.AMAPOLA_API_URL ||
//     !process.env.PROJECT_ID ||
//     !process.env.AMAPOLA_AUTH_TOKEN
//   ) {
//     throw new Error("Missing AMAPOLA environment variables");
//   }

//   const jwtUrl = `${process.env.AMAPOLA_API_URL}/projects/${process.env.PROJECT_ID}/jwt`;

//   const response = await fetch(jwtUrl, {
//     headers: {
//       Authorization: `Bearer ${process.env.AMAPOLA_AUTH_TOKEN}`,
//       "Content-Type": "application/json",
//     },
//   });

// //   if (!response.ok) {
// //     const errorText = await response.text();
// //     throw new Error(`Failed to get JWT: ${response.status} ${errorText}`);
// //   }

// //   const { jwt, expires_in } = await response.json();

// //   cachedJWT = jwt;
// //   jwtExpiry = Date.now() + expires_in * 1000;

// //   return cachedJWT;
// if (!response.ok) {
//   const errorText = await response.text();
//   throw new Error(`Failed to get JWT: ${response.status} ${errorText}`);
// }

// const data = (await response.json()) as {
//   jwt: string;
//   expires_in: number;
// };

// cachedJWT = data.jwt;
// jwtExpiry = Date.now() + data.expires_in * 1000;

// return cachedJWT;
// }

// // export const supabase: SupabaseClient | null =
// //   process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
// //     ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
// //         auth: {
// //           persistSession: false,
// //         },
// //         accessToken: async () => getProjectJWT(),
// //       })
// //     : null;
// export const supabase: SupabaseClient | null =
//   process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
//     ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
//     : null;


// export const isSupabaseReady = (): boolean => !!supabase;

// const TABLE_PREFIX =
//   process.env.TABLE_PREFIX ||
//   (process.env.PROJECT_ID
//     ? "proj_" + process.env.PROJECT_ID.replace(/-/g, "")
//     : "");

// export const getTableName = (base: string): string => {
//   if (!TABLE_PREFIX) return base;

//   const safe = base.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
//   const prefix = TABLE_PREFIX.endsWith("_")
//     ? TABLE_PREFIX
//     : TABLE_PREFIX + "_";

//   const full = prefix + safe;
//   return full.length > 63 ? full.slice(0, 63) : full;
// };
// import { createClient, SupabaseClient } from "@supabase/supabase-js";
// import dotenv from "dotenv";

// dotenv.config();

// const supabaseUrl = process.env.SUPABASE_URL!;
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// export const supabase: SupabaseClient = createClient(
//   supabaseUrl,
//   supabaseServiceKey
// );

// export const isSupabaseReady = (): boolean => {
//   return !!supabaseUrl && !!supabaseServiceKey;
// };

// export const getTableName = (base: string): string => {
//   return base; // no prefix needed
// };
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Required ENV variables:
 * SUPABASE_URL
 * SUPABASE_SERVICE_ROLE_KEY
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Supabase environment variables are missing");
}

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

export const isSupabaseReady = (): boolean => {
  return !!supabase;
};

/**
 * No table prefixing needed
 * Direct table access
 */
export const getTableName = (table: string): string => {
  return table;
};
