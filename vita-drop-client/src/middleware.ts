import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Skip API route & public pages
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/about",
    "/contact",
    "/terms",
    "/donors",
    "/blog",
  ];

  const refreshToken = request.cookies.get("refreshToken")?.value;
  const accessToken = request.cookies.get("accessToken")?.value;

  // If it's a public path and user is NOT logged in → just allow
  if (publicPaths.includes(pathname) && !refreshToken && !accessToken) {
    return NextResponse.next();
  }
  // If it's a public path and user is NOT logged in → just allow
  if (!publicPaths.includes(pathname) && !refreshToken && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/middleware`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}; accessToken=${accessToken}`,
        },
      }
    );

    const data = await response.json();
    console.log(data);

    if (data?.error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (data?.user) {
      const {
        role,
        account: { ban, suspended, deactivated, delete: isDeleted },
      } = data.user;

      if (ban || suspended || deactivated || isDeleted) {
        if (ban) {
          return NextResponse.redirect(new URL("/ban", request.url));
        }
        if (suspended) {
          return NextResponse.redirect(new URL("/suspended", request.url));
        }
        if (deactivated) {
          return NextResponse.redirect(new URL("/deactivated", request.url));
        }
        if (isDeleted) {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      }

      // Example: role-based restriction
      if (
        role === "donor" ||
        role === "admin" ||
        role === "hospital" ||
        role === "volunteer" ||
        role === "guest"
      ) {
        return NextResponse.next(); // ✅ allow
      }
    }
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/about",
    "/contact",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/blog",
    "/donors",
  ],
};
