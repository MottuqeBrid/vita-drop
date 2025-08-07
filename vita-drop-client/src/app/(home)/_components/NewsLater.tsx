"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function NewsLater() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    // Simulate successful subscription (you can add API call here)
    Swal.fire({
      icon: "success",
      title: "Subscribed!",
      text: "You have successfully subscribed to our newsletter.",
    });

    setEmail("");
  };

  return (
    <div className="max-w-xl mx-auto bg-base-200 p-8 rounded-lg shadow-lg my-10 text-center">
      <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
      <p className="mb-6 text-sm text-gray-600">
        Subscribe to our newsletter for the latest news and updates.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 items-center justify-center"
      >
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full sm:w-auto flex-1"
          required
        />
        <button type="submit" className="btn btn-primary px-6">
          Subscribe
        </button>
      </form>
    </div>
  );
}
