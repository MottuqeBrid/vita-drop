export const uploadToImgBB = async (
  file: File,
  onSuccess: (url: string) => void,
  onError?: (error: unknown) => void
) => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    console.error("IMGBB API key is missing.");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      onSuccess(data.data.url); // ✅ Callback with the uploaded image URL
    } else {
      console.error("Upload failed:", data);
      onError?.(data);
    }
  } catch (error) {
    console.error("Image upload error:", error);
    onError?.(error);
  }
};
