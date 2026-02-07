## 2025-05-27 - AuthContext Optimization
**Learning:** `AuthProvider` was recreating its `value` object on every render. This forced all consumers (which is potentially the entire app) to re-render whenever `AuthProvider` re-rendered, even if the user state didn't change.
**Action:** Always wrap context values in `useMemo` to ensure referential stability.
