import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  
  
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("TOKEN:", token);
  
  if (!token) {
    console.log("NO TOKEN - REDIRECTING");
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  console.log("TOKEN EXISTS - CONTINUE");
  return NextResponse.next();
}

export const config = {
  matcher: ["/portfolio", "/settings"],
};