## 2026-02-05 - Recursive Component Memoization
**Learning:** Recursive components (e.g., `CommentThread`) must be split into a content function and an exported `React.memo` wrapper. The content function must render the *exported wrapper* recursively to ensure nested children benefit from memoization.
**Action:** When optimizing recursive components, refactor to `function Content() { ... return <ExportedMemoized ... /> }`.

## 2026-02-05 - Vitest Mock Paths
**Learning:** `vi.mock` paths are resolved relative to the test file unless an alias is used. If the SUT imports using relative paths or aliases, the mock must match how the module system resolves it. Safest bet is to mock the alias (e.g., `@/components/...`).
**Action:** Use aliases in `vi.mock` to ensure consistent mocking regardless of test file location.
