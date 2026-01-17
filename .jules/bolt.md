# Bolt's Journal

## 2025-02-23 - Initialization
**Learning:** Initialized Bolt's journal.
**Action:** Document performance learnings here.

## 2025-02-23 - Recursive Component Memoization
**Learning:** When memoizing a recursive component that exports a named function, you must rename the internal function and ensure the recursive calls use the exported memoized component variable, not the internal function name.
**Action:** Use `function ComponentInternal() { ... <Component /> ... } export const Component = memo(ComponentInternal)` pattern.
