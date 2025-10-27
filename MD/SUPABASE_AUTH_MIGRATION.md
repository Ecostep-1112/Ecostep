# Supabase Authentication Migration Guide

This guide explains how to migrate from localStorage-based user management to Supabase Authentication.

## Overview

**Current Setup:**
- User IDs stored in `localStorage.profileData`
- No real authentication
- RLS policies can't work properly

**After Migration:**
- Real user authentication (email/password)
- Automatic user_info creation
- RLS policies work with `auth.uid()`
- Secure and production-ready

---

## Migration Steps

### 1. Run SQL Setup (Database)

Go to Supabase Dashboard → SQL Editor and run:
```
database/setup_supabase_auth.sql
```

This will:
- Create a trigger to auto-create `user_info` when users sign up
- Update RLS policies to use `auth.uid()`
- Allow users to view public profiles (for rankings)

---

### 2. Wrap Your App with AuthProvider

Update `src/App.jsx` or `src/main.jsx`:

```jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your existing app */}
    </AuthProvider>
  );
}
```

---

### 3. Update Components to Use Auth

#### Example: Challenge.jsx

**Before (using localStorage):**
```javascript
const savedProfileData = localStorage.getItem('profileData');
if (savedProfileData) {
  const parsed = JSON.parse(savedProfileData);
  userId = parsed.userId;
}
```

**After (using Supabase auth):**
```javascript
import { useAuth } from '../../contexts/AuthContext';

const Challenge = () => {
  const { getUserId } = useAuth();

  const handleCompleteToday = async () => {
    const userId = getUserId();  // Get authenticated user ID

    if (!userId) {
      showToast('로그인이 필요합니다', 'error');
      return;
    }

    // Save to Supabase
    const { error } = await supabase
      .from('daily_chal_data')
      .insert({
        record_id: crypto.randomUUID(),
        user_id: userId,  // Use auth user ID
        is_completed: true,
        content: finalChallenge
      });
  };
};
```

---

### 4. Create Login/Signup Pages

**Example: Login Component**

```jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await signIn(email, password);

    if (error) {
      alert('로그인 실패: ' + error.message);
    } else {
      // Redirect to home
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      <button type="submit">로그인</button>
    </form>
  );
};
```

**Example: Signup Component**

```jsx
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signUp } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { data, error } = await signUp(email, password, name);

    if (error) {
      alert('회원가입 실패: ' + error.message);
    } else {
      alert('회원가입 성공! 이메일을 확인해주세요.');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      <button type="submit">회원가입</button>
    </form>
  );
};
```

---

### 5. Protect Routes

Add route protection to require login:

```jsx
import { useAuth } from './contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>로딩중...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

// Usage:
<ProtectedRoute>
  <Challenge />
</ProtectedRoute>
```

---

## Key Changes Required

### Files to Update:

1. **Challenge.jsx** (lines 515-526, 1930-1940)
   - Replace localStorage user ID with `getUserId()`

2. **Community.jsx** & **SearchFriends.jsx**
   - Replace localStorage user ID with `getUserId()`

3. **More.jsx**
   - Use `getUserId()` for user-specific data

4. **App.jsx**
   - Add `<AuthProvider>` wrapper
   - Add login/signup routes

---

## Testing the Migration

1. **Create a test user:**
   ```sql
   -- In Supabase dashboard, go to Authentication → Users → Add User
   -- Or use the signup component
   ```

2. **Test data insertion:**
   - Log in with test user
   - Complete a challenge
   - Check `daily_chal_data` table for new row

3. **Test RLS:**
   - Log in as User A
   - Create challenge
   - Log in as User B
   - User B should NOT see User A's challenges

---

## Rollback Plan

If you need to revert to public access (development only):

Run: `database/safe_rls_policies.sql`

This keeps RLS enabled but allows public access for testing.

---

## Benefits After Migration

✅ **Security**: Users can only access their own data
✅ **Production-ready**: Proper authentication system
✅ **No localStorage**: User data syncs across devices
✅ **Password management**: Built-in password reset, email verification
✅ **Social login**: Easy to add Google/Facebook/Apple login later

---

## Current Status

- ✅ RLS policies updated (public access for development)
- ⏳ Supabase Auth integration (optional, recommended for production)
- ⏳ Frontend auth components (not yet created)

**Recommendation**: Keep current setup for development, implement auth before production deployment.
