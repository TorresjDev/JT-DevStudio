## 2025-02-21 - Recursive Component Memoization
**Learning:** Recursive components (like `CommentThread`) need a specific pattern for `React.memo` to work effectively. The recursive call must use the memoized export, not the internal function definition.
**Action:** Use `function BaseComp() { ... <MemoizedComp /> }` and `export const MemoizedComp = memo(BaseComp)`.
