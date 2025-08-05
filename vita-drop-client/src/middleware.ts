import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const accessToken = request.cookies.get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/middleware`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}; accessToken=${accessToken}`, // ✅ send both cookies
        },
      }
    );

    const data = await response.json();
    if (data?.error) {
      return NextResponse.redirect(new URL("/login", request.url)); // redirect to login page
    } else {
      const {
        message,
        user: {
          _id,
          email,
          role,

          account: { ban, suspended, deactivated, delete: isDeleted },
        },
      } = data;
      if (ban || suspended || deactivated || isDeleted) {
        return NextResponse.redirect(new URL("/login", request.url)); // redirect to login page
      } else if (
        role === "donor" ||
        role === "admin" ||
        role === "hospital" ||
        role === "volunteer" ||
        role === "guest"
      ) {
        return NextResponse.redirect(new URL("/", request.url)); // redirect to home page
      } else if (suspended) {
        return NextResponse.redirect(new URL("/suspended", request.url)); // redirect to suspended page
      } else if (ban) {
        return NextResponse.redirect(new URL("/register", request.url)); // redirect to register page
      } else if (deactivated) {
        return NextResponse.redirect(new URL("/deactivated", request.url)); // redirect to deactivated page
      }
    }
  } catch (error) {
    console.error("Error in middleware:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/about", "/contact", "/terms"],
};
