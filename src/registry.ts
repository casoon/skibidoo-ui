/**
 * Central component registry for @casoon/skibidoo-ui
 *
 * Components are statically imported to work with Astro's compilation.
 */
import type { ComponentMeta, RegistryEntry } from "@casoon/fragment-renderer";
import Alert from "./components/alert/Alert.astro";

// Static imports for all components
import Button from "./components/button/Button.astro";
import Card from "./components/card/Card.astro";
import DatePicker from "./components/datepicker/DatePicker.astro";
import Form from "./components/form/Form.astro";
import Grid from "./components/grid/Grid.astro";
import Input from "./components/input/Input.astro";
import Modal from "./components/modal/Modal.astro";
import Select from "./components/select/Select.astro";
import { gridStyles } from "./styles/grid.js";

/**
 * Component definition
 */
export interface UIComponentDef {
	id: string;
	component: unknown;
	meta?: ComponentMeta;
	styles?: string;
}

/**
 * All UI component definitions
 */
export const uiComponentDefs: UIComponentDef[] = [
	{
		id: "ui-button",
		component: Button,
		meta: {
			category: "general",
			tags: ["interactive", "action"],
			description: "Button with variants",
		},
	},
	{
		id: "ui-card",
		component: Card,
		meta: {
			category: "general",
			tags: ["layout", "container"],
			description: "Card container",
		},
	},
	{
		id: "ui-alert",
		component: Alert,
		meta: {
			category: "general",
			tags: ["feedback", "notification"],
			description: "Alert box",
		},
	},
	{
		id: "ui-input",
		component: Input,
		meta: {
			category: "form",
			tags: ["interactive", "input"],
			description: "Text input",
		},
	},
	{
		id: "ui-select",
		component: Select,
		meta: {
			category: "form",
			tags: ["interactive", "dropdown"],
			description: "Select dropdown",
		},
	},
	{
		id: "ui-form",
		component: Form,
		meta: {
			category: "form",
			tags: ["interactive", "input"],
			description: "Dynamic form",
		},
	},
	{
		id: "ui-datepicker",
		component: DatePicker,
		meta: {
			category: "form",
			tags: ["interactive", "date"],
			description: "Date picker",
		},
	},
	{
		id: "ui-grid",
		component: Grid,
		meta: {
			category: "data",
			tags: ["table", "sortable", "paginated"],
			description: "Data grid",
		},
		styles: gridStyles,
	},
	{
		id: "ui-modal",
		component: Modal,
		meta: {
			category: "overlay",
			tags: ["interactive", "dialog"],
			description: "Modal dialog",
		},
	},
];

/**
 * Create registry entries for fragment-renderer.
 */
export function createUIRegistry(): RegistryEntry[] {
	return uiComponentDefs.map((def) => ({
		id: def.id,
		loader: () => Promise.resolve({ default: def.component }),
		meta: def.meta,
		styles: def.styles,
	}));
}

/**
 * Create a partial registry with only specific components
 */
export function createPartialRegistry(ids: string[]): RegistryEntry[] {
	return uiComponentDefs
		.filter((def) => ids.includes(def.id))
		.map((def) => ({
			id: def.id,
			loader: () => Promise.resolve({ default: def.component }),
			meta: def.meta,
			styles: def.styles,
		}));
}

/**
 * Create registry filtered by category
 */
export function createRegistryByCategory(category: string): RegistryEntry[] {
	return uiComponentDefs
		.filter((def) => def.meta?.category === category)
		.map((def) => ({
			id: def.id,
			loader: () => Promise.resolve({ default: def.component }),
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
	return [
		...new Set(
			uiComponentDefs.map((def) => def.meta?.category).filter(Boolean),
		),
	] as string[];
}
