/**
 * Central component registry for @casoon/skibidoo-ui
 * 
 * The registry provides component definitions that are resolved at runtime
 * in the consumer's Astro/Vite context.
 */
import type { ComponentMeta, RegistryEntry } from "@casoon/fragment-renderer";
import { gridStyles } from "./styles/grid.js";

/**
 * Component definition with path (resolved at runtime)
 */
export interface UIComponentDef {
	id: string;
	path: string;
	meta?: ComponentMeta;
	styles?: string;
}

/**
 * All UI component definitions
 */
export const uiComponentDefs: UIComponentDef[] = [
	{
		id: "ui-button",
		path: "@casoon/skibidoo-ui/src/components/button/Button.astro",
		meta: { category: "general", tags: ["interactive", "action"], description: "Button with variants" },
	},
	{
		id: "ui-card",
		path: "@casoon/skibidoo-ui/src/components/card/Card.astro",
		meta: { category: "general", tags: ["layout", "container"], description: "Card container" },
	},
	{
		id: "ui-alert",
		path: "@casoon/skibidoo-ui/src/components/alert/Alert.astro",
		meta: { category: "general", tags: ["feedback", "notification"], description: "Alert box" },
	},
	{
		id: "ui-input",
		path: "@casoon/skibidoo-ui/src/components/input/Input.astro",
		meta: { category: "form", tags: ["interactive", "input"], description: "Text input" },
	},
	{
		id: "ui-select",
		path: "@casoon/skibidoo-ui/src/components/select/Select.astro",
		meta: { category: "form", tags: ["interactive", "dropdown"], description: "Select dropdown" },
	},
	{
		id: "ui-form",
		path: "@casoon/skibidoo-ui/src/components/form/Form.astro",
		meta: { category: "form", tags: ["interactive", "input"], description: "Dynamic form" },
	},
	{
		id: "ui-datepicker",
		path: "@casoon/skibidoo-ui/src/components/datepicker/DatePicker.astro",
		meta: { category: "form", tags: ["interactive", "date"], description: "Date picker" },
	},
	{
		id: "ui-grid",
		path: "@casoon/skibidoo-ui/src/components/grid/Grid.astro",
		meta: { category: "data", tags: ["table", "sortable", "paginated"], description: "Data grid" },
		styles: gridStyles,
	},
	{
		id: "ui-modal",
		path: "@casoon/skibidoo-ui/src/components/modal/Modal.astro",
		meta: { category: "overlay", tags: ["interactive", "dialog"], description: "Modal dialog" },
	},
];

/**
 * Create registry entries for fragment-renderer.
 * Uses dynamic imports that are resolved by Vite at runtime.
 */
export function createUIRegistry(): RegistryEntry[] {
	return uiComponentDefs.map((def) => ({
		id: def.id,
		loader: () => import(/* @vite-ignore */ def.path),
		meta: def.meta,
		styles: def.styles,
	}));
}

/**
 * Create a partial registry with only specific components
 */
export function createPartialRegistry(ids: string[]): RegistryEntry[] {
	return uiComponentDefs.filter((def) => ids.includes(def.id)).map((def) => ({
		id: def.id,
		loader: () => import(/* @vite-ignore */ def.path),
		meta: def.meta,
		styles: def.styles,
	}));
}

/**
 * Create registry filtered by category
 */
export function createRegistryByCategory(category: string): RegistryEntry[] {
	return uiComponentDefs.filter((def) => def.meta?.category === category).map((def) => ({
		id: def.id,
		loader: () => import(/* @vite-ignore */ def.path),
		meta: def.meta,
		styles: def.styles,
	}));
}

/**
 * Get component definition by ID
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
	return [...new Set(uiComponentDefs.map((def) => def.meta?.category).filter(Boolean))] as string[];
}
