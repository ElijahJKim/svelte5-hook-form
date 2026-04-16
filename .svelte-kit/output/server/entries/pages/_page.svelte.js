import { x as derived, y as attr, z as attr_style, F as stringify } from "../../chunks/index.js";
import { e as escape_html } from "../../chunks/context.js";
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
const validators = {
  required: (value, rule) => {
    let isRequired = false;
    let message = "This field is required";
    if (typeof rule === "string") {
      isRequired = true;
      message = rule;
    } else {
      const extracted = extractRule(rule, message);
      isRequired = extracted.value;
      message = extracted.message;
    }
    if (isRequired && (value === void 0 || value === null || String(value).trim() === "")) {
      return message;
    }
    return null;
  },
  minLength: (value, rule) => {
    const { value: min, message } = extractRule(rule, `Minimum ${describeRuleValue(rule)} characters`);
    if (typeof value === "string" && value.length < min) return message;
    return null;
  },
  maxLength: (value, rule) => {
    const { value: max, message } = extractRule(rule, `Maximum ${describeRuleValue(rule)} characters`);
    if (typeof value === "string" && value.length > max) return message;
    return null;
  },
  min: (value, rule) => {
    const { value: min, message } = extractRule(rule, `${describeRuleValue(rule)} minimum value`);
    if (value !== "" && Number(value) < min) return message;
    return null;
  },
  max: (value, rule) => {
    const { value: max, message } = extractRule(rule, `${describeRuleValue(rule)} maximum value`);
    if (value !== "" && Number(value) > max) return message;
    return null;
  },
  pattern: (value, rule) => {
    const message = isRuleObject(rule) ? rule.message ?? "Invalid input" : "Invalid input";
    const regex = isRuleObject(rule) ? rule.value : rule;
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
  }
};
class HookForm {
  // [EN] Declares reactive state with Svelte 5 $state for values that should trigger rerenders.
  // [KR] Svelte 5의 핵심인 $state를 사용해 바뀌면 화면을 다시 그려야 하는 변수들을 선언합니다.
  form = {};
  errors = {};
  rules = {};
  touchedFields = {};
  isSubmitting = false;
  // [EN] Internal storage values that do not need direct rerender tracking.
  // [KR] 화면을 다시 그릴 필요가 없는 내부 보관용 데이터입니다.
  defaultValues = {};
  onSubmitFunc;
  #isValid = derived(
    // [EN] Checks whether the entire form is valid.
    // [KR] 전체 폼이 유효한지 검사합니다.
    () => {
      for (const key of this.getRegisteredKeys()) {
        if (this.validateField(key) !== "") return false;
      }
      return true;
    }
  );
  get isValid() {
    return this.#isValid();
  }
  set isValid($$value) {
    return this.#isValid($$value);
  }
  #isDirty = derived(() => {
    for (const key of this.getDefaultKeys()) {
      if (this.form[key] !== this.defaultValues[key]) return true;
    }
    return false;
  });
  get isDirty() {
    return this.#isDirty();
  }
  set isDirty($$value) {
    return this.#isDirty($$value);
  }
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
    if (!fieldRules) return "";
    const ruleEntries = Object.entries(fieldRules);
    for (const [ruleKey, ruleOption] of ruleEntries) {
      if (ruleKey === "mode" || ruleOption === void 0) continue;
      const validator = validators[ruleKey];
      if (!validator) continue;
      const errorMessage = validator(value, ruleOption);
      if (errorMessage) return errorMessage;
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
    if (!this.isValid) return;
    this.isSubmitting = true;
    try {
      await this.onSubmitFunc(this.form);
    } finally {
      this.isSubmitting = false;
    }
  };
}
function createForm(options) {
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
    clearErrors: formInstance.clearErrors
  };
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const {
      form,
      errors,
      touchedFields,
      watch,
      isDirty,
      isValid,
      isSubmitting
    } = createForm({
      initialValues: { email: "user@example.com", nickname: "" },
      onSubmit: async (data) => {
        console.log("제출 데이터:", data);
        alert("서버 전송 완료!");
      }
    });
    const watchedNickname = watch("nickname");
    $$renderer2.push(`<div class="test-container" style="max-width: 500px;padding: 2rem; border: 1px solid #ddd;"><h1>API Methods Test</h1> <form style="display: flex; flex-direction: column; gap: 1rem;"><div><label>이메일 (초기값 있음)</label> <input${attr("value", form.email)} style="display: block; width: 100%;"/> `);
    if (touchedFields.email && errors.email) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p style="color: red; font-size: 0.8rem;">${escape_html(errors.email)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label>닉네임 (Watch 중: ${escape_html(watchedNickname)})</label> <input${attr("value", form.nickname)} style="display: block; width: 100%;"/> `);
    if (touchedFields.nickname && errors.nickname) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p style="color: red; font-size: 0.8rem;">${escape_html(errors.nickname)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <hr/> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;"><button type="button">닉네임 수동 에러 설정</button> <button type="button">닉네임 에러만 지우기</button> <button type="button"${attr("disabled", !isDirty(), true)}>전체 초기화 (reset)</button> <button type="button">모든 에러 지우기</button></div> <button type="submit"${attr("disabled", !isValid() || isSubmitting(), true)}${attr_style(` padding: 10px;background: ${stringify(isValid() ? "#4CAF50" : "#ccc")}; color: white;`)}>${escape_html(isSubmitting() ? "전송 중..." : "제출하기")}</button></form> <div style="margin-top: 1rem; padding: 1rem; background: #eee; font-family: monospace; font-size: 0.8rem;"><p>isDirty: ${escape_html(isDirty())}</p> <p>isValid: ${escape_html(isValid())}</p> <p>Touched: ${escape_html(JSON.stringify(touchedFields))}</p></div></div>`);
  });
}
export {
  _page as default
};
