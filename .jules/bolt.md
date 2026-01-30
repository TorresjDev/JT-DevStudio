## 2025-02-20 - Recursive Component Memoization
**Learning:** When memoizing recursive components (like `CommentThread`), you must ensure the recursive call inside the component uses the memoized version of itself, not the base component. This requires separating the base logic and the exported memoized component.
**Action:** Use `const ComponentBase = ...` then `export const Component = memo(ComponentBase)` and ensure `ComponentBase` renders `Component` recursively.
