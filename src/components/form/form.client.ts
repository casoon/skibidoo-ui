// Form Client Controller - Validation & Submission
import type { FormState } from "../../types/index.js";

export interface ValidationRule {
	type:
		| "required"
		| "email"
		| "min"
		| "max"
		| "minLength"
		| "maxLength"
		| "pattern"
		| "custom";
	value?: unknown;
	message: string;
}

export interface FormControllerOptions {
	validation?: Record<string, ValidationRule[]>;
	onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;
	onValidationError?: (errors: Record<string, string>) => void;
	onFieldChange?: (name: string, value: unknown) => void;
	submitUrl?: string;
}

export class FormController {
	private el: HTMLFormElement;
	private props: Record<string, unknown>;
	private state: FormState;
	private options: FormControllerOptions;

	constructor(
		el: HTMLFormElement,
		props: Record<string, unknown>,
		options: FormControllerOptions = {},
	) {
		this.el = el;
		this.props = props;
		this.options = options;
		this.state = {
			values: this.getInitialValues(),
			errors: {},
			touched: {},
			isSubmitting: false,
			isValid: true,
		};
	}

	init(): void {
		this.bindSubmit();
		this.bindFieldChanges();
		this.bindReset();

		this.emit("init", { state: this.state });
	}

	private getInitialValues(): Record<string, unknown> {
		const values: Record<string, unknown> = {};
		const inputs = this.el.querySelectorAll("input, textarea, select");

		inputs.forEach((input) => {
			const el = input as HTMLInputElement;
			const name = el.name;
			if (!name) return;

			if (el.type === "checkbox") {
				values[name] = el.checked;
			} else if (el.type === "radio") {
				if (el.checked) values[name] = el.value;
			} else {
				values[name] = el.value;
			}
		});

		return values;
	}

	private bindSubmit(): void {
		this.el.addEventListener("submit", async (e) => {
			e.preventDefault();

			if (this.state.isSubmitting) return;

			this.state.isSubmitting = true;
			this.updateSubmitButton(true);

			const isValid = this.validateAll();

			if (!isValid) {
				this.state.isSubmitting = false;
				this.updateSubmitButton(false);
				this.options.onValidationError?.(this.state.errors);
				this.emit("validationError", { errors: this.state.errors });
				return;
			}

			try {
				if (this.options.onSubmit) {
					await this.options.onSubmit(this.state.values);
				} else if (this.options.submitUrl || this.el.action) {
					await this.submitToServer();
				}

				this.emit("submit", { values: this.state.values });
			} catch (error) {
				this.emit("submitError", { error });
			} finally {
				this.state.isSubmitting = false;
				this.updateSubmitButton(false);
			}
		});
	}

	private async submitToServer(): Promise<void> {
		const url = this.options.submitUrl || this.el.action;
		const method = this.el.method || "POST";

		const response = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(this.state.values),
		});

		if (!response.ok) {
			throw new Error(`Submit failed: ${response.status}`);
		}

		const result = await response.json();
		this.emit("submitSuccess", { result });
	}

	private bindFieldChanges(): void {
		const inputs = this.el.querySelectorAll("input, textarea, select");

		inputs.forEach((input) => {
			const el = input as HTMLInputElement;
			const name = el.name;
			if (!name) return;

			el.addEventListener("input", () => {
				this.updateValue(name, el);
				this.validateField(name);
			});

			el.addEventListener("blur", () => {
				this.state.touched[name] = true;
				this.validateField(name);
			});
		});
	}

	private updateValue(name: string, el: HTMLInputElement): void {
		if (el.type === "checkbox") {
			this.state.values[name] = el.checked;
		} else {
			this.state.values[name] = el.value;
		}

		this.options.onFieldChange?.(name, this.state.values[name]);
		this.emit("fieldChange", { name, value: this.state.values[name] });
	}

	private bindReset(): void {
		this.el.addEventListener("reset", () => {
			setTimeout(() => {
				this.state.values = this.getInitialValues();
				this.state.errors = {};
				this.state.touched = {};
				this.clearAllErrors();
				this.emit("reset", {});
			}, 0);
		});
	}

	private validateAll(): boolean {
		const fields = (this.props.fields as string[]) || [];
		let isValid = true;

		fields.forEach((name) => {
			if (!this.validateField(name)) {
				isValid = false;
			}
		});

		this.state.isValid = isValid;
		return isValid;
	}

	private validateField(name: string): boolean {
		const rules = this.options.validation?.[name] || [];
		const value = this.state.values[name];
		let error = "";

		for (const rule of rules) {
			const validationError = this.checkRule(rule, value);
			if (validationError) {
				error = validationError;
				break;
			}
		}

		// Also check HTML5 validation
		const input = this.el.querySelector(`[name="${name}"]`) as HTMLInputElement;
		if (input && !input.validity.valid && !error) {
			error = input.validationMessage;
		}

		this.state.errors[name] = error;
		this.showFieldError(name, error);

		return !error;
	}

	private checkRule(rule: ValidationRule, value: unknown): string | null {
		const strValue = String(value ?? "");

		switch (rule.type) {
			case "required":
				if (!value || strValue.trim() === "") return rule.message;
				break;
			case "email":
				if (strValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strValue))
					return rule.message;
				break;
			case "minLength":
				if (strValue.length < (rule.value as number)) return rule.message;
				break;
			case "maxLength":
				if (strValue.length > (rule.value as number)) return rule.message;
				break;
			case "min":
				if (Number(value) < (rule.value as number)) return rule.message;
				break;
			case "max":
				if (Number(value) > (rule.value as number)) return rule.message;
				break;
			case "pattern":
				if (!new RegExp(rule.value as string).test(strValue))
					return rule.message;
				break;
			case "custom":
				if (typeof rule.value === "function" && !rule.value(value))
					return rule.message;
				break;
		}

		return null;
	}

	private showFieldError(name: string, error: string): void {
		const errorEl = this.el.querySelector(`[data-error="${name}"]`);
		const input = this.el.querySelector(`[name="${name}"]`);

		if (errorEl) {
			errorEl.textContent = error;
		}

		input?.classList.toggle("ui-form__input--error", Boolean(error));
	}

	private clearAllErrors(): void {
		this.el.querySelectorAll(".ui-form__error").forEach((el) => {
			el.textContent = "";
		});
		this.el.querySelectorAll(".ui-form__input--error").forEach((el) => {
			el.classList.remove("ui-form__input--error");
		});
	}

	private updateSubmitButton(loading: boolean): void {
		const btn = this.el.querySelector(".ui-form__submit") as HTMLButtonElement;
		if (btn) {
			btn.disabled = loading;
			if (loading) {
				btn.dataset.originalText = btn.textContent || "";
				btn.textContent = "Wird gesendet...";
			} else if (btn.dataset.originalText) {
				btn.textContent = btn.dataset.originalText;
			}
		}
	}

	setValues(values: Record<string, unknown>): void {
		Object.entries(values).forEach(([name, value]) => {
			this.state.values[name] = value;
			const input = this.el.querySelector(
				`[name="${name}"]`,
			) as HTMLInputElement;
			if (input) {
				if (input.type === "checkbox") {
					input.checked = Boolean(value);
				} else {
					input.value = String(value);
				}
			}
		});
	}

	getValues(): Record<string, unknown> {
		return { ...this.state.values };
	}

	getErrors(): Record<string, string> {
		return { ...this.state.errors };
	}

	isValid(): boolean {
		return this.validateAll();
	}

	private emit(event: string, detail: Record<string, unknown>): void {
		this.el.dispatchEvent(
			new CustomEvent(`form:${event}`, {
				detail,
				bubbles: true,
			}),
		);
	}

	destroy(): void {
		this.emit("destroy", {});
	}
}
