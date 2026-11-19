import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  ...routing,
  localePrefix: 'always'
});
export default function middleware(request: NextRequest) {
  if (request.nextUrl.hostname === 'www.theblueeyealbania.com') {
    const url = request.nextUrl.clone();
    url.hostname = 'theblueeyealbania.com';
    return NextResponse.redirect(url, 301);
  }
  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
