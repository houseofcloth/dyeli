/**
 * DyeLi
 * ============================================
 * - CLI URL shortener
 * - Cloudflare Workers URL redirector
 * - Simple homepage/404 page
 * - Private links list page
 * 
 * Copyright 2022 House of Cloth (https://houseofcloth.com.au)
 *           2022 Siqli (https://siq.li)
 * 
 * SPDX-License-Identifier: Jam
 */

// Import redirects
import redirects from "./redirects.json"

// Import HTML
import instaPage from "../dist/insta.html"
import notFoundPage from "../dist/404.html"

//
const robotsTXT = `User-Agent: *
Disallow: /
`

// Standard Response headers
const headers = new Headers({
  'Referrer-Policy': 'no-referrer',
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Feature-Policy': 'none',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Robots-Tag': 'index, follow, noarchive, nosnippet, notranslate',
  "Content-Security-Policy": "base-uri 'self'; script-src 'none'; style-src 'nonce-e36adc6a4f48' https://fonts.googleapis.com; img-src 'self'; object-src 'self'; frame-ancestors 'none';",
  'DyeLi': 'v2.3.0',
})

//
export default {
  fetch({ method, url }, env) {

    // Slice `/` from pathname
    const { pathname } = new URL(url)
          // REMOVED: www checking
    
    // REMOVED: GET and HEAD

    // Robots
    if (pathname === "/robots.txt") 
      return new Response(robotsTXT)
    
    // Favicon
    if (pathname === "/favicon.png") 
      return fetch(env.FAVICON_URL)

    // This isn't necessary, but...
    if (pathname === "/favicon.ico") {
      headers.set('Cache-Control', 's-maxage=604800')
      return new Response(null, {
        status: 204,
        headers,
      })
    }

    // Handle redirects as first priority
    const path = pathname.slice(1)
    if (redirects.hasOwnProperty(path)) {
      headers.set('Cache-Control', 's-maxage=86400')
      headers.append('Location', redirects[path])
      return new Response(null, {
        status: 301,
        headers,
      })
    }

    // Redirect domain root
    if (pathname === "/") {
      headers.set('Location', env.DEFAULT_REDIRECT)
      return new Response(`Redirecting to ${env.DEFAULT_REDIRECT}`, {
        status: 301,
        headers,
      })
    }

    // IG link in bio page
    if (pathname === "/insta") {
      headers.set('Cache-Control', 's-maxage=86400')
      headers.set('Content-Type', 'text/html;charset=utf-8')
      return new Response(instaPage, {
        headers,
      })
    }

    // Show 404 for all other requests
    headers.set('Content-Type', 'text/html;charset=utf-8')
    return new Response(notFoundPage, {
      status: 404,
      headers,
    })
  }
}
