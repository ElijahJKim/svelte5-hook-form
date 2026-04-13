import { validators } from "./validator.svelte";

// src/lib/index.svelte.ts
class HookForm<T extends Record<string, any>> {
  form = $state<T>() as T;

  errors = $state<Record<keyof T, string>>({} as any);

  // 1. 각 필드의 유효성 검사 규칙(rules)을 모아둘 객체를 만듭니다.
  rules: Record<keyof T, any> = {} as any;

  constructor(initialValue: T) {
    this.form = initialValue;
    for (const key in initialValue) {
      this.errors[key] = "";
    }
  }

  // 2. 💡 화살표 함수로 만드는 이유: 유저가 const { register } = myForm 으로
  // 꺼내 써도 this(클래스)를 잃어버리지 않게 하기 위해서입니다! (꿀팁)
  register = (name: keyof T, options: any) => {
    // 폼 객체에 넘겨받은 규칙을 중앙 저장소(this.rules)에 등록합니다.
    this.rules[name] = options;

    // 3. Svelte 5의 {@attach}가 요구하는 함수를 반환합니다.
    // 이 함수는 HTML 요소가 화면에 나타날 때(Mount) 실행됩니다.
    return (node: HTMLElement) => {
      // 나중에 기능 확장 팁:
      // 여기서 node.addEventListener('blur', ...) 등을 달아서
      // 유저가 입력칸을 빠져나갈 때 즉시 에러를 검사하게 만들 수도 있습니다!

      // 4. Cleanup (청소)
      return () => {
        // HTML 요소가 화면에서 사라질 때(Unmount) 규칙이나 이벤트를 지워줍니다.
        delete this.rules[name];
      };
    };
  };

  private validateField(key: keyof T): string {
    const value = this.form[key];
    const fieldRules = this.rules[key];
    console.log(fieldRules, "fieldRules");
    for (const ruleKey in fieldRules) {
      const validator = validators[ruleKey as keyof typeof validators];
      if (validator) {
        const errorMessage = validator(value, fieldRules[ruleKey]);
        if (errorMessage) return errorMessage; // 첫 번째 에러 발견 시 즉시 반환
      }
    }
    return ""; // 에러 없음
  }

  handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    // 이제 handleSubmit은 전체를 순회하며 결과를 에러 상태에 담기만 합니다.
    for (const key in this.rules) {
      this.errors[key] = this.validateField(key);
    }

    const hasError = Object.values(this.errors).some((msg) => msg !== "");
    if (!hasError) {
      console.log("성공! 전송 데이터:", this.form);
    }
  };
}

// 2. 유저가 쓸 때는 'new' 키워드 없이 편하게 쓰도록 랩핑 함수 제공
export function createForm<T extends Record<string, any>>(initialValues: T) {
  const formInstance = new HookForm(initialValues);

  return {
    form: formInstance.form, // $state 객체 자체를 넘김
    errors: formInstance.errors,
    register: formInstance.register,
    handleSubmit: formInstance.handleSubmit,
  };
}
