# @skibidoo/ui

SSR-first UI component framework built on [@casoon/fragment-renderer](https://github.com/casoon/fragment-renderer).

## Features

- **SSR-First**: Components render on the server, hydrate on client
- **Progressive Enhancement**: Works without JavaScript
- **Small Bundle**: Only client logic is shipped to browser
- **Design Tokens**: Consistent theming with CSS Custom Properties
- **HTMX Compatible**: Fragment-based partial updates
- **TypeScript**: Full type safety

## Installation

```bash
npm install @skibidoo/ui @casoon/fragment-renderer astro
```

## Quick Start

### Server-Side

```typescript
import { createUIFramework } from "@skibidoo/ui";

const ui = createUIFramework({
  theme: "light",
  locale: "de",
});

// Render a Grid
const gridHtml = await ui.renderGrid({
  columns: [
    { field: "name", label: "Name" },
    { field: "email", label: "E-Mail" },
  ],
  data: users,
  pagination: true,
  sorting: true,
});

// Render a Form
const formHtml = await ui.renderForm({
  fields: [
    { name: "email", label: "E-Mail", type: "email", required: true },
    { name: "password", label: "Passwort", type: "password", required: true },
  ],
  action: "/api/login",
  submitLabel: "Anmelden",
});
```

### Client-Side Hydration

```html
<link rel="stylesheet" href="@skibidoo/ui/styles">

<script type="module">
  import { initUIFramework } from "@skibidoo/ui/client";

  const ui = initUIFramework();

  // Configure specific component
  ui.configure("grid-id", {
    onSort: (field, direction) => console.log("Sort:", field, direction),
    onPageChange: (page) => fetchPage(page),
  });
</script>
```

## Components

### Grid

Full-featured data grid with sorting, pagination, filtering, and row selection.

```typescript
await ui.renderGrid({
  columns: GridColumn[],
  data: Record<string, unknown>[],
  pagination?: boolean | PaginationOptions,
  sorting?: boolean,
  filtering?: boolean,
  selection?: "none" | "single" | "multiple",
  rowKey?: string,
});
```

### Form

Dynamic form generation with validation.

```typescript
await ui.renderForm({
  fields: FormField[],
  values?: Record<string, unknown>,
  action?: string,
  method?: "GET" | "POST",
  layout?: "vertical" | "horizontal" | "inline",
});
```

## Theming

The framework uses CSS Custom Properties for theming.

### Built-in Themes

```html
<!-- Light (default) -->
<link rel="stylesheet" href="@skibidoo/ui/themes/light.css">

<!-- Dark -->
<link rel="stylesheet" href="@skibidoo/ui/themes/dark.css">
```

### Custom Theme

```css
:root {
  --ui-primary: #your-color;
  --ui-surface: #your-surface;
  /* ... see tokens.css for all variables */
}
```

## Events

Components emit custom events for client-side interaction:

```typescript
// Grid events
document.addEventListener("grid:sort", (e) => {});
document.addEventListener("grid:pageChange", (e) => {});
document.addEventListener("grid:selectionChange", (e) => {});
document.addEventListener("grid:filter", (e) => {});

// Form events
document.addEventListener("form:submit", (e) => {});
document.addEventListener("form:fieldChange", (e) => {});
document.addEventListener("form:validationError", (e) => {});
```

## Project Structure

```
src/
  index.ts              # Main exports
  runtime/              # SSR runtime (extends fragment-renderer)
  components/           # Astro components + client controllers
    grid/
    form/
    modal/
    datepicker/
  client/               # Client-side hydration
  styles/               # CSS & themes
  types/                # TypeScript definitions
```

## Development

```bash
npm install
npm run build
npm run dev
```

## Requirements

- Node.js >= 18
- Astro >= 4.0
- @casoon/fragment-renderer

## License

MIT
