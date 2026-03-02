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
- **`{Feature}Modal.tsx`** — Form modal for creating and editing an item. Uses `react-hook-form` and resets on close. Receives an optional `category` prop (or equivalent): when present, renders in edit mode (populates form, sends `PATCH`); when absent, renders in add mode (generates defaults, sends `POST`).

The **page component** (`app/dashboard/{feature}/page.tsx`) acts as the container:
- Owns all state (search, filters, pagination, modal open/close)
- Fetches data with SWR
- Composes and passes props down to the above components

#### Naming conventions
- Folders: feature name in plural, lowercase (e.g., `rules/`, `categories/`)
- Table: `{Feature}sTable` (plural)
- Row: `{Feature}Row` (singular)
- Filters: `{Feature}sFilters` (plural)
- Modal: `{Feature}Modal`

## UI Components

- Always use HeroUI components (`<Button>`, `<Input>`, `<Select>`, etc.) over native `<button>`, `<input>`, `<select>` elements
- HeroUI `<Input>` works with `react-hook-form` via `{...register(...)}` spread; use `label`, `isInvalid`, and `errorMessage` props instead of separate `<label>` and error `<p>` tags
- HeroUI `<Select>` requires `Controller` from `react-hook-form` (does not support `register()` spread); use `selectedKeys` and `onSelectionChange`
- HeroUI `<Select>` does not accept a mix of static `<SelectItem>` elements and `.map()` results as siblings — this causes a `CollectionElement<object>` TypeScript error. Prepend static options into the array and use a single `.map()` instead:
  ```tsx
  // ✗ broken
  <SelectItem key="">All</SelectItem>
  {items.map(item => <SelectItem key={item.id}>{item.name}</SelectItem>)}

  // ✓ correct
  {[{ id: "", name: "All" }, ...items].map(item => (
    <SelectItem key={item.id}>{item.name}</SelectItem>
  ))}
  ```
- Use `onPress` (react-aria) for button handlers; `isDisabled` instead of `disabled`; `isIconOnly` for icon-only buttons; `isLoading` for loading state
- Exceptions — keep as native elements: `<input type="hidden">`, color-swatch circular `<button>` with dynamic `backgroundColor` style

## Next.js Patterns

- Any page that calls `useSearchParams()` must extract its content into an inner component and wrap it in `<Suspense>` in the default export — otherwise Next.js fails to build with a CSR bailout error:

  ```tsx
  function MyPageContent() {
    const searchParams = useSearchParams();
    // ...
  }

  export default function MyPage() {
    return <Suspense><MyPageContent /></Suspense>;
  }
  ```

## Linting, Formatting & Build

- All code must pass `bun run build` with zero errors before being committed
- All code must pass `bun run lint` (Biome) with zero errors before being committed
- Never suppress a Biome rule with `biome-ignore` unless it is a genuine false positive — add a clear justification comment explaining why
- Run `bun run lint:fix` to auto-fix formatting issues; manually fix any remaining lint errors

## Code Clarity

- Prefer clear, readable code over performatic solutions
- Variable, function and component names should be descriptive and self-explanatory
- Simplicity is preferable to cleverness
