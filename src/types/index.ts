// Core Types for UI Framework

export interface UIFrameworkOptions {
	theme?: "light" | "dark" | string;
	locale?: string;
	hydrationStrategy?: "eager" | "lazy" | "visible";
	baseUrl?: string;
}

export interface ComponentMeta {
	id: string;
	type: string;
	props: Record<string, unknown>;
	hydrate?: boolean;
}

// Grid Types
export interface GridColumn {
	field: string;
	label: string;
	width?: string | number;
	sortable?: boolean;
	filterable?: boolean;
	type?: "text" | "number" | "date" | "boolean" | "custom";
	align?: "left" | "center" | "right";
}

export interface GridProps {
	columns: GridColumn[];
	data: Record<string, unknown>[];
	pagination?: boolean | PaginationOptions;
	sorting?: boolean;
	filtering?: boolean;
	selection?: "none" | "single" | "multiple";
	rowKey?: string;
	emptyText?: string;
	loading?: boolean;
	className?: string;
}

export interface PaginationOptions {
	pageSize?: number;
	pageSizes?: number[];
	showTotal?: boolean;
}

export interface GridState {
	currentPage: number;
	pageSize: number;
	sortField: string | null;
	sortDirection: "asc" | "desc";
	filters: Record<string, unknown>;
	selectedRows: string[];
}

// Form Types
export interface FormField {
	name: string;
	label: string;
	type:
		| "text"
		| "email"
		| "password"
		| "number"
		| "textarea"
		| "select"
		| "checkbox"
		| "radio"
		| "date";
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	options?: { value: string; label: string }[];
	defaultValue?: unknown;
}

export interface FormProps {
	fields: FormField[];
	values?: Record<string, unknown>;
	action?: string;
	method?: "GET" | "POST";
	layout?: "vertical" | "horizontal" | "inline";
	submitLabel?: string;
	resetLabel?: string;
	showReset?: boolean;
	className?: string;
}

export interface FormState {
	values: Record<string, unknown>;
	errors: Record<string, string>;
	touched: Record<string, boolean>;
	isSubmitting: boolean;
	isValid: boolean;
}

// Modal Types
export interface ModalProps {
	title?: string;
	size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
	closable?: boolean;
	closeOnOverlay?: boolean;
	closeOnEscape?: boolean;
	showFooter?: boolean;
	className?: string;
}

// DatePicker Types
export interface DatePickerProps {
	name: string;
	label?: string;
	value?: string | Date;
	min?: string | Date;
	max?: string | Date;
	format?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	className?: string;
}
