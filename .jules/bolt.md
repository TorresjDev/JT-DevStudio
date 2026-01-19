## 2025-05-18 - [Recursive Component Memoization]
**Learning:** Recursive UI components (like CommentThread) must follow a specific pattern: define the base component internally, wrap it in React.memo, and export the wrapper. The internal component must reference the *exported memoized wrapper* for its recursive calls, not itself, to ensure the optimization applies to the entire tree.
**Action:** When creating or modifying recursive components, always use `const Component = memo(ComponentBase)` and ensure recursion points to `Component`.
