// // import { createClient, SupabaseClient } from '@supabase/supabase-js'

// // let cachedJWT: string | null = null
// // let jwtExpiry = 0

// // async function getProjectJWT(): Promise<string> {
// //   if (cachedJWT && Date.now() < jwtExpiry - 86400000) {
// //     return cachedJWT
// //   }

// //   const jwtUrl = `${process.env.AMAPOLA_API_URL}/projects/${process.env.PROJECT_ID}/jwt`

// //   const response = await fetch(jwtUrl, {
// //     headers: {
// //       'Authorization': `Bearer ${process.env.AMAPOLA_AUTH_TOKEN}`
// //     }
// //   })

// //   if (!response.ok) {
// //     const errorText = await response.text()
// //     throw new Error(`Failed to get JWT: ${response.status} ${errorText}`)
// //   }

// //   const { jwt, expires_in } = await response.json()
// //   cachedJWT = jwt
// //   jwtExpiry = Date.now() + (expires_in * 1000)

// //   return cachedJWT
// // }

// // export const supabase: SupabaseClient | null =
// //   process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
// //     ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
// //       accessToken: async () => await getProjectJWT()
// //     })
// //     : null

// // export const isSupabaseReady = (): boolean => !!supabase

// // const TABLE_PREFIX =
// //   process.env.TABLE_PREFIX ||
// //   (process.env.PROJECT_ID ? 'proj_' + process.env.PROJECT_ID.replace(/-/g, '') : '')

// // export const getTableName = (base: string): string => {
// //   if (!TABLE_PREFIX) return base
// //   const safe = base.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()
// //   const prefix = TABLE_PREFIX.endsWith('_') ? TABLE_PREFIX : TABLE_PREFIX + '_'
// //   const full = prefix + safe
// //   return full.length > 63 ? full.slice(0, 63) : full
// // }
// import { createClient, SupabaseClient } from "@supabase/supabase-js";
// import fetch from "node-fetch"; // REQUIRED for Node
// import dotenv from "dotenv";

// dotenv.config();

// // --------------------
// // ENV VALIDATION
// // --------------------
// const {
//   SUPABASE_URL,
//   SUPABASE_ANON_KEY,
//   AMAPOLA_API_URL,
//   PROJECT_ID,
//   AMAPOLA_AUTH_TOKEN,
//   TABLE_PREFIX,
// } = process.env;

// let cachedJWT: string | null = null;
// let jwtExpiry = 0;

// // --------------------
// // GET PROJECT JWT
// // --------------------
// async function getProjectJWT(): Promise<string> {
//   if (cachedJWT && Date.now() < jwtExpiry - 24 * 60 * 60 * 1000) {
//     return cachedJWT;
//   }

//   if (!AMAPOLA_API_URL || !PROJECT_ID || !AMAPOLA_AUTH_TOKEN) {
//     throw new Error("Missing AMAPOLA environment variables");
//   }

//   const jwtUrl = `${AMAPOLA_API_URL}/projects/${PROJECT_ID}/jwt`;

//   const response = await fetch(jwtUrl, {
//     headers: {
//       Authorization: `Bearer ${AMAPOLA_AUTH_TOKEN}`,
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`Failed to get JWT: ${response.status} ${errorText}`);
//   }

//   const data = (await response.json()) as {
//     jwt: string;
//     expires_in: number;
//   };

//   cachedJWT = data.jwt;
//   jwtExpiry = Date.now() + data.expires_in * 1000;

//   return cachedJWT;
// }

// // --------------------
// // SUPABASE CLIENT
// // --------------------
// export const supabase: SupabaseClient | null =
//   SUPABASE_URL && SUPABASE_ANON_KEY
//     ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
//         global: {
//           fetch,
//         },
//         auth: {
//           persistSession: false,
//         },
//         accessToken: async () => getProjectJWT(),
//       })
//     : null;

// // --------------------
// // UTILS
// // --------------------
// export const isSupabaseReady = (): boolean => !!supabase;

// const FINAL_TABLE_PREFIX =
//   TABLE_PREFIX ||
//   (PROJECT_ID ? `proj_${PROJECT_ID.replace(/-/g, "")}` : "");

// export const getTableName = (base: string): string => {
//   if (!FINAL_TABLE_PREFIX) return base;

//   const safe = base.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
//   const prefix = FINAL_TABLE_PREFIX.endsWith("_")
//     ? FINAL_TABLE_PREFIX
//     : FINAL_TABLE_PREFIX + "_";

//   const fullName = prefix + safe;
//   return fullName.length > 63 ? fullName.slice(0, 63) : fullName;
// };
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

let cachedJWT: string | null = null;
let jwtExpiry = 0;

async function getProjectJWT(): Promise<string> {
  if (cachedJWT && Date.now() < jwtExpiry - 24 * 60 * 60 * 1000) {
    return cachedJWT;
  }

  if (
    !process.env.AMAPOLA_API_URL ||
    !process.env.PROJECT_ID ||
    !process.env.AMAPOLA_AUTH_TOKEN
  ) {
    throw new Error("Missing AMAPOLA environment variables");
  }

  const jwtUrl = `${process.env.AMAPOLA_API_URL}/projects/${process.env.PROJECT_ID}/jwt`;

  const response = await fetch(jwtUrl, {
    headers: {
      Authorization: `Bearer ${process.env.AMAPOLA_AUTH_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`Failed to get JWT: ${response.status} ${errorText}`);
//   }

//   const { jwt, expires_in } = await response.json();

//   cachedJWT = jwt;
//   jwtExpiry = Date.now() + expires_in * 1000;

//   return cachedJWT;
if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`Failed to get JWT: ${response.status} ${errorText}`);
}

const data = (await response.json()) as {
  jwt: string;
  expires_in: number;
};

cachedJWT = data.jwt;
jwtExpiry = Date.now() + data.expires_in * 1000;

return cachedJWT;
}

export const supabase: SupabaseClient | null =
  process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
        auth: {
          persistSession: false,
        },
        accessToken: async () => getProjectJWT(),
      })
    : null;

export const isSupabaseReady = (): boolean => !!supabase;

const TABLE_PREFIX =
  process.env.TABLE_PREFIX ||
  (process.env.PROJECT_ID
    ? "proj_" + process.env.PROJECT_ID.replace(/-/g, "")
    : "");

export const getTableName = (base: string): string => {
  if (!TABLE_PREFIX) return base;

  const safe = base.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
  const prefix = TABLE_PREFIX.endsWith("_")
    ? TABLE_PREFIX
    : TABLE_PREFIX + "_";

  const full = prefix + safe;
  return full.length > 63 ? full.slice(0, 63) : full;
};
