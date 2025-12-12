// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://photographer-portfolio-server-ufbc.onrender.com";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(request: NextRequest, { params }: any) {
  const path = params.path.join("/");
  const url = `${BACKEND_URL}/${path}`;

  // Forward body + headers
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": request.headers.get("Content-Type") || "application/json",
    },
    body: await request.text(),
    credentials: "include",
  });

  // Copy response
  const data = await response.text();

  // 🔥 Nếu backend trả Set-Cookie → ghi lại cookie ở domain Vercel
  const nextResponse = new NextResponse(data, {
    status: response.status,
    headers: response.headers,
  });

  return nextResponse;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, { params }: any) {
  const path = params.path.join("/");
  const url = `${BACKEND_URL}/${path}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.text();

  const nextResponse = new NextResponse(data, {
    status: response.status,
    headers: response.headers,
  });

  return nextResponse;
}
