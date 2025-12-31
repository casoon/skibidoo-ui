/**
 * Central component registry for @casoon/skibidoo-ui
 *
 * Components are statically imported to work with Astro's compilation.
 */
import type { ComponentMeta, RegistryEntry } from "@casoon/fragment-renderer";

// Static imports for all components
import Alert from "./components/alert/Alert.astro";
import Button from "./components/button/Button.astro";
import Card from "./components/card/Card.astro";
import DatePicker from "./components/datepicker/DatePicker.astro";
import Form from "./components/form/Form.astro";
import Grid from "./components/grid/Grid.astro";
import Input from "./components/input/Input.astro";
import Modal from "./components/modal/Modal.astro";
import Select from "./components/select/Select.astro";
import Toast from "./components/toast/Toast.astro";
import ToastContainer from "./components/toast/ToastContainer.astro";

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
			description: "Button component with variants (primary, secondary, outline, ghost, danger)",
		},
	},
	{
		id: "ui-card",
		component: Card,
		meta: {
			category: "layout",
			tags: ["container", "surface"],
			description: "Card container with variants (default, bordered, elevated)",
		},
	},
	{
		id: "ui-alert",
		component: Alert,
		meta: {
			category: "feedback",
			tags: ["notification", "message"],
			description: "Alert box with variants (info, success, warning, error)",
		},
	},
	{
		id: "ui-input",
		component: Input,
		meta: {
			category: "form",
			tags: ["interactive", "input", "text"],
			description: "Text input with validation states and sizes",
		},
	},
	{
		id: "ui-select",
		component: Select,
		meta: {
			category: "form",
			tags: ["interactive", "dropdown", "picker"],
			description: "Select dropdown with custom styling",
		},
	},
	{
		id: "ui-form",
		component: Form,
		meta: {
			category: "form",
			tags: ["interactive", "validation"],
			description: "Dynamic form with Zod validation",
		},
	},
	{
		id: "ui-datepicker",
		component: DatePicker,
		meta: {
			category: "form",
			tags: ["interactive", "date", "calendar"],
			description: "Date picker with calendar popup",
		},
	},
	{
		id: "ui-grid",
		component: Grid,
		meta: {
			category: "data",
			tags: ["table", "sortable", "paginated", "data-display"],
			description: "Data grid with sorting, filtering, and pagination",
		},
		styles: gridStyles,
	},
	{
		id: "ui-modal",
		component: Modal,
		meta: {
			category: "overlay",
			tags: ["interactive", "dialog", "popup"],
			description: "Modal dialog with backdrop",
		},
	},
	{
		id: "ui-toast",
		component: Toast,
		meta: {
			category: "feedback",
			tags: ["notification", "temporary", "message"],
			description: "Toast notification with auto-dismiss",
		},
	},
	{
		id: "ui-toast-container",
		component: ToastContainer,
		meta: {
			category: "feedback",
			tags: ["notification", "container", "queue"],
			description: "Toast container for managing multiple toast notifications",
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

/**
 * Export all components for direct import
 */
export {
	Alert,
	Button,
	Card,
	DatePicker,
	Form,
	Grid,
	Input,
	Modal,
	Select,
	Toast,
	ToastContainer,
};
