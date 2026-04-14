import {
  validators,
  type RequiredRule,
  type RuleObject,
  type RuleWithMessage,
  type ValidateFunction,
} from "./validator.svelte";

//역할: 폼에 들어갈 데이터의 기본 형태를 정의합니다. "키(Key)는 무조건 문자열(string)이고, 값(Value)은 당장 뭔지 모르니까 아무거나(unknown) 들어올 수 있다"는 뜻입니다.
type FormValues = Record<string, unknown>;

//역할: 유저가 register("email", { ... })라고 쓸 때, 중괄호 안에 들어갈 수 있는 옵션들의 메뉴판입니다.
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

//역할: createForm({ ... })을 처음 실행할 때 유저가 넘겨줘야 하는 필수 정보입니다.
export type FormOptions<T extends FormValues> = {
  initialValues: T;
  onSubmit: (data: T) => Promise<void> | void;
};

//역할: 클래스 내부에서 쓸 '검사 규칙 장부'의 규격입니다.
//Partial은 "모든 필드에 다 규칙이 있는 건 아니다"라는 뜻입니다. (예: 비밀번호는 규칙이 있지만, 닉네임은 규칙이 없을 수도 있음)
type RulesMap<T extends FormValues> = Partial<{
  [K in keyof T]: RegisterOptions<T[K]>;
}>;

class HookForm<T extends FormValues> {
  //역할: Svelte 5의 핵심인 $state를 사용해 "바뀌면 화면을 다시 그려야 하는 변수"들을 선언합니다.
  form = $state<T>({} as T);
  errors = $state<Record<keyof T, string>>({} as Record<keyof T, string>);
  rules: RulesMap<T> = {};
  touchedFields = $state<Record<keyof T, boolean>>(
    {} as Record<keyof T, boolean>,
  );
  isSubmitting = $state(false);

  //역할: 화면을 다시 그릴 필요가 없는 내부 보관용 데이터들입니다.
  private defaultValues: T = {} as T;
  private onSubmitFunc: (data: T) => Promise<void> | void;

  //역할: 전체 폼이 완벽한지 검사합니다.
  isValid = $derived.by(() => {
    for (const key of this.getRegisteredKeys()) {
      if (this.validateField(key) !== "") return false;
    }

    return true;
  });

  //역할: 초기값과 현재값이 하나라도 다른지(오염되었는지) 확인합니다.
  isDirty = $derived.by(() => {
    for (const key of this.getDefaultKeys()) {
      if (this.form[key] !== this.defaultValues[key]) return true;
    }

    return false;
  });

  //역할: 유저가 준 options를 내부 변수에 세팅합니다.
  constructor(options: FormOptions<T>) {
    this.defaultValues = { ...options.initialValues };
    this.form = { ...options.initialValues } as T;
    this.onSubmitFunc = options.onSubmit;
    this.initializeFieldState(options.initialValues);
  }

  private getKeys(values: T): Array<keyof T> {
    return Object.keys(values) as Array<keyof T>;
  }

  private getDefaultKeys(): Array<keyof T> {
    return this.getKeys(this.defaultValues);
  }

  private getRegisteredKeys(): Array<keyof T> {
    return Object.keys(this.rules) as Array<keyof T>;
  }

  //역할: 이 함수가 없으면 초기에 화면에서 errors.email을 찾을 때 undefined가 뜹니다. 그래서 미리 모든 키값에 대해 빈 문자열 ""과 false를 꽉꽉 채워넣어 주는 초기화 작업입니다.
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

  register = <K extends keyof T>(name: K, options: RegisterOptions<T[K]>) => {
    this.rules[name] = options;

    return (node: HTMLElement) => {
      const validateCurrentField = () => {
        this.errors[name] = this.validateField(name);
      };

      const handleBlur = () => {
        this.touchedFields[name] = true;
        validateCurrentField();
      };

      if (options.mode === "onInput") {
        node.addEventListener("input", validateCurrentField);
      }

      node.addEventListener("blur", handleBlur);

      return () => {
        delete this.rules[name];

        if (options.mode === "onInput") {
          node.removeEventListener("input", validateCurrentField);
        }

        node.removeEventListener("blur", handleBlur);
      };
    };
  };

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
