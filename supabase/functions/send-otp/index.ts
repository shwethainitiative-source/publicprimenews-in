import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if user exists in auth
    const { data: users, error: userErr } = await supabaseAdmin.auth.admin.listUsers();
    if (userErr) throw userErr;

    const userExists = users.users.some((u: any) => u.email?.toLowerCase() === email.toLowerCase());
    if (!userExists) {
      return new Response(JSON.stringify({ error: "No account found with this email" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Invalidate previous OTPs for this email
    await supabaseAdmin.from("password_reset_otps").update({ used: true }).eq("email", email.toLowerCase()).eq("used", false);

    // Save new OTP
    const { error: insertErr } = await supabaseAdmin.from("password_reset_otps").insert({
      email: email.toLowerCase(),
      otp,
      expires_at: expiresAt,
    });
    if (insertErr) throw insertErr;

    // Send email via Gmail SMTP
    const gmailPassword = Deno.env.get("GMAIL_APP_PASSWORD");
    if (!gmailPassword) throw new Error("GMAIL_APP_PASSWORD not configured");

    const gmailUser = "publicprimenews@gmail.com";

    const client = new SmtpClient();
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: gmailUser,
      password: gmailPassword,
    });

    await client.send({
      from: gmailUser,
      to: email,
      subject: "Password Reset OTP - Public Prime",
      content: "text/html",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:20px;">
          <h2 style="color:#333;">Password Reset</h2>
          <p>Your OTP for password reset is:</p>
          <div style="background:#f4f4f4;padding:20px;text-align:center;border-radius:8px;margin:20px 0;">
            <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#222;">${otp}</span>
          </div>
          <p style="color:#666;font-size:14px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          <p style="color:#999;font-size:12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true, message: "OTP sent to your email" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("send-otp error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
