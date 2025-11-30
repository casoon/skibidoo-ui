// SSR Runtime - Extends @casoon/fragment-renderer
import { createAstroRuntime, type AstroRuntime, type ComponentLoader } from "@casoon/fragment-renderer";
import type { UIFrameworkOptions, GridProps, FormProps, ModalProps, DatePickerProps } from "../types/index.js";

export interface UIFramework {
  runtime: AstroRuntime;
  registerComponents(loaders: Record<string, ComponentLoader>): void;
  renderGrid(props: GridProps): Promise<string>;
  renderForm(props: FormProps): Promise<string>;
  renderModal(props: ModalProps, content: string): Promise<string>;
  renderDatePicker(props: DatePickerProps): Promise<string>;
  renderComponent(componentId: string, props: Record<string, unknown>): Promise<string>;
  getThemeStylesheet(): string;
  setTheme(theme: string): void;
  setLocale(locale: string): void;
}

export function createUIFramework(options: UIFrameworkOptions = {}): UIFramework {
  const config = {
    theme: options.theme ?? "light",
    locale: options.locale ?? "de",
    hydrationStrategy: options.hydrationStrategy ?? "lazy",
    baseUrl: options.baseUrl ?? "/",
  };

  const runtime = createAstroRuntime({
    baseContext: {
      __uiTheme: config.theme,
      __uiLocale: config.locale,
      __uiHydration: config.hydrationStrategy,
    },
  });

  // Theme service
  runtime.registerService("theme", () => ({
    current: config.theme,
    getCSSVars: () => `--ui-theme: ${config.theme};`,
    getStylesheet: () => `${config.baseUrl}themes/${config.theme}.css`,
  }));

  function generateId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  return {
    runtime,

    /**
     * Register component loaders - call this with your Astro component imports
     * Example:
     *   ui.registerComponents({
     *     "ui-grid": () => import("@casoon/skibidoo-ui/components/grid/Grid.astro"),
     *     "ui-form": () => import("@casoon/skibidoo-ui/components/form/Form.astro"),
     *   });
     */
    registerComponents(loaders: Record<string, ComponentLoader>): void {
      for (const [id, loader] of Object.entries(loaders)) {
        runtime.registerComponent(id, loader);
      }
    },

    async renderGrid(props: GridProps): Promise<string> {
      return runtime.renderToString({
        componentId: "ui-grid",
        props: { ...props, __id: `grid-${generateId()}`, __hydrate: true },
      });
    },

    async renderForm(props: FormProps): Promise<string> {
      return runtime.renderToString({
        componentId: "ui-form",
        props: { ...props, __id: `form-${generateId()}`, __hydrate: true },
      });
    },

    async renderModal(props: ModalProps, content: string): Promise<string> {
      return runtime.renderToString({
        componentId: "ui-modal",
        props: { ...props, __content: content, __id: `modal-${generateId()}`, __hydrate: true },
      });
    },

    async renderDatePicker(props: DatePickerProps): Promise<string> {
      return runtime.renderToString({
        componentId: "ui-datepicker",
        props: { ...props, __id: `dp-${generateId()}`, __hydrate: true },
      });
    },

    async renderComponent(componentId: string, props: Record<string, unknown>): Promise<string> {
      return runtime.renderToString({
        componentId,
        props: { ...props, __id: `${componentId}-${generateId()}`, __hydrate: true },
      });
    },

    getThemeStylesheet(): string {
      return `${config.baseUrl}themes/${config.theme}.css`;
    },

    setTheme(theme: string): void {
      config.theme = theme;
      runtime.setBaseContext({ __uiTheme: theme });
    },

    setLocale(locale: string): void {
      config.locale = locale;
      runtime.setBaseContext({ __uiLocale: locale });
    },
  };
}
