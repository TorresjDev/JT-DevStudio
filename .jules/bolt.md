## 2025-05-21 - Recursive Component Memoization
**Learning:** Recursive components like `CommentThread` must be split into a Base component and a memoized export to ensure the recursive calls use the memoized version. Without this, the recursive calls point to the un-memoized function, defeating the purpose.
**Action:** When creating recursive UI components, always use `function ComponentBase` and `export const Component = memo(ComponentBase)`.
