## 2024-05-23 - Recursive Component Memoization
**Learning:** Recursive components (like `CommentThread`) that are not memoized cause the entire subtree to re-render when the parent updates.
**Action:** Use the pattern: `const Base = ...; export const Component = memo(Base);` and ensure the recursive call uses the exported `Component`.
