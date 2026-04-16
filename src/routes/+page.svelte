<script lang="ts">
  import { createForm } from "$lib";

  // 1. 폼 초기화
  const {
    form,
    register,
    errors,
    touchedFields,
    watch,
    reset,
    setError,
    clearErrors,
    isDirty,
    isValid,
    isSubmitting,
    handleSubmit,
  } = createForm({
    initialValues: {
      email: "user@example.com",
      nickname: "",
    },
    onSubmit: async (data) => {
      console.log("제출 데이터:", data);
      alert("서버 전송 완료!");
    },
  });

  // 2. watch 테스트: 닉네임이 바뀔 때마다 실시간으로 반응함
  const watchedNickname = $derived(watch("nickname"));
</script>

<div
  class="test-container"
  style=" max-width: 500px;padding: 2rem; border: 1px solid #ddd;"
>
  <h1>API Methods Test</h1>

  <form
    onsubmit={handleSubmit}
    style="display: flex; flex-direction: column; gap: 1rem;"
  >
    <div>
      <label>이메일 (초기값 있음)</label>
      <input
        bind:value={form.email}
        {@attach register("email", {
          required: "이메일은 필수입니다.",
          minLength: { value: 3 },
          mode: "onBlur",
        })}
        style="display: block; width: 100%;"
      />
      {#if touchedFields.email && errors.email}
        <p style="color: red; font-size: 0.8rem;">{errors.email}</p>
      {/if}
    </div>

    <div>
      <label>닉네임 (Watch 중: {watchedNickname})</label>
      <input
        bind:value={form.nickname}
        {@attach register("nickname", {
          required: "닉네임 필수",
          minLength: { value: 3 },
          mode: "onInput",
        })}
        style="display: block; width: 100%;"
      />
      {#if touchedFields.nickname && errors.nickname}
        <p style="color: red; font-size: 0.8rem;">{errors.nickname}</p>
      {/if}
    </div>

    <hr />

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
      <button
        type="button"
        onclick={() => setError("nickname", "이미 사용 중인 닉네임입니다.")}
      >
        닉네임 수동 에러 설정
      </button>

      <button type="button" onclick={() => clearErrors("nickname")}>
        닉네임 에러만 지우기
      </button>

      <button type="button" onclick={() => reset()} disabled={!isDirty()}>
        전체 초기화 (reset)
      </button>

      <button type="button" onclick={() => clearErrors()}>
        모든 에러 지우기
      </button>
    </div>

    <button
      type="submit"
      disabled={!isValid() || isSubmitting()}
      style=" padding: 10px;background: {isValid()
        ? '#4CAF50'
        : '#ccc'}; color: white;"
    >
      {isSubmitting() ? "전송 중..." : "제출하기"}
    </button>
  </form>

  <div
    style="margin-top: 1rem; padding: 1rem; background: #eee; font-family: monospace; font-size: 0.8rem;"
  >
    <p>isDirty: {isDirty()}</p>
    <p>isValid: {isValid()}</p>
    <p>Touched: {JSON.stringify(touchedFields)}</p>
  </div>
</div>
