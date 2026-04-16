# svelte5-hook-form

> The modern, reactive, and headless form validation library for **Svelte 5**.

**svelte5-hook-form** is built from the ground up using Svelte 5's powerful Runes (`$state`, `$derived`) and the new `{@attach}` directive. It provides a seamless, highly performant way to manage form states and validations without the boilerplate.

**[Official Documentation](https://svelte5-hook-form-document.vercel.app/)** | **[GitHub Repository](https://github.com/ElijahJKim/svelte5-hook-form)**

---

## Features

- **Svelte 5 Native**: Fully powered by Runes (`$state`, `$derived`) for flawless and optimized reactivity.
- **Powered by {@attach}**: Leverages Svelte 5's modern attachment API, replacing legacy `use:` actions for better dynamic updates and component spreading.
- **Headless UI Friendly**: Works out-of-the-box with native HTML inputs, custom components, and headless libraries like Melt UI or Bits UI.
- **Granular Re-rendering**: Only tracks and updates the fields that actually change.
- **API**: Built-in methods for `watch`, `reset`, `setError`, `clearErrors`, and reactive states like `isDirty`, `isValid`, and `isSubmitting`.
- **TypeScript Ready**: Written in TypeScript to provide excellent developer experience and auto-completion.

---

## Installation

Install the package using your favorite package manager:

### npm

```bash
npm install svelte5-hook-form

```

---

## Quick Start

```svelte
<script lang="ts">
  import { createForm } from 'svelte5-hook-form';

  // 1. Initialize the form engine
  const { form, errors, register, handleSubmit } = createForm({
    initialValues: {
      username: "",
      password: ""
    },
    onSubmit: (data) => {
      alert(`Welcome, ${data.username}!`);
    },
  });
</script>

<form onsubmit={handleSubmit} class="login-form">

  <div class="field">
    <label for="username">Username</label>
    <input
      id="username"
      bind:value={form.username}
      {@attach register("username", { required: "Username is required" })}
    />
    <span class="error">{errors.username || ""}</span>
  </div>

  <div class="field">
    <label for="password">Password</label>
    <input
      id="password"
      type="password"
      bind:value={form.password}
      {@attach register("password", {
        required: "Password is required",
        minLength: { value: 6, message: "Must be at least 6 characters" }
      })}
    />
    <span class="error">{errors.password || ""}</span>
  </div>

  <button type="submit">Login</button>
</form>
```
