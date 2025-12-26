# Authentication Migration to Next.js 16 proxy.ts

## Overview

Successfully migrated from client-side authentication (useEffect redirects) to server-side authentication using Next.js 16's new `proxy.ts` middleware feature.

## Changes Made

### 1. Created proxy.ts Middleware

**File**: [proxy.ts](proxy.ts)

- Implements server-side route protection
- Protects all `/admin/*` routes
- Allows public access to `/` and `/login`
- Reads `accessToken` from cookies
- Redirects unauthenticated users to login with return URL
- Redirects authenticated users from login page to admin

```typescript
export const config = {
  matcher: ["/admin/:path*"],
};
```

### 2. Updated AuthContext

**File**: [contexts/AuthContext.tsx](contexts/AuthContext.tsx)

**Added**:

- `setCookie()` and `deleteCookie()` helper functions
- Cookie storage alongside localStorage

**Modified**:

- `login()`: Now stores tokens in both localStorage AND cookies
- `handleLogout()`: Clears both localStorage AND cookies
- Response interceptor: Updates cookies when tokens are refreshed
- **Removed**: Client-side redirect logic (useEffect) - now handled by proxy.ts

**Why Keep AuthContext**:

- Manages client-side authentication state
- Handles axios interceptors for API calls
- Auto-refreshes expired tokens
- Provides user data to React components

### 3. Updated Login Page

**File**: [app/login/page.tsx](app/login/page.tsx)

**Added**:

- `useSearchParams()` to read redirect query parameter
- Manual redirect after successful login
- Redirects to original page or `/admin` by default

```typescript
const redirect = searchParams.get("redirect") || "/admin";
router.push(redirect);
```

## Architecture

### Cookie + localStorage Strategy

Tokens are stored in BOTH locations for different purposes:

| Storage          | Purpose                    | Accessed By         |
| ---------------- | -------------------------- | ------------------- |
| **Cookies**      | Server-side authentication | proxy.ts middleware |
| **localStorage** | Client-side API calls      | axios interceptors  |

### Authentication Flow

```
1. User logs in → Login page
2. Backend returns tokens → {accessToken, refreshToken, user}
3. Frontend stores tokens → localStorage + Cookies
4. User navigates to /admin → proxy.ts checks cookie
5. If valid → Allow access
6. If invalid → Redirect to /login?redirect=/admin
7. After login → Redirect to original page
```

## Benefits

### Before (Client-Side Auth)

- ❌ Flash of wrong content before redirect
- ❌ Client-side only validation
- ❌ SEO issues with JavaScript navigation
- ❌ Less secure (client can bypass initial check)

### After (Server-Side Auth with proxy.ts)

- ✅ No content flash - validation before render
- ✅ Server-side security - cannot bypass
- ✅ Proper HTTP redirects (302)
- ✅ Better SEO and performance
- ✅ Works without JavaScript

## Testing

### Test Scenarios

1. **Access protected route without auth**:

   ```
   Navigate to: http://localhost:3000/admin
   Expected: Redirect to /login?redirect=/admin
   ```

2. **Login and redirect**:

   ```
   1. Get redirected to login with query param
   2. Enter credentials and submit
   3. Should redirect back to /admin
   ```

3. **Access login when already authenticated**:

   ```
   Navigate to: http://localhost:3000/login
   Expected: Redirect to /admin
   ```

4. **Token expiry handling**:

   ```
   1. Login successfully
   2. Wait 15+ minutes (access token expires)
   3. Make API call
   4. Should auto-refresh token and update cookie
   ```

5. **Logout**:
   ```
   1. Click logout button
   2. Cookies and localStorage cleared
   3. Redirect to /login
   ```

## Configuration

### Cookie Settings

- **Access Token**: 1 day expiry, path=/, SameSite=Lax
- **Refresh Token**: 7 days expiry, path=/, SameSite=Lax

### Protected Routes

Configure in [proxy.ts](proxy.ts):

```typescript
export const config = {
  matcher: [
    "/admin/:path*",
    // Add more protected routes here
  ],
};
```

## Troubleshooting

### Issue: Redirect loop

**Cause**: Login page included in matcher
**Solution**: Ensure `/login` is NOT in matcher array

### Issue: Cookies not set

**Cause**: Browser blocking third-party cookies
**Solution**: Check SameSite policy and domain settings

### Issue: Token not found in proxy.ts

**Cause**: Cookies not being sent from client
**Solution**: Verify cookie is set correctly in browser DevTools

### Issue: Still getting 401 errors

**Cause**: Token expired but cookie not updated
**Solution**: Check axios interceptor is updating cookie on refresh

## Migration Checklist

- [x] Created proxy.ts with route protection
- [x] Updated AuthContext to use cookies
- [x] Removed client-side redirect logic from AuthContext
- [x] Updated login page to handle redirect parameter
- [x] Updated logout to clear cookies
- [x] Updated token refresh to update cookies
- [x] Tested protected routes
- [x] Tested login flow
- [x] Tested logout flow
- [x] Created documentation

## Next Steps

1. **Optional**: Add token validation in proxy.ts by calling backend API
2. **Optional**: Implement CSRF protection
3. **Optional**: Add rate limiting for login attempts
4. **Optional**: Implement "Remember Me" functionality with longer cookie expiry

## Related Files

- [proxy.ts](proxy.ts) - Server-side middleware
- [contexts/AuthContext.tsx](contexts/AuthContext.tsx) - Client-side auth state
- [app/login/page.tsx](app/login/page.tsx) - Login interface
- [lib/apis/authApi.ts](lib/apis/authApi.ts) - Auth API calls
- [PROXY_AUTH.md](PROXY_AUTH.md) - Detailed proxy.ts documentation
