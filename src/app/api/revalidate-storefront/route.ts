import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

type JwtClaims = {
  memberType?: string;
  exp?: number;
};

const ADMIN_TYPES = new Set(["ADMIN", "SUPER_ADMIN"]);

function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization") || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

function isAuthorizedAdmin(token: string): boolean {
  try {
    const claims = jwtDecode<JwtClaims>(token);
    const memberType = String(claims.memberType || "").toUpperCase();
    const isExpired = typeof claims.exp === "number" && Date.now() >= claims.exp * 1000;

    return !isExpired && ADMIN_TYPES.has(memberType);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const token = getBearerToken(request);

  if (!token || !isAuthorizedAdmin(token)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/", "page");
  revalidatePath("/grocery-1", "page");

  return NextResponse.json({
    success: true,
    revalidated: ["/", "/grocery-1"]
  });
}