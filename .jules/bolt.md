## 2025-05-25 - Recursive Component Performance
**Learning:** Recursive components (like `CommentThread`) without memoization trigger re-renders for the entire subtree when the parent updates, even if props are unchanged. This is a common bottleneck in threaded UI.
**Action:** Always wrap recursive UI components in `React.memo` and ensure the internal recursive call uses the memoized component reference.
