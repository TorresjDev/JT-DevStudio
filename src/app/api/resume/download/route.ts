import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const BUCKET = "resume";
const FILE_PATH = "Resume_JesusTorres.pdf";
const SIGNED_URL_EXPIRY = 60; // seconds — short-lived for security

export async function GET(request: Request) {
  const supabase = await createClient();

  // 1. Verify auth server-side
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to download the resume." },
      { status: 401 }
    );
  }

  // 2. Generate short-lived signed URL from private bucket
  const { data: signedData, error: signedError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(FILE_PATH, SIGNED_URL_EXPIRY, {
      download: "Resume_JesusTorres.pdf",
    });

  if (signedError || !signedData?.signedUrl) {
    console.error("Supabase signed URL error:", signedError);
    return NextResponse.json(
      { error: "Failed to generate download link. Please try again." },
      { status: 500 }
    );
  }

  // 3. Log the download (non-blocking — don't let a log failure block the download)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  supabase
    .from("resume_downloads")
    .insert({
      user_id: user.id,
      user_email: user.email,
      ip_address: ip,
    })
    .then(({ error }) => {
      if (error) console.warn("Resume download log failed:", error.message);
    });

  // 4. Return the signed URL
  return NextResponse.json({ url: signedData.signedUrl });
}
