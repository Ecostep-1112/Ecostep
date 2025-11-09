# Browser Tab Closing Issue on Mobile OAuth

## Problem
After Google OAuth login on iPhone, the browser tab remains open instead of automatically closing.

## Root Cause
When using Supabase's `signInWithOAuth()`, it opens the system browser for authentication. On iOS, the browser should automatically close when the redirect to `com.ecostep.app://callback` happens, but this doesn't always work reliably.

## Solution: Install Capacitor Browser Plugin

To have full control over the browser window and programmatically close it after OAuth:

### 1. Install the Browser Plugin
```bash
npm install @capacitor/browser
npx cap sync
```

### 2. Update OAuth Flow (Future Enhancement)

Modify `src/lib/auth.js` to use the Browser plugin:

```javascript
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

export const signInWithGoogle = async () => {
  try {
    const platform = Capacitor.getPlatform();

    if (platform === 'ios' || platform === 'android') {
      // Get the OAuth URL from Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'com.ecostep.app://callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: true, // Don't auto-open browser
        },
      });

      if (error) throw error;

      // Open browser manually with the Browser plugin
      if (data?.url) {
        await Browser.open({ url: data.url });

        // Listen for app URL open (callback)
        // The browser will be closed in the App.jsx deep link handler
        // by calling Browser.close()
      }
    } else {
      // Web flow - normal OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getRedirectUrl(),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    }
  } catch (error) {
    console.error('구글 로그인 에러:', error);
    return { data: null, error };
  }
};
```

### 3. Close Browser After Redirect

Add this to the deep link handler in `src/App.jsx`:

```javascript
import { Browser } from '@capacitor/browser';

// Inside the appUrlOpen listener:
if (data.url.includes('callback')) {
  // Close the browser immediately
  await Browser.close();

  // Then proceed with session setup...
}
```

## Current Workaround

For now, users need to manually:
1. Tap the "Done" button in Safari (iOS)
2. Or tap the "X" button in Chrome (Android)

This is a known limitation of using Supabase's built-in OAuth flow on mobile without the Browser plugin.

## Status

- [ ] Install @capacitor/browser
- [ ] Implement skipBrowserRedirect flow
- [ ] Add Browser.close() to deep link handler
- [ ] Test on iOS and Android
