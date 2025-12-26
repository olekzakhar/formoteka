import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match /forms and all its subpages except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - image files (svg, png, jpg, jpeg, gif, webp)
     */
    '/forms/:path*',
  ],
}








// proxy.js

// import { updateSession } from '@/utils/supabase/middleware'
// import { NextResponse } from 'next/server'

// export async function proxy(request) {
//   const url = request.nextUrl.clone()
//   const hostname = request.headers.get('host') || ''
  
//   // Get the subdomain
//   const subdomain = getSubdomain(hostname)
  
//   // If there's a subdomain and it's not 'www', rewrite to the form page
//   if (subdomain && subdomain !== 'www') {
//     // Only rewrite if not already on a form path to avoid loops
//     if (!url.pathname.startsWith('/form/')) {
//       url.pathname = `/form/${subdomain}${url.pathname === '/' ? '' : url.pathname}`
      
//       // Update session and rewrite
//       const sessionResponse = await updateSession(request)
//       return NextResponse.rewrite(url, {
//         request: {
//           headers: sessionResponse.headers,
//         },
//       })
//     }
//   }
  
//   // Default: just update session
//   return await updateSession(request)
// }

// function getSubdomain(hostname) {
//   // Remove port for local development
//   const host = hostname.split(':')[0]
  
//   // Define your base domains
//   const baseDomains = [
//     'localhost',
//     'formoteka.vercel.app',
//     'yourdomain.com' // Add your production domain if you have one
//   ]
  
//   // Check each base domain
//   for (const baseDomain of baseDomains) {
//     if (host.endsWith(baseDomain) && host !== baseDomain) {
//       const subdomain = host.replace(`.${baseDomain}`, '')
//       // Ensure it's not nested subdomains
//       if (!subdomain.includes('.')) {
//         return subdomain
//       }
//     }
//   }
  
//   return null
// }

// export const config = {
//   matcher: [
//     /*
//      * Match /dashboard and all its subpages except for:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - image files (svg, png, jpg, jpeg, gif, webp)
//      */
//     '/dashboard/:path*',
//     /*
//      * Also match root and other paths for subdomain detection
//      * (won't affect auth, just enables subdomain routing)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }