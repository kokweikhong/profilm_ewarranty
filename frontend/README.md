# Profilm E-Warranty Frontend

Next.js 16 application for managing e-warranties with server-side authentication.

## Features

- ✅ Server-side route protection using Next.js 16 proxy.ts
- ✅ JWT-based authentication with access and refresh tokens
- ✅ Auto token refresh on expiry
- ✅ Protected admin routes
- ✅ Public warranty search functionality
- ✅ Responsive UI with Tailwind CSS

## Authentication

This application uses Next.js 16's new `proxy.ts` middleware for server-side authentication. See [PROXY_AUTH.md](PROXY_AUTH.md) for detailed documentation.

### Quick Overview

- **Protected Routes**: All `/admin/*` routes require authentication
- **Public Routes**: `/` (home) and `/login` are publicly accessible
- **Token Storage**: Tokens stored in both localStorage (client API calls) and cookies (server-side validation)
- **Auto Refresh**: Access tokens automatically refreshed on expiry

### Migration Notes

If you're migrating from client-side auth, see [AUTHENTICATION_MIGRATION.md](AUTHENTICATION_MIGRATION.md).

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Project Structure

```
frontend/
├── proxy.ts                 # Next.js 16 middleware for route protection
├── app/
│   ├── (home)/             # Public home page
│   ├── (admin)/            # Protected admin routes
│   └── login/              # Login page
├── contexts/
│   ├── AuthContext.tsx     # Authentication state management
│   └── ToastContext.tsx    # Toast notifications
├── lib/
│   ├── apis/               # API client functions
│   └── utils/              # Utility functions (cookies, etc.)
└── components/             # Reusable components
```

## Testing Authentication

1. **Access protected route without auth**:
   - Navigate to `http://localhost:3000/admin`
   - Should redirect to `/login?redirect=/admin`

2. **Login and redirect back**:
   - Enter credentials on login page
   - Should redirect to original protected page

3. **Access login when authenticated**:
   - Navigate to `http://localhost:3000/login`
   - Should redirect to `/admin`

## Documentation

- [PROXY_AUTH.md](PROXY_AUTH.md) - Detailed proxy.ts authentication guide
- [AUTHENTICATION_MIGRATION.md](AUTHENTICATION_MIGRATION.md) - Migration guide from client-side auth

### Pending

- [ ] Icons for menu and sidebar
- [ ] Auto generate branch code

- [ ] tables to show image
