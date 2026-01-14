## 2026-01-14 - Recursive Component Memoization
**Learning:** Recursive components (like `CommentThread`) cause O(N) re-renders if not memoized. The correct pattern is to split the component into `BaseComponent` and `MemoizedComponent`, and ensure the `BaseComponent` recursively renders `MemoizedComponent`.
**Action:** Check all recursive components for this pattern to prevent deep tree re-renders.
