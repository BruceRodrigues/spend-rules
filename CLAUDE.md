# Programming Preferences

## TypeScript

- Always use explicit types. Avoid `any`, `unknown` and `never` as much as possible
- Prefer well-defined interfaces and types over broad generic types
- Use TypeScript utility types (`Pick`, `Omit`, `Partial`, etc.) when appropriate

## Componentization

- Prefer smaller, focused files — each file should have a single responsibility
- Componentize as much as possible: extract reusable components instead of growing existing files
- If a component is getting large, it's a sign it should be split

## Code Clarity

- Prefer clear, readable code over performatic solutions
- Variable, function and component names should be descriptive and self-explanatory
- Simplicity is preferable to cleverness
