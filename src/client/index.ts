// UI Framework Hydration Manager
// This is the client-side entry point

import { FormController } from "../components/form/form.client.js";
import { GridController } from "../components/grid/grid.client.js";

type ComponentType = "grid" | "form" | "modal" | "datepicker";

interface ComponentController {
	init(): void;
	destroy(): void;
}

interface ControllerConstructor {
	new (
		el: HTMLElement,
		props: Record<string, unknown>,
		options?: Record<string, unknown>,
	): ComponentController;
}

declare global {
	interface Window {
		__UI_HYDRATE__?: string[];
		__UI_FRAMEWORK__?: UIHydrator;
	}
}

export class UIHydrator {
	private components = new Map<string, ComponentController>();
	private controllers: Record<ComponentType, ControllerConstructor> = {
		grid: GridController as unknown as ControllerConstructor,
		form: FormController as unknown as ControllerConstructor,
		modal: null as unknown as ControllerConstructor,
		datepicker: null as unknown as ControllerConstructor,
	};
	private options: Record<string, Record<string, unknown>> = {};

	constructor() {
		if (typeof window !== "undefined") {
			window.__UI_FRAMEWORK__ = this;
		}
	}

	/**
	 * Register options for a specific component instance
	 */
	configure(id: string, options: Record<string, unknown>): void {
		this.options[id] = options;
	}

	/**
	 * Hydrate all components marked for hydration
	 */
	async hydrateAll(): Promise<void> {
		const elements = document.querySelectorAll("[data-component]");

		for (const el of elements) {
			const id = el.id;
			const shouldHydrate = window.__UI_HYDRATE__?.includes(id) ?? true;

			if (shouldHydrate) {
				await this.hydrate(el as HTMLElement);
			}
		}
	}

	/**
	 * Hydrate a single component by element or ID
	 */
	async hydrate(
		elOrId: HTMLElement | string,
	): Promise<ComponentController | null> {
		const el =
			typeof elOrId === "string" ? document.getElementById(elOrId) : elOrId;

		if (!el) {
			console.warn(`[UI Framework] Element not found: ${elOrId}`);
			return null;
		}

		const type = el.getAttribute("data-component") as ComponentType;
		const propsStr = el.getAttribute("data-props");
		const props = propsStr ? JSON.parse(propsStr) : {};
		const options = this.options[el.id] || {};

		if (this.components.has(el.id)) {
			console.warn(`[UI Framework] Component already hydrated: ${el.id}`);
			return this.components.get(el.id)!;
		}

		const Controller = this.controllers[type];
		if (!Controller) {
			console.warn(`[UI Framework] Unknown component type: ${type}`);
			return null;
		}

		const instance = new Controller(el, props, options);
		instance.init();
		this.components.set(el.id, instance);

		el.setAttribute("data-hydrated", "true");

		return instance;
	}

	/**
	 * Get a component controller by ID
	 */
	get(id: string): ComponentController | undefined {
		return this.components.get(id);
	}

	/**
	 * Destroy a component and remove from tracking
	 */
	destroy(id: string): void {
		const instance = this.components.get(id);
		if (instance) {
			instance.destroy();
			this.components.delete(id);
		}
	}

	/**
	 * Destroy all tracked components
	 */
	destroyAll(): void {
		for (const [id] of this.components) {
			this.destroy(id);
		}
	}
}

// Auto-initialize
export function initUIFramework(): UIHydrator {
	const hydrator = new UIHydrator();

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => hydrator.hydrateAll());
	} else {
		hydrator.hydrateAll();
	}

	return hydrator;
}

export { FormController } from "../components/form/form.client.js";
// Export for manual usage
export { GridController } from "../components/grid/grid.client.js";
