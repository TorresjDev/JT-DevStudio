## 2025-02-18 - Recursive Component Memoization
**Learning:** Recursive UI components (like CommentThread) propagate re-renders down the entire tree on any state change if not memoized.
**Action:** Wrap the component in `React.memo` and ensure the recursive call inside the component references the *memoized* export, not the internal function, to preserve optimization through the recursion.
