function isRuleObject(rule) {
    return typeof rule === "object" && rule !== null && "value" in rule;
}
function extractRule(rule, defaultMessage) {
    if (isRuleObject(rule)) {
        return { value: rule.value, message: rule.message ?? defaultMessage };
    }
    return { value: rule, message: defaultMessage };
}
function describeRuleValue(rule) {
    if (isRuleObject(rule)) {
        return String(rule.value);
    }
    return String(rule);
}
export const validators = {
    required: (value, rule) => {
        let isRequired = false;
        let message = "This field is required";
        if (typeof rule === "string") {
            isRequired = true;
            message = rule;
        }
        else {
            const extracted = extractRule(rule, message);
            isRequired = extracted.value;
            message = extracted.message;
        }
        if (isRequired &&
            (value === undefined || value === null || String(value).trim() === "")) {
            return message;
        }
        return null;
    },
    minLength: (value, rule) => {
        const { value: min, message } = extractRule(rule, `Minimum ${describeRuleValue(rule)} characters`);
        if (typeof value === "string" && value.length < min)
            return message;
        return null;
    },
    maxLength: (value, rule) => {
        const { value: max, message } = extractRule(rule, `Maximum ${describeRuleValue(rule)} characters`);
        if (typeof value === "string" && value.length > max)
            return message;
        return null;
    },
    min: (value, rule) => {
        const { value: min, message } = extractRule(rule, `${describeRuleValue(rule)} minimum value`);
        if (value !== "" && Number(value) < min)
            return message;
        return null;
    },
    max: (value, rule) => {
        const { value: max, message } = extractRule(rule, `${describeRuleValue(rule)} maximum value`);
        if (value !== "" && Number(value) > max)
            return message;
        return null;
    },
    pattern: (value, rule) => {
        const message = isRuleObject(rule)
            ? (rule.message ?? "Invalid input")
            : "Invalid input";
        const regex = isRuleObject(rule) ? rule.value : rule;
        if (typeof value === "string" && value !== "" && !regex.test(value)) {
            return message;
        }
        return null;
    },
    validate: (value, rule) => {
        const result = rule(value);
        if (typeof result === "string")
            return result;
        if (result === false)
            return "Invalid value";
        return null;
    },
};
