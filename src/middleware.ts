import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server'

const isPublicPage = createRouteMatcher(['/auth'])

export default convexAuthNextjsMiddleware((request) => {
  if (!isPublicPage(request) && !isAuthenticatedNextjs()) {
    // If not in a public page and if not authenticated
    return nextjsMiddlewareRedirect(request, '/auth')
  }

  // TODO: Redirect user away from "/sign-in" and "/sign-up" if already authenticated
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
