import { validators, } from "./validator.svelte";
class HookForm {
    // [EN] Declares reactive state with Svelte 5 $state for values that should trigger rerenders.
    // [KR] Svelte 5의 핵심인 $state를 사용해 바뀌면 화면을 다시 그려야 하는 변수들을 선언합니다.
    form = $state({});
    errors = $state({});
    rules = {};
    touchedFields = $state({});
    isSubmitting = $state(false);
    // [EN] Internal storage values that do not need direct rerender tracking.
    // [KR] 화면을 다시 그릴 필요가 없는 내부 보관용 데이터입니다.
    defaultValues = {};
    onSubmitFunc;
    // [EN] Checks whether the entire form is valid.
    // [KR] 전체 폼이 유효한지 검사합니다.
    isValid = $derived.by(() => {
        for (const key of this.getRegisteredKeys()) {
            if (this.validateField(key) !== "")
                return false;
        }
        return true;
    });
    // [EN] Checks whether at least one value differs from defaults (dirty state).
    // [KR] 초기값과 현재값이 하나라도 다른지(오염 상태인지) 확인합니다.
    isDirty = $derived.by(() => {
        for (const key of this.getDefaultKeys()) {
            if (this.form[key] !== this.defaultValues[key])
                return true;
        }
        return false;
    });
    // [EN] Initializes internal state from user-provided options.
    // [KR] 유저가 준 options를 내부 변수에 세팅합니다.
    constructor(options) {
        this.defaultValues = { ...options.initialValues };
        this.form = { ...options.initialValues };
        this.onSubmitFunc = options.onSubmit;
        this.initializeFieldState(options.initialValues);
    }
    // [EN] Extracts object keys with the precise Array<keyof T> type.
    // [KR] 어떤 객체를 넣든 키를 정확한 타입(Array<keyof T>)으로 뽑아줍니다.
    getKeys(values) {
        return Object.keys(values);
    }
    // [EN] Returns keys from all default form fields (used for full reset and full dirty checks).
    // [KR] 폼 전체 필드(defaultValues)의 키를 뽑습니다. (예: 폼 전체 초기화, 전체 오염도 isDirty 검사)
    getDefaultKeys() {
        return this.getKeys(this.defaultValues);
    }
    // [EN] Returns only keys of fields that have registered validation rules.
    // [KR] 전체 폼이 아니라 규칙(rules)이 등록된 필드의 키만 뽑습니다.
    // [EN] Example: if the form has 10 fields but only 3 are registered, validation only needs those 3 keys.
    // [KR] 예: 폼에 10칸이 있어도 register를 3칸만 했다면 검사에는 그 3칸 키만 필요합니다.
    getRegisteredKeys() {
        return Object.keys(this.rules);
    }
    // [EN] Initializes errors/touched values to avoid undefined access like errors.email on first render.
    // [KR] 이 함수가 없으면 초기 렌더에서 errors.email 접근 시 undefined가 뜰 수 있어, 미리 값을 채워둡니다.
    // [EN] Every key starts with an empty error string and touched=false.
    // [KR] 모든 키를 빈 문자열("")과 touched=false로 초기화합니다.
    initializeFieldState(values) {
        for (const key of this.getKeys(values)) {
            this.errors[key] = "";
            this.touchedFields[key] = false;
        }
    }
    resetErrors(keys) {
        for (const key of keys) {
            this.errors[key] = "";
        }
    }
    resetTouched(keys) {
        for (const key of keys) {
            this.touchedFields[key] = false;
        }
    }
    validateAllRegisteredFields() {
        for (const key of this.getRegisteredKeys()) {
            this.errors[key] = this.validateField(key);
        }
    }
    // [EN] Connects an HTML input element with this Svelte form class.
    // [KR] HTML의 <input> 태그와 Svelte 폼 클래스를 연결합니다.
    register = (name, options) => {
        this.rules[name] = options;
        return (node) => {
            const validateCurrentField = () => {
                this.errors[name] = this.validateField(name);
            };
            const handleBlur = () => {
                this.touchedFields[name] = true;
                if (options.mode) {
                    validateCurrentField();
                }
            };
            if (options.mode === "onInput") {
                node.addEventListener("input", validateCurrentField);
            }
            node.addEventListener("blur", handleBlur);
            return () => {
                delete this.rules[name];
                node.removeEventListener("input", validateCurrentField);
                node.removeEventListener("blur", handleBlur);
            };
        };
    };
    // [EN] Iterates through registered rules and returns the first validation error.
    // [KR] 등록된 규칙을 하나씩 검사하면서 첫 번째 위반 메시지를 반환합니다.
    validateField(key) {
        const value = this.form[key];
        const fieldRules = this.rules[key];
        if (!fieldRules)
            return "";
        const ruleEntries = Object.entries(fieldRules);
        for (const [ruleKey, ruleOption] of ruleEntries) {
            if (ruleKey === "mode" || ruleOption === undefined)
                continue;
            const validator = validators[ruleKey];
            if (!validator)
                continue;
            const errorMessage = validator(value, ruleOption);
            if (errorMessage)
                return errorMessage;
        }
        return "";
    }
    watch = (name) => this.form[name];
    setError = (name, error) => {
        this.errors[name] = error;
    };
    clearErrors = (name) => {
        if (!name) {
            this.resetErrors(this.getDefaultKeys());
            return;
        }
        if (Array.isArray(name)) {
            this.resetErrors(name);
            return;
        }
        this.errors[name] = "";
    };
    reset = () => {
        const keys = this.getDefaultKeys();
        for (const key of keys) {
            this.form[key] = this.defaultValues[key];
        }
        this.resetErrors(keys);
        this.resetTouched(keys);
        this.isSubmitting = false;
    };
    handleSubmit = async (e) => {
        e.preventDefault();
        this.validateAllRegisteredFields();
        if (!this.isValid)
            return;
        this.isSubmitting = true;
        try {
            await this.onSubmitFunc(this.form);
        }
        finally {
            this.isSubmitting = false;
        }
    };
}
export function createForm(options) {
    const formInstance = new HookForm(options);
    return {
        form: formInstance.form,
        errors: formInstance.errors,
        isDirty: () => formInstance.isDirty,
        isValid: () => formInstance.isValid,
        isSubmitting: () => formInstance.isSubmitting,
        reset: formInstance.reset,
        register: formInstance.register,
        handleSubmit: formInstance.handleSubmit,
        setError: formInstance.setError,
        touchedFields: formInstance.touchedFields,
        watch: formInstance.watch,
        clearErrors: formInstance.clearErrors,
    };
}
