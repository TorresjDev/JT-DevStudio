## 2024-05-23 - Recursion & Memoization Pattern
**Learning:** Recursive components require careful handling with `React.memo`. To ensure memoization applies to children, the recursive call inside the component must reference the memoized version (the exported const), not the base function. This was achieved by separating `CommentThreadBase` and exporting `memo(CommentThreadBase)`.
**Action:** When optimizing recursive UI (comments, trees), always separate the implementation from the memoized export and ensure recursion uses the memoized component.
