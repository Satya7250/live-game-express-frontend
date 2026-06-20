import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}

export async function POST(req: NextRequest) {
  return proxyRequest(req);
}

export async function PUT(req: NextRequest) {
  return proxyRequest(req);
}

export async function PATCH(req: NextRequest) {
  return proxyRequest(req);
}

export async function DELETE(req: NextRequest) {
  return proxyRequest(req);
}

async function proxyRequest(req: NextRequest) {
  const path = req.nextUrl.pathname.replace("/api", "");
  const url = `${BACKEND_URL}${path}${req.nextUrl.search}`;

  // Get request body
  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const reqBody = await req.text();
    if (reqBody) body = reqBody;
  }

  // Create headers for backend request
  const headers = new Headers(req.headers);
  // Remove Next.js-specific headers that can cause issues
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");
  headers.delete("transfer-encoding");
  // Set correct content type
  if (!headers.has("content-type") && body) {
    headers.set("content-type", "application/json");
  }

  // Forward cookies from request to backend
  const cookies = req.headers.get("cookie");
  if (cookies) {
    headers.set("cookie", cookies);
  }

  // Make request to backend
  const backendResponse = await fetch(url, {
    method: req.method,
    headers,
    body,
    credentials: "include",
  });

  // Create Next.js response from backend response
  const response = new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
  });

  // Copy headers from backend to response, except content-length and hop-by-hop headers
  backendResponse.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey !== "content-length" &&
      lowerKey !== "connection" &&
      lowerKey !== "transfer-encoding" &&
      lowerKey !== "keep-alive" &&
      lowerKey !== "proxy-connection" &&
      lowerKey !== "upgrade"
    ) {
      // For Set-Cookie headers: adjust domain and attributes for frontend
      if (lowerKey === "set-cookie") {
        const cookies = backendResponse.headers.getSetCookie();
        cookies.forEach((cookie) => {
          // Modify cookie to work on frontend domain
          let modifiedCookie = cookie;
          // Remove Domain attribute (let browser set it to frontend domain)
          modifiedCookie = modifiedCookie.replace(/;\s*Domain=[^;]*/gi, "");
          // Add Path=/ if not present
          if (!/;\s*Path=/i.test(modifiedCookie)) {
            modifiedCookie += "; Path=/";
          }
          response.headers.append("Set-Cookie", modifiedCookie);
        });
      } else {
        response.headers.set(key, value);
      }
    }
  });

  return response;
}
