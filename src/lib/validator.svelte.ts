export const validators = {
  required: (value: any, rule: any) => {
    if (!value || value.toString().trim() === "") {
      return typeof rule === "string" ? rule : "필수 입력 항목입니다.";
    }
    return null;
  },
  minLength: (value: any, rule: any) => {
    const min = typeof rule === "object" ? rule.value : rule;
    const message =
      typeof rule === "object" ? rule.message : `${min}자 이상 입력하세요.`;

    if (value.length < min) return message;
    return null;
  },
};
