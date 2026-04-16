export type RuleObject<T> = {
    value: T;
    message?: string;
};
export type RuleWithMessage<T> = T | RuleObject<T>;
export type RequiredRule = boolean | string | RuleObject<boolean>;
export type ValidateFunction<Value = unknown> = (value: Value) => string | boolean | null | undefined;
type ValidationResult = string | null;
type ValidatorMap = {
    required: (value: unknown, rule: RequiredRule) => ValidationResult;
    minLength: (value: unknown, rule: RuleWithMessage<number>) => ValidationResult;
    maxLength: (value: unknown, rule: RuleWithMessage<number>) => ValidationResult;
    min: (value: unknown, rule: RuleWithMessage<number>) => ValidationResult;
    max: (value: unknown, rule: RuleWithMessage<number>) => ValidationResult;
    pattern: (value: unknown, rule: RegExp | RuleObject<RegExp>) => ValidationResult;
    validate: (value: unknown, rule: ValidateFunction) => ValidationResult;
};
export declare const validators: ValidatorMap;
export {};
