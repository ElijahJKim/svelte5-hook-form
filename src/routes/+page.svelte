<script>
  import { createForm } from "$lib/index.svelte.ts";

  const myForm = createForm({ name: "", age: 0 });
  const { form, register, handleSubmit, errors } = myForm;
</script>

<form onsubmit={handleSubmit}>
  <label>이름</label>
  <input
    type="text"
    bind:value={form.name}
    {@attach register("name", {
      required: "성함을 말씀해주세요",
      minLength: 3,
    })}
  />
  {#if errors.name}
    <p>{errors.name}</p>
  {/if}

  <label>나이</label>
  <input
    type="number"
    bind:value={form.age}
    {@attach register("age", { required: true, min: 18 })}
  />
  {#if errors.age}
    <p>{errors.age}</p>
  {/if}
  <button type="submit">Submit</button>
</form>
