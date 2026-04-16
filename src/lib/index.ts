import {
  validators,
  type RequiredRule,
  type RuleObject,
  type RuleWithMessage,
  type ValidateFunction,
} from "./validator";

// [EN] Defines the base shape of form data: keys are always strings and values can be unknown.
// [KR] 폼에 들어갈 데이터의 기본 형태를 정의합니다. 키(Key)는 문자열(string)이고 값(Value)은 unknown일 수 있습니다.
type FormValues = Record<string, unknown>;

// [EN] Lists the available options inside register("email", { ... }).
// [KR] 유저가 register("email", { ... })를 쓸 때, 중괄호 안에 넣을 수 있는 옵션 목록입니다.
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

// [EN] Required options the user must provide when calling createForm({ ... }).
// [KR] createForm({ ... })을 처음 실행할 때 유저가 넘겨줘야 하는 필수 정보입니다.
export type FormOptions<T extends FormValues> = {
  initialValues: T;
  onSubmit: (data: T) => Promise<void> | void;
};

// [EN] Shape of the validation-rules registry used inside the class.
// [KR] 클래스 내부에서 쓸 검사 규칙 레지스트리의 타입입니다.
// [EN] Partial means not every field must have rules (e.g. password has rules, nickname may not).
// [KR] Partial은 모든 필드에 규칙이 필수는 아니라는 뜻입니다. (예: 비밀번호는 규칙이 있지만 닉네임은 없을 수 있음)
type RulesMap<T extends FormValues> = Partial<{
  [K in keyof T]: RegisterOptions<T[K]>;
}>;

class HookForm<T extends FormValues> {
  // [EN] Declares reactive state with Svelte 5 $state for values that should trigger rerenders.
  // [KR] Svelte 5의 핵심인 $state를 사용해 바뀌면 화면을 다시 그려야 하는 변수들을 선언합니다.
  form = $state<T>({} as T);
  errors = $state<Record<keyof T, string>>({} as Record<keyof T, string>);
  rules: RulesMap<T> = {};
  touchedFields = $state<Record<keyof T, boolean>>(
    {} as Record<keyof T, boolean>,
  );
  isSubmitting = $state(false);

  // [EN] Internal storage values that do not need direct rerender tracking.
  // [KR] 화면을 다시 그릴 필요가 없는 내부 보관용 데이터입니다.
  private defaultValues: T = {} as T;
  private onSubmitFunc: (data: T) => Promise<void> | void;

  // [EN] Checks whether the entire form is valid.
  // [KR] 전체 폼이 유효한지 검사합니다.
  isValid = $derived.by(() => {
    for (const key of this.getRegisteredKeys()) {
      if (this.validateField(key) !== "") return false;
    }

    return true;
  });

  // [EN] Checks whether at least one value differs from defaults (dirty state).
  // [KR] 초기값과 현재값이 하나라도 다른지(오염 상태인지) 확인합니다.
  isDirty = $derived.by(() => {
    for (const key of this.getDefaultKeys()) {
      if (this.form[key] !== this.defaultValues[key]) return true;
    }

    return false;
  });

  // [EN] Initializes internal state from user-provided options.
  // [KR] 유저가 준 options를 내부 변수에 세팅합니다.
  constructor(options: FormOptions<T>) {
    this.defaultValues = { ...options.initialValues };
    this.form = { ...options.initialValues } as T;
    this.onSubmitFunc = options.onSubmit;
    this.initializeFieldState(options.initialValues);
  }

  // [EN] Extracts object keys with the precise Array<keyof T> type.
  // [KR] 어떤 객체를 넣든 키를 정확한 타입(Array<keyof T>)으로 뽑아줍니다.
  private getKeys(values: T): Array<keyof T> {
    return Object.keys(values) as Array<keyof T>;
  }

  // [EN] Returns keys from all default form fields (used for full reset and full dirty checks).
  // [KR] 폼 전체 필드(defaultValues)의 키를 뽑습니다. (예: 폼 전체 초기화, 전체 오염도 isDirty 검사)
  private getDefaultKeys(): Array<keyof T> {
    return this.getKeys(this.defaultValues);
  }

  // [EN] Returns only keys of fields that have registered validation rules.
  // [KR] 전체 폼이 아니라 규칙(rules)이 등록된 필드의 키만 뽑습니다.
  // [EN] Example: if the form has 10 fields but only 3 are registered, validation only needs those 3 keys.
  // [KR] 예: 폼에 10칸이 있어도 register를 3칸만 했다면 검사에는 그 3칸 키만 필요합니다.
  private getRegisteredKeys(): Array<keyof T> {
    return Object.keys(this.rules) as Array<keyof T>;
  }

  // [EN] Initializes errors/touched values to avoid undefined access like errors.email on first render.
  // [KR] 이 함수가 없으면 초기 렌더에서 errors.email 접근 시 undefined가 뜰 수 있어, 미리 값을 채워둡니다.
  // [EN] Every key starts with an empty error string and touched=false.
  // [KR] 모든 키를 빈 문자열("")과 touched=false로 초기화합니다.
  private initializeFieldState(values: T): void {
    for (const key of this.getKeys(values)) {
      this.errors[key] = "";
      this.touchedFields[key] = false;
    }
  }

  private resetErrors(keys: Array<keyof T>): void {
    for (const key of keys) {
      this.errors[key] = "";
    }
  }

  private resetTouched(keys: Array<keyof T>): void {
    for (const key of keys) {
      this.touchedFields[key] = false;
    }
  }

  private validateAllRegisteredFields(): void {
    for (const key of this.getRegisteredKeys()) {
      this.errors[key] = this.validateField(key);
    }
  }

  // [EN] Connects an HTML input element with this Svelte form class.
  // [KR] HTML의 <input> 태그와 Svelte 폼 클래스를 연결합니다.
  register = <K extends keyof T>(name: K, options: RegisterOptions<T[K]>) => {
    this.rules[name] = options;

    return (node: HTMLElement) => {
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
  private validateField(key: keyof T): string {
    const value = this.form[key];
    const fieldRules = this.rules[key];

    if (!fieldRules) return "";

    const ruleEntries = Object.entries(fieldRules) as Array<
      [
        keyof RegisterOptions<T[keyof T]>,
        RegisterOptions<T[keyof T]>[keyof RegisterOptions<T[keyof T]>],
      ]
    >;

    for (const [ruleKey, ruleOption] of ruleEntries) {
      if (ruleKey === "mode" || ruleOption === undefined) continue;

      const validator = validators[ruleKey as keyof typeof validators];
      if (!validator) continue;

      const errorMessage = validator(value, ruleOption as never);
      if (errorMessage) return errorMessage;
    }

    return "";
  }

  watch = (name: keyof T) => this.form[name];

  setError = (name: keyof T, error: string) => {
    this.errors[name] = error;
  };

  clearErrors = (name?: keyof T | Array<keyof T>) => {
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

  handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    this.validateAllRegisteredFields();

    if (!this.isValid) return;

    this.isSubmitting = true;

    try {
      await this.onSubmitFunc(this.form);
    } finally {
      this.isSubmitting = false;
    }
  };
}

export function createForm<T extends FormValues>(options: FormOptions<T>) {
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
