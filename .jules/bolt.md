## 2024-05-23 - Recursion Optimization
**Learning:** Recursive components like comment threads are prime candidates for `React.memo` as they can cause cascade re-renders for the entire tree.
**Action:** Always wrap recursive list components in `React.memo`, and ensure the recursive call uses the memoized version.
