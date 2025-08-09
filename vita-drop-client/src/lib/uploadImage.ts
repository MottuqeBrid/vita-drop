export const uploadImage = async (file: File) => {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
    method: "POST",
    body: form,
  });
  return res.json();
};
