import { type RequiredRule, type RuleObject, type RuleWithMessage, type ValidateFunction } from "./validator.svelte";
type FormValues = Record<string, unknown>;
export type RegisterOptions<Value = unknown> = {
    required?: RequiredRule;
    min?: RuleWithMessage<number>;
    max?: RuleWithMessage<number>;
    minLength?: RuleWithMessage<number>;
    maxLength?: RuleWithMessage<number>;
    pattern?: RegExp | RuleObject<RegExp>;
    validate?: ValidateFunction<Value>;
    mode?: "onInput" | "onBlur";
};
export type FormOptions<T extends FormValues> = {
    initialValues: T;
    onSubmit: (data: T) => Promise<void> | void;
};
export declare function createForm<T extends FormValues>(options: FormOptions<T>): {
    form: T;
    errors: Record<keyof T, string>;
    isDirty: () => boolean;
    isValid: () => boolean;
    isSubmitting: () => boolean;
    reset: () => void;
    register: <K extends keyof T>(name: K, options: RegisterOptions<T[K]>) => (node: HTMLElement) => () => void;
    handleSubmit: (e: SubmitEvent) => Promise<void>;
    setError: (name: keyof T, error: string) => void;
    touchedFields: Record<keyof T, boolean>;
    watch: (name: keyof T) => T[keyof T];
    clearErrors: (name?: keyof T | (keyof T)[] | undefined) => void;
};
export {};
