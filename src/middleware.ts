import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Redireciona admin tentando acessar área de cliente
    if (path.startsWith("/user") && token?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    // Redireciona cliente tentando acessar área admin
    if (path.startsWith("/admin") && token?.role === "CLIENT") {
      return NextResponse.redirect(new URL("/user", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"]
}