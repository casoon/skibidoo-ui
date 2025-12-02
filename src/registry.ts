/**
 * Central component registry for @casoon/skibidoo-ui
 *
 * Usage:
 *   import { createUIRegistry } from '@casoon/skibidoo-ui';
 *   import { createAstroRuntime } from '@casoon/fragment-renderer';
 *
 *   const runtime = createAstroRuntime();
 *   runtime.registerComponents(createUIRegistry());
 */
import type { ComponentMeta, RegistryEntry } from "@casoon/fragment-renderer";

/**
 * Component definition without loader (loader is added at runtime)
 */
export interface UIComponentDef {
	id: string;
	path: string;
	meta?: ComponentMeta;
}

/**
 * All UI component definitions
 */
export const uiComponentDefs: UIComponentDef[] = [
	// ─────────────────────────────────────────────────────────────────
	// General Components
	// ─────────────────────────────────────────────────────────────────
	{
		id: "ui-button",
		path: "@casoon/skibidoo-ui/components/button/Button.astro",
		meta: {
			category: "general",
			tags: ["interactive", "action"],
			description: "Button with variants, sizes, loading state",
		},
	},
	{
		id: "ui-card",
		path: "@casoon/skibidoo-ui/components/card/Card.astro",
		meta: {
			category: "general",
			tags: ["layout", "container"],
			description: "Card container with variants",
		},
	},
	{
		id: "ui-alert",
		path: "@casoon/skibidoo-ui/components/alert/Alert.astro",
		meta: {
			category: "general",
			tags: ["feedback", "notification"],
			description: "Alert box for info, success, warning, error",
		},
	},

	// ─────────────────────────────────────────────────────────────────
	// Form Components
	// ─────────────────────────────────────────────────────────────────
	{
		id: "ui-input",
		path: "@casoon/skibidoo-ui/components/input/Input.astro",
		meta: {
			category: "form",
			tags: ["interactive", "input"],
			description: "Text input with label, error, hint",
		},
	},
	{
		id: "ui-select",
		path: "@casoon/skibidoo-ui/components/select/Select.astro",
		meta: {
			category: "form",
			tags: ["interactive", "input", "dropdown"],
			description: "Select dropdown with options",
		},
	},
	{
		id: "ui-form",
		path: "@casoon/skibidoo-ui/components/form/Form.astro",
		meta: {
			category: "form",
			tags: ["interactive", "input"],
			description: "Dynamic form with validation",
		},
	},
	{
		id: "ui-datepicker",
		path: "@casoon/skibidoo-ui/components/datepicker/DatePicker.astro",
		meta: {
			category: "form",
			tags: ["interactive", "input", "date"],
			description: "Date picker with calendar popup",
		},
	},

	// ─────────────────────────────────────────────────────────────────
	// Data Display Components
	// ─────────────────────────────────────────────────────────────────
	{
		id: "ui-grid",
		path: "@casoon/skibidoo-ui/components/grid/Grid.astro",
		meta: {
			category: "data",
			tags: ["interactive", "table", "sortable", "paginated"],
			description: "Data grid with sorting, filtering, pagination",
		},
	},

	// ─────────────────────────────────────────────────────────────────
	// Overlay Components
	// ─────────────────────────────────────────────────────────────────
	{
		id: "ui-modal",
		path: "@casoon/skibidoo-ui/components/modal/Modal.astro",
		meta: {
			category: "overlay",
			tags: ["interactive", "dialog"],
			description: "Modal dialog with backdrop",
		},
	},
];

/**
 * Create registry entries with dynamic imports
 * Must be called in an Astro/Vite context where .astro imports work
 *
 * @example
 * // In your Astro project:
 * import { createUIRegistry } from '@casoon/skibidoo-ui';
 * const uiComponents = createUIRegistry();
 * runtime.registerComponents(uiComponents);
 */
export function createUIRegistry(): RegistryEntry[] {
	return uiComponentDefs.map((def) => ({
		id: def.id,
		loader: () => import(/* @vite-ignore */ def.path),
		meta: def.meta,
	}));
}

/**
 * Create a partial registry with only specific components
 *
 * @example
 * const formComponents = createPartialRegistry(['ui-input', 'ui-select', 'ui-button']);
 */
export function createPartialRegistry(ids: string[]): RegistryEntry[] {
	const filtered = uiComponentDefs.filter((def) => ids.includes(def.id));
	return filtered.map((def) => ({
		id: def.id,
		loader: () => import(/* @vite-ignore */ def.path),
		meta: def.meta,
	}));
}

/**
 * Create registry filtered by category
 *
 * @example
 * const formComponents = createRegistryByCategory('form');
 */
export function createRegistryByCategory(category: string): RegistryEntry[] {
	const filtered = uiComponentDefs.filter(
		(def) => def.meta?.category === category,
	);
	return filtered.map((def) => ({
		id: def.id,
		loader: () => import(/* @vite-ignore */ def.path),
		meta: def.meta,
	}));
}

/**
 * Get component definition by ID (without loader)
 */
export function getComponentDef(id: string): UIComponentDef | undefined {
	return uiComponentDefs.find((def) => def.id === id);
}

/**
 * List all available component IDs
 */
export function listComponentIds(): string[] {
	return uiComponentDefs.map((def) => def.id);
}

/**
 * List all available categories
 */
export function listCategories(): string[] {
	const categories = new Set(
		uiComponentDefs.map((def) => def.meta?.category).filter(Boolean),
	);
	return Array.from(categories) as string[];
}
