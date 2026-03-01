# Programming Preferences

## TypeScript

- Always use explicit types. Avoid `any`, `unknown` and `never` as much as possible
- Prefer well-defined interfaces and types over broad generic types
- Use TypeScript utility types (`Pick`, `Omit`, `Partial`, etc.) when appropriate

## Componentization

- Prefer smaller, focused files — each file should have a single responsibility
- Componentize as much as possible: extract reusable components instead of growing existing files
- If a component is getting large, it's a sign it should be split

### Listing Page Pattern

When building a listing page, break it into the following components under `app/components/{feature}/`:

- **`{Feature}sTable.tsx`** — Table layout with column headers, skeleton loading rows, empty state, and pagination controls. Delegates row rendering to the Row component.
- **`{Feature}Row.tsx`** — A single table row. Purely presentational, no state.
- **`{Feature}sFilters.tsx`** — Search input and any filter controls (dropdowns, button groups). Uses local state with debouncing synced to the parent.
- **`Add{Feature}Modal.tsx`** — Form modal for creating a new item. Uses `react-hook-form` and resets on close.

The **page component** (`app/dashboard/{feature}/page.tsx`) acts as the container:
- Owns all state (search, filters, pagination, modal open/close)
- Fetches data with SWR
- Composes and passes props down to the above components

#### Naming conventions
- Folders: feature name in plural, lowercase (e.g., `rules/`, `categories/`)
- Table: `{Feature}sTable` (plural)
- Row: `{Feature}Row` (singular)
- Filters: `{Feature}sFilters` (plural)
- Modal: `Add{Feature}Modal`

## Code Clarity

- Prefer clear, readable code over performatic solutions
- Variable, function and component names should be descriptive and self-explanatory
- Simplicity is preferable to cleverness
