// @casoon/skibidoo-ui - SSR-first UI Components
// Built on @casoon/fragment-renderer

export type { UIFramework } from "./runtime/index.js";
// Runtime
export { createUIFramework } from "./runtime/index.js";

// Types
export type {
	ComponentMeta,
	DatePickerProps,
	FormField,
	FormProps,
	FormState,
	GridColumn,
	GridProps,
	GridState,
	ModalProps,
	PaginationOptions,
	UIFrameworkOptions,
} from "./types/index.js";

// Note: Registry is exported separately via ./registry
// to allow Astro/Vite to process .astro imports
