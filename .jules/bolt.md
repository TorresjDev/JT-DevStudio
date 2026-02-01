## 2024-05-22 - Recursive Component Optimization
**Learning:** Recursive components (like comment threads) can trigger massive re-render chains. `React.memo` is highly effective here but requires careful implementation to ensure the recursive calls reference the memoized component, not the base function.
**Action:** When optimizing recursive UI structures, always separate the base component implementation from the memoized export and ensure the recursion uses the export.

## 2024-05-22 - Environment Lockfile Noise
**Learning:** Running `npm install` can rewrite `package-lock.json` even if no dependencies changed, due to npm version differences.
**Action:** Always restore `package-lock.json` before submitting if only code changes were made, to avoid noise.
