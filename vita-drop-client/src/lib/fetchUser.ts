import axiosSecure from "./axiosSecure";

export async function fetchUser(url: string) {
  const res = await axiosSecure.get(url);
  return res.data;
}
