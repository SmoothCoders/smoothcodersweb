# Build Error Fix: Module Not Found

## ❌ Error Encountered

```
Module not found: Can't resolve '@/lib/db/connect'
In file: app/api/orders/create/route.ts
```

## 🔍 Root Cause

The file `app/api/orders/create/route.ts` was trying to import from a non-existent path:
```typescript
import connectDB from '@/lib/db/connect';  // ❌ Wrong path
```

**The correct database connection file is:** `/lib/mongodb.ts`

## ✅ What Was Fixed

Updated the import in `/app/api/orders/create/route.ts`:

**Before (Incorrect):**
```typescript
import connectDB from '@/lib/db/connect';
```

**After (Correct):**
```typescript
import { connectDB } from '@/lib/mongodb';
```

## 📝 Key Points

1. **Correct Import Path:** `@/lib/mongodb`
2. **Named Export:** Use `{ connectDB }` (destructured import)
3. **File Location:** Database connection is in `/lib/mongodb.ts`

## ✅ Build Should Now Work

The build error is now resolved. You can:

```bash
# Build the application
npm run build

# Or run in development mode
npm run dev
```

## 📚 Reference

For any future database imports in your API routes, always use:

```typescript
import { connectDB } from '@/lib/mongodb';
```

This is the standard pattern used throughout your codebase in files like:
- `/app/api/admin/services/route.ts`
- `/app/api/inquiries/route.ts`
- `/app/[city]/[service]/page.tsx`
- And all other API routes
