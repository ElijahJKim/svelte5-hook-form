export type RuleObject<T> = {
  value: T;
  message?: string;
};

export type RuleWithMessage<T> = T | RuleObject<T>;
export type RequiredRule = boolean | string | RuleObject<boolean>;
export type ValidateFunction<Value = unknown> = (
  value: Value,
) => string | boolean | null | undefined;

type ValidationResult = string | null;

function isRuleObject<T>(rule: unknown): rule is RuleObject<T> {
  return typeof rule === "object" && rule !== null && "value" in rule;
}

function extractRule<T>(
  rule: RuleWithMessage<T>,
  defaultMessage: string,
): { value: T; message: string } {
  if (isRuleObject<T>(rule)) {
    return { value: rule.value, message: rule.message ?? defaultMessage };
  }

  return { value: rule, message: defaultMessage };
}

function describeRuleValue(rule: unknown): string {
  if (isRuleObject<unknown>(rule)) {
    return String(rule.value);
  }

  return String(rule);
}

type ValidatorMap = {
  required: (value: unknown, rule: RequiredRule) => ValidationResult;
  minLength: (value: unknown, rule: RuleWithMessage<number>) => ValidationResult;
  maxLength: (value: unknown, rule: RuleWithMessage<number>) => ValidationResult;
  min: (value: unknown, rule: RuleWithMessage<number>) => ValidationResult;
  max: (value: unknown, rule: RuleWithMessage<number>) => ValidationResult;
  pattern: (value: unknown, rule: RegExp | RuleObject<RegExp>) => ValidationResult;
  validate: (value: unknown, rule: ValidateFunction) => ValidationResult;
};

export const validators: ValidatorMap = {
  required: (value, rule) => {
    let isRequired = false;
    let message = "This field is required";

    if (typeof rule === "string") {
      isRequired = true;
      message = rule;
    } else {
      const extracted = extractRule<boolean>(rule, message);
      isRequired = extracted.value;
      message = extracted.message;
    }

    if (
      isRequired &&
      (value === undefined || value === null || String(value).trim() === "")
    ) {
      return message;
    }

    return null;
  },

  minLength: (value, rule) => {
    const { value: min, message } = extractRule<number>(
      rule,
      `Minimum ${describeRuleValue(rule)} characters`,
    );

    if (typeof value === "string" && value.length < min) return message;
    return null;
  },

  maxLength: (value, rule) => {
    const { value: max, message } = extractRule<number>(
      rule,
      `Maximum ${describeRuleValue(rule)} characters`,
    );

    if (typeof value === "string" && value.length > max) return message;
    return null;
  },

  min: (value, rule) => {
    const { value: min, message } = extractRule<number>(
      rule,
      `${describeRuleValue(rule)} minimum value`,
    );

    if (value !== "" && Number(value) < min) return message;
    return null;
  },

  max: (value, rule) => {
    const { value: max, message } = extractRule<number>(
      rule,
      `${describeRuleValue(rule)} maximum value`,
    );

    if (value !== "" && Number(value) > max) return message;
    return null;
  },

  pattern: (value, rule) => {
    const message = isRuleObject<RegExp>(rule)
      ? (rule.message ?? "Invalid input")
      : "Invalid input";
    const regex = isRuleObject<RegExp>(rule) ? rule.value : rule;

    if (typeof value === "string" && value !== "" && !regex.test(value)) {
      return message;
    }

    return null;
  },

  validate: (value, rule) => {
    const result = rule(value);

    if (typeof result === "string") return result;
    if (result === false) return "Invalid value";

    return null;
  },
};
