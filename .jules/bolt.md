## 2024-05-23 - Recursive Component Memoization
**Learning:** The `CommentThread` component uses a recursive structure. To effectively memoize it, the recursive calls must use the memoized component export, not the base implementation.
**Action:** When optimizing recursive components, ensure the recursive call points to the `React.memo` wrapped version to preserve optimization down the tree.
