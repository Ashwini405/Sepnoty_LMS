
import { useState } from "react";

const API_URL = "http://localhost:3001";

export default function AuthForm() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ======================
     SEND OTP
  ====================== */
  const sendOtp = async () => {
    if (!email) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send OTP");

      setMessage("OTP sent to your email");
      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     VERIFY OTP
  ====================== */
  const verifyOtp = async () => {
    if (otp.length !== 6) return; // ✅ typo fixed

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Invalid OTP");

      // ✅ minimal session for ProtectedRoute
      const user = {
        id: email,
        email,
        name: email.split("@")[0],
      };

      localStorage.setItem("sepnoty_user", JSON.stringify(user));

      // ✅ HashRouter-safe redirect
      window.location.href = "#/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-purple-600 to-fuchsia-600 px-4">
      <div className="w-full max-w-md text-center text-white">

        {/* LOGO */}
        <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
          🎓
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-2">Sepnoty Club</h1>
        <p className="text-sm text-purple-100 mb-8">
          Your journey to knowledge starts here. Join thousands of learners achieving their goals.
        </p>

        {/* STATS */}
        <div className="flex gap-4 mb-8">
          <StatCard value="50K+" label="Students" />
          <StatCard value="200+" label="Courses" />
          <StatCard value="95%" label="Success" />
        </div>

        {/* AUTH CARD */}
        <div className="bg-white text-gray-800 rounded-2xl shadow-xl p-6 text-left">

          <h2 className="text-xl font-semibold mb-4 text-center">
            {step === "email" ? "Login with Email" : "Enter OTP"}
          </h2>

          {message && (
            <p className="mb-3 text-sm text-green-600 text-center">{message}</p>
          )}

          {error && (
            <p className="mb-3 text-sm text-red-600 text-center">{error}</p>
          )}

          {/* EMAIL STEP */}
          {step === "email" && (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <button
                onClick={sendOtp}
                disabled={loading || !email}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <>
              <input
                type="text"
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                className="w-full text-center tracking-widest text-lg rounded-lg border px-4 py-3 mb-4 focus:ring-2 focus:ring-green-500 outline-none"
              />

              <button
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="mt-3 w-full text-sm text-purple-600 hover:underline text-center"
              >
                Resend OTP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ======================
   STAT CARD
====================== */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 rounded-xl bg-white/20 py-4">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-purple-100">{label}</div>
    </div>
  );
}
// import { useState } from "react";

// const API_URL = "http://localhost:3001"; // Backend URL

// export default function AuthForm() {
//   const [step, setStep] = useState<"email" | "otp">("email");
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   /* ======================
//      SEND OTP
//   ====================== */
//   const sendOtp = async () => {
//     if (!email) return;

//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const res = await fetch(`${API_URL}/api/auth/send-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.error || "Failed to send OTP");
//       }

//       setMessage("OTP sent to your email");
//       setStep("otp");
//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ======================
//      VERIFY OTP (FINAL FIX)
//   ====================== */
//   const verifyOtp = async () => {
//     if (otp.length !== 6) return;

//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.error || "Invalid or expired OTP");
//       }

//       // ✅ CREATE USER OBJECT (CRITICAL)
//       const user = {
//         id: email,
//         email: email,
//         name: email.split("@")[0],
//       };

//       // ✅ STORE USER
//       localStorage.setItem("sepnoty_user", JSON.stringify(user));

//       // ✅ HARD REDIRECT (HashRouter)
//       window.location.href = "#/dashboard";

//     } catch (err: any) {
//       setError(err.message || "Verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg w-full max-w-md shadow">
//         <h2 className="text-2xl font-bold mb-4 text-center">
//           {step === "email" ? "Login with Email" : "Enter OTP"}
//         </h2>

//         {message && <p className="text-green-600 mb-3">{message}</p>}
//         {error && <p className="text-red-600 mb-3">{error}</p>}

//         {/* EMAIL STEP */}
//         {step === "email" && (
//           <>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full border p-3 rounded mb-4"
//             />

//             <button
//               onClick={sendOtp}
//               disabled={loading || !email}
//               className="w-full bg-purple-600 text-white py-3 rounded"
//             >
//               {loading ? "Sending OTP..." : "Send OTP"}
//             </button>
//           </>
//         )}

//         {/* OTP STEP */}
//         {step === "otp" && (
//           <>
//             <input
//               type="text"
//               placeholder="Enter 6-digit OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               maxLength={6}
//               className="w-full border p-3 rounded mb-4 tracking-widest text-center"
//             />

//             <button
//               onClick={verifyOtp}
//               disabled={loading || otp.length !== 6}
//               className="w-full bg-green-600 text-white py-3 rounded"
//             >
//               {loading ? "Verifying..." : "Verify & Login"}
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
