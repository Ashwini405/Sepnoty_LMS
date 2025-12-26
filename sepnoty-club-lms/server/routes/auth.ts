import express from "express";
import { generateOTP, hashOTP } from "../utils/otp";
import { sendOTP } from "../utils/mailer";
import { supabase } from "../lib/supabase";

const router = express.Router();

/* ================= SEND OTP ================= */
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = generateOTP();
  const otpHash = hashOTP(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  await supabase.from("email_otps").insert({
    email,
    otp_hash: otpHash,
    expires_at: expiresAt,
    verified: false,
  });

  await sendOTP(email, otp);

  res.json({ success: true });
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const otpHash = hashOTP(otp);

  const { data } = await supabase
    .from("email_otps")
    .select("*")
    .eq("email", email)
    .eq("otp_hash", otpHash)
    .eq("verified", false)
    .gte("expires_at", new Date())
    .single();

  if (!data) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  await supabase
    .from("email_otps")
    .update({ verified: true })
    .eq("id", data.id);

  res.json({ success: true });
});

export default router;
