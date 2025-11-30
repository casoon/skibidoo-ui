// @casoon/skibidoo-ui - SSR-first UI Components
// Built on @casoon/fragment-renderer

// Runtime
export { createUIFramework } from "./runtime/index.js";
export type { UIFramework } from "./runtime/index.js";

// Registry - central component registration
export {
  uiComponentDefs,
  createUIRegistry,
  createPartialRegistry,
  createRegistryByCategory,
  getComponentDef,
  listComponentIds,
} from "./registry.js";
export type { UIComponentDef } from "./registry.js";

// Types
export type {
  UIFrameworkOptions,
  ComponentMeta,
  GridColumn,
  GridProps,
  GridState,
  PaginationOptions,
  FormField,
  FormProps,
  FormState,
  ModalProps,
  DatePickerProps,
} from "./types/index.js";
