<script lang="ts">
  import { createForm } from "$lib/index.svelte";

  const {
    form,
    errors,
    register,
    setError,
    clearErrors,
    handleSubmit,
    isValid,
  } = createForm({
    initialValues: { email: "" },
    onSubmit: async (data) => {
      setError("email", "이미 가입된 이메일입니다.");
    },
  });

  function handleInput() {
    if (errors.email) {
      clearErrors("email");
    }
  }
</script>

<form onsubmit={handleSubmit}>
  <input
    bind:value={form.email}
    oninput={handleInput}
    {@attach register("email", { required: true })}
  />
  <button type="submit" disabled={!isValid()}>Submit</button>
</form>

{#if errors.email}
  <p style="color: red;">{errors.email}</p>
  <button type="button" onclick={() => clearErrors("email")}>에러 지우기</button
  >
{/if}
