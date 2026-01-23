## 2026-01-23 - Recursive Component Memoization
**Learning:** Recursive UI components like `CommentThread` were causing unnecessary re-renders of the entire tree when parent state changed.
**Action:** Use a pattern of `function ComponentBase(...)` + `export const Component = memo(ComponentBase)` where `ComponentBase` recursively calls the memoized `Component`. This ensures optimization persists through recursion.
