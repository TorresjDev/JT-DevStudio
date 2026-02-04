## 2024-05-22 - Recursive Component Re-renders
**Learning:** The recursive `CommentThread` component lacked memoization, causing the entire comment tree to re-render whenever the parent updated, even if props were stable.
**Action:** Always wrap recursive list items in `React.memo`, especially when they are used in deep trees. Ensure the recursive call uses the memoized version.
