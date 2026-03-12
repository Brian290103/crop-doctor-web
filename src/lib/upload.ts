export async function uploadFile(
  file: File,
): Promise<{ url: string; name: string; mediaType: string } | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or anon key is missing.");
    return null;
  }

  const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
  const uploadUrl = `${supabaseUrl}/storage/v1/object/crop-doctor/${fileName}`;

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        "x-upsert": "true",
      },
      body: file, // file object is fine here
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to upload file:", error);
      return null;
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/crop-doctor/${fileName}`;

    return {
      url: publicUrl,
      name: file.name,
      mediaType: file.type,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}
