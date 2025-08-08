"use client";

import axiosSecure from "@/lib/axiosSecure";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    userProfile();
  }, []);
  const userProfile = async () => {
    try {
      const res = await axiosSecure.get("/users/profile");
      if (res.data?.success) setUser(res.data.user);
      else console.warn(res.data.message); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <p>{JSON.stringify(user)}</p>
    </div>
  );
}
