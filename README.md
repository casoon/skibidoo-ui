# @casoon/skibidoo-ui

SSR-first UI component library for the **AHA-Stack** (Astro + HTMX + Alpine.js + Tailwind).

Built on [@casoon/fragment-renderer](https://github.com/casoon/fragment-renderer) for server-side component rendering with automatic style delivery.

[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL%203.0-blue.svg)](https://opensource.org/licenses/LGPL-3.0)
[![npm version](https://badge.fury.io/js/@casoon%2Fskibidoo-ui.svg)](https://www.npmjs.com/package/@casoon/skibidoo-ui)

## Features

- ✨ **SSR-First**: Components render on the server with fragment-renderer
- 🎯 **Registry Pattern**: Central component registry for dynamic rendering
- 🎨 **Style Delivery**: Automatic CSS injection via fragment-renderer
- 📈 **Progressive Enhancement**: Works without JavaScript
- ⚡ **HTMX Compatible**: Fragment-based partial updates
- 🔒 **TypeScript**: Full type safety
- 🎭 **11 Production-Ready Components**: From buttons to data grids

## Installation

```bash
npm install @casoon/skibidoo-ui @casoon/fragment-renderer
```

**Peer Dependencies:**
```bash
npm install astro alpinejs htmx.org tailwindcss
```

## Components Overview

| Component | Category | Description | Alpine.js | HTMX |
|-----------|----------|-------------|-----------|------|
| **Button** | General | Button with variants (primary, secondary, outline, ghost, danger) | ✅ | - |
| **Input** | Form | Text input with validation states | ✅ | - |
| **Select** | Form | Dropdown with custom styling | - | - |
| **Card** | Layout | Container with variants (default, bordered, elevated) | - | - |
| **Alert** | Feedback | Alert box with dismiss (info, success, warning, error) | ✅ | - |
| **Toast** | Feedback | Auto-dismiss notifications | ✅ | - |
| **ToastContainer** | Feedback | Queue manager for multiple toasts | ✅ | - |
| **Form** | Form | Dynamic forms with Zod validation | ✅ | ✅ |
| **DatePicker** | Form | Calendar popup | ✅ | - |
| **Grid** | Data | Data table with sorting, filtering, pagination | ✅ | ✅ |
| **Modal** | Overlay | Dialog with backdrop | ✅ | - |

## Quick Start

### 1. Using the Registry with fragment-renderer

The recommended approach is using the component registry:

```typescript
import { createAstroRuntime } from "@casoon/fragment-renderer";
import { createPartialRegistry } from "@casoon/skibidoo-ui/registry";

// Create runtime with selected components
const runtime = createAstroRuntime({
  components: createPartialRegistry(["ui-grid", "ui-form", "ui-toast-container"]),
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

### 2. Direct Import in Astro

You can also directly import components in `.astro` files:

```astro
---
import { Button, Input, Card, Alert } from '@casoon/skibidoo-ui';
---

<Card variant="bordered" padding="lg">
  <h2>Login</h2>
  <form>
    <Input
      type="email"
      name="email"
      label="E-Mail"
      required
      placeholder="mail@example.com"
    />
    <Input
      type="password"
      name="password"
      label="Password"
      required
    />
    <Button variant="primary" type="submit" fullWidth>
      Login
    </Button>
  </form>
</Card>

<Alert variant="success" title="Success!" dismissible>
  You have successfully logged in.
</Alert>
```

## Component Examples

### Button

```astro
---
import { Button } from '@casoon/skibidoo-ui';
---

<!-- Variants -->
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>

<!-- Sizes -->
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

<!-- States -->
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>

<!-- As Link -->
<Button href="/products">View Products</Button>
```

**Props:**
```typescript
{
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  href?: string;
}
```

---

### Input

```astro
---
import { Input } from '@casoon/skibidoo-ui';
---

<!-- Basic Input -->
<Input
  name="email"
  type="email"
  label="E-Mail Address"
  placeholder="you@example.com"
  required
/>

<!-- With Error -->
<Input
  name="password"
  type="password"
  label="Password"
  error="Password must be at least 8 characters"
/>

<!-- With Hint -->
<Input
  name="username"
  label="Username"
  hint="Only letters, numbers, and underscores"
/>

<!-- Disabled -->
<Input
  name="readonly-field"
  value="Cannot edit"
  disabled
/>
```

**Props:**
```typescript
{
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  name: string;
  label?: string;
  placeholder?: string;
  value?: string | number;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: "sm" | "md" | "lg";
}
```

---

### Select

```astro
---
import { Select } from '@casoon/skibidoo-ui';

const countries = [
  { value: "de", label: "Germany" },
  { value: "at", label: "Austria" },
  { value: "ch", label: "Switzerland" },
];
---

<Select
  name="country"
  label="Country"
  options={countries}
  placeholder="Select country..."
  required
/>
```

**Props:**
```typescript
{
  name: string;
  options: { value: string; label: string; disabled?: boolean }[];
  label?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: "sm" | "md" | "lg";
}
```

---

### Card

```astro
---
import { Card } from '@casoon/skibidoo-ui';
---

<!-- Variants -->
<Card variant="default">
  <h3>Default Card</h3>
  <p>Simple white background</p>
</Card>

<Card variant="bordered">
  <h3>Bordered Card</h3>
  <p>With border</p>
</Card>

<Card variant="elevated">
  <h3>Elevated Card</h3>
  <p>With shadow</p>
</Card>

<!-- Padding -->
<Card padding="none">No padding</Card>
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding</Card>
<Card padding="lg">Large padding</Card>

<!-- Interactive -->
<Card href="/products/1" variant="elevated">
  Click me - I'm a link!
</Card>
```

**Props:**
```typescript
{
  variant?: "default" | "bordered" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  href?: string;
}
```

---

### Alert

```astro
---
import { Alert } from '@casoon/skibidoo-ui';
---

<Alert variant="info" title="Information">
  This is an informational message.
</Alert>

<Alert variant="success" title="Success!" dismissible>
  Your changes have been saved.
</Alert>

<Alert variant="warning" title="Warning">
  Please review your data before submitting.
</Alert>

<Alert variant="error" title="Error" dismissible>
  Something went wrong. Please try again.
</Alert>
```

**Props:**
```typescript
{
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  dismissible?: boolean;
}
```

**Note:** Requires Alpine.js for `dismissible` functionality.

---

### Toast & ToastContainer

```astro
---
import { ToastContainer } from '@casoon/skibidoo-ui';
---

<!-- Add ToastContainer to your layout -->
<ToastContainer position="top-right" maxToasts={5} />

<script>
  // Trigger toast from JavaScript
  window.toast({
    variant: 'success',
    title: 'Saved!',
    message: 'Your changes have been saved.',
    duration: 5000, // ms, 0 = no auto-dismiss
  });

  window.toast({
    variant: 'error',
    title: 'Error',
    message: 'Failed to save changes.',
    duration: 0, // Manual dismiss only
  });
</script>
```

**ToastContainer Props:**
```typescript
{
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  maxToasts?: number;
}
```

**Toast API:**
```typescript
window.toast({
  variant?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number; // milliseconds, 0 = no auto-dismiss
});
```

**Note:** Requires Alpine.js.

---

### Grid (Data Table)

```astro
---
import { Grid } from '@casoon/skibidoo-ui';

const users = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "User" },
];
---

<Grid
  columns={[
    { field: "name", label: "Name", sortable: true },
    { field: "email", label: "E-Mail", sortable: true },
    { field: "role", label: "Role", sortable: false },
  ]}
  data={users}
  pagination={{ pageSize: 10, showPageNumbers: true }}
  sorting={true}
  filters={[
    { field: "role", type: "select", options: ["Admin", "User"] }
  ]}
/>
```

**Props:** See [Grid Documentation](./docs/components/grid.md)

---

### Form (Dynamic)

```astro
---
import { Form } from '@casoon/skibidoo-ui';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  terms: z.boolean().refine(v => v === true),
});

const fields = [
  { name: "email", type: "email", label: "E-Mail", required: true },
  { name: "password", type: "password", label: "Password", required: true },
  { name: "terms", type: "checkbox", label: "I agree to the terms" },
];
---

<Form
  fields={fields}
  schema={schema}
  submitUrl="/api/register"
  submitLabel="Register"
/>
```

**Props:** See [Form Documentation](./docs/components/form.md)

---

### Modal

```astro
---
import { Modal } from '@casoon/skibidoo-ui';
---

<button x-data x-on:click="$dispatch('open-modal', { id: 'confirm-delete' })">
  Delete Item
</button>

<Modal id="confirm-delete" title="Confirm Delete">
  <p>Are you sure you want to delete this item?</p>
  <div class="flex gap-2 justify-end mt-4">
    <button class="btn-secondary" x-on:click="$dispatch('close-modal')">
      Cancel
    </button>
    <button class="btn-danger">
      Delete
    </button>
  </div>
</Modal>
```

**Note:** Requires Alpine.js.

---

### DatePicker

```astro
---
import { DatePicker } from '@casoon/skibidoo-ui';
---

<DatePicker
  name="birthday"
  label="Birthday"
  required
/>
```

**Note:** Requires Alpine.js.

---

## Registry Functions

```typescript
// Import all components
import { createUIRegistry } from '@casoon/skibidoo-ui/registry';
const registry = createUIRegistry();

// Import specific components
import { createPartialRegistry } from '@casoon/skibidoo-ui/registry';
const registry = createPartialRegistry(['ui-button', 'ui-input', 'ui-card']);

// Import by category
import { createRegistryByCategory } from '@casoon/skibidoo-ui/registry';
const formRegistry = createRegistryByCategory('form'); // All form components

// Utility functions
import { listComponentIds, listCategories, getComponentDef } from '@casoon/skibidoo-ui/registry';

console.log(listComponentIds());
// ['ui-button', 'ui-input', 'ui-select', ...]

console.log(listCategories());
// ['general', 'form', 'layout', 'feedback', 'data', 'overlay']

const buttonDef = getComponentDef('ui-button');
console.log(buttonDef.meta.description);
```

## Tailwind Configuration

Add to your `tailwind.config.mjs`:

```javascript
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/@casoon/skibidoo-ui/**/*.{astro,js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## Alpine.js Setup

Components using Alpine.js require it to be initialized:

```astro
---
// In your layout
---
<html>
  <head>
    <!-- ... -->
  </head>
  <body>
    <slot />
    
    <script>
      import Alpine from 'alpinejs';
      window.Alpine = Alpine;
      Alpine.start();
    </script>
  </body>
</html>
```

## HTMX Integration

Components like `Grid` and `Form` work seamlessly with HTMX for partial updates:

```html
<div hx-get="/api/users" hx-trigger="load" hx-swap="innerHTML">
  <!-- Grid will be loaded via HTMX -->
</div>
```

## TypeScript Support

All components are fully typed:

```typescript
import type { Props as ButtonProps } from '@casoon/skibidoo-ui/components/button/Button.astro';

const props: ButtonProps = {
  variant: 'primary',
  size: 'md',
  loading: false,
};
```

## License

LGPL-3.0 - See [LICENSE](./LICENSE)

## Contributing

Contributions are welcome! Please open an issue or PR.

## Links

- [GitHub Repository](https://github.com/casoon/skibidoo-ui)
- [NPM Package](https://www.npmjs.com/package/@casoon/skibidoo-ui)
- [Fragment Renderer](https://github.com/casoon/fragment-renderer)
- [Skibidoo E-Commerce](https://github.com/casoon/skibidoo-concept)
