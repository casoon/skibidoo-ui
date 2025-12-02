# @casoon/skibidoo-ui

SSR-first UI component library for the AHA-Stack (Astro + HTMX + Alpine.js + Tailwind).

Built on [@casoon/fragment-renderer](https://github.com/casoon/fragment-renderer) for server-side component rendering with automatic style delivery.

## Features

- **SSR-First**: Components render on the server with fragment-renderer
- **Registry Pattern**: Central component registry for dynamic rendering
- **Style Delivery**: Automatic CSS injection via fragment-renderer
- **Progressive Enhancement**: Works without JavaScript
- **HTMX Compatible**: Fragment-based partial updates
- **TypeScript**: Full type safety

## Installation

```bash
npm install @casoon/skibidoo-ui @casoon/fragment-renderer astro
```

## Quick Start

### Using the Registry with fragment-renderer

The recommended approach is using the component registry with `@casoon/fragment-renderer`:

```typescript
import { createAstroRuntime } from "@casoon/fragment-renderer";
import { createPartialRegistry } from "@casoon/skibidoo-ui/registry";

// Create runtime with selected components
const runtime = createAstroRuntime({
  components: createPartialRegistry(["ui-grid", "ui-form"]),
});

// Render a component by ID
const html = await runtime.renderToString({
  componentId: "ui-grid",
  props: {
    columns: [
      { field: "name", label: "Name", sortable: true },
      { field: "email", label: "E-Mail", sortable: true },
    ],
    data: users,
    pagination: { pageSize: 10 },
    sorting: true,
  },
});
```

### Astro Config

Add `@casoon/skibidoo-ui` to your Vite SSR config to enable Astro component compilation:

```javascript
// astro.config.mjs
export default defineConfig({
  vite: {
    ssr: {
      noExternal: ["@casoon/skibidoo-ui"],
    },
  },
});
```

### Direct Component Import

You can also import components directly in Astro pages:

```astro
---
import Grid from "@casoon/skibidoo-ui/src/components/grid/Grid.astro";
import Form from "@casoon/skibidoo-ui/src/components/form/Form.astro";
---

<Grid
  columns={columns}
  data={data}
  pagination={{ pageSize: 10 }}
  sorting={true}
/>
```

## Available Components

| Component ID    | Description                    |
|-----------------|--------------------------------|
| `ui-button`     | Button with variants           |
| `ui-card`       | Card container                 |
| `ui-alert`      | Alert/notification box         |
| `ui-input`      | Text input field               |
| `ui-select`     | Select dropdown                |
| `ui-form`       | Dynamic form with validation   |
| `ui-datepicker` | Date picker                    |
| `ui-grid`       | Data grid with sort/filter/pagination |
| `ui-modal`      | Modal dialog                   |

## Registry Functions

```typescript
import {
  createUIRegistry,        // All components
  createPartialRegistry,   // Selected components by ID
  createRegistryByCategory,// Components by category
  listComponentIds,        // List all IDs
  listCategories,          // List all categories
} from "@casoon/skibidoo-ui/registry";

// Full registry
const allComponents = createUIRegistry();

// Partial registry
const gridOnly = createPartialRegistry(["ui-grid"]);

// By category: "general", "form", "data", "overlay"
const formComponents = createRegistryByCategory("form");
```

## API Endpoint Example

```typescript
// src/pages/api/users.ts
import { createAstroRuntime } from "@casoon/fragment-renderer";
import { createPartialRegistry } from "@casoon/skibidoo-ui/registry";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const page = parseInt(url.searchParams.get("page") || "1");
  
  const runtime = createAstroRuntime({
    components: createPartialRegistry(["ui-grid"]),
  });

  const html = await runtime.renderToString({
    componentId: "ui-grid",
    props: {
      columns: gridColumns,
      data: paginatedData,
      pagination: { pageSize: 10 },
      currentPage: page,
      totalItems: totalCount,
      endpoint: "/api/users",
    },
  });

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
};
```

## Theming

Components use CSS Custom Properties for theming.

### Built-in Themes

```html
<link rel="stylesheet" href="@casoon/skibidoo-ui/styles/themes/light.css">
<link rel="stylesheet" href="@casoon/skibidoo-ui/styles/themes/dark.css">
```

### Custom Theme

```css
:root {
  --ui-primary: #your-color;
  --ui-surface: #your-surface;
  --ui-border-color: #your-border;
  /* See dist/styles/tokens.css for all variables */
}
```

## Project Structure

```
src/
  registry.ts           # Component registry (import from /registry)
  runtime/              # SSR runtime utilities
  components/           # Astro components
    grid/Grid.astro
    form/Form.astro
    button/Button.astro
    card/Card.astro
    alert/Alert.astro
    input/Input.astro
    select/Select.astro
    modal/Modal.astro
    datepicker/DatePicker.astro
  client/               # Client-side hydration
  styles/               # CSS & themes
  types/                # TypeScript definitions
```

## Requirements

- Node.js >= 22
- Astro >= 5.0
- @casoon/fragment-renderer >= 0.1.1

## License

LGPL-3.0
