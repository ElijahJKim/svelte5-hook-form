
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const NVM_INC: string;
	export const _ZO_DOCTOR: string;
	export const GOMODCACHE: string;
	export const PUPPETEER_CACHE_DIR: string;
	export const npm_config_legacy_peer_deps: string;
	export const VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
	export const NODE: string;
	export const NVM_CD_FLAGS: string;
	export const socks5_proxy: string;
	export const SOCKS5_PROXY: string;
	export const INIT_CWD: string;
	export const TERM: string;
	export const SHELL: string;
	export const VSCODE_PROCESS_TITLE: string;
	export const HOMEBREW_REPOSITORY: string;
	export const TMPDIR: string;
	export const npm_config_npm_globalconfig: string;
	export const PIP_CACHE_DIR: string;
	export const MallocNanoZone: string;
	export const CURSOR_TRACE_ID: string;
	export const NO_COLOR: string;
	export const npm_config_registry: string;
	export const ZSH: string;
	export const PNPM_HOME: string;
	export const NO_PROXY: string;
	export const NVM_DIR: string;
	export const http_proxy: string;
	export const USER: string;
	export const NX_CACHE_DIRECTORY: string;
	export const CYPRESS_CACHE_FOLDER: string;
	export const LS_COLORS: string;
	export const COMMAND_MODE: string;
	export const CCACHE_DIR: string;
	export const YARN_CACHE_FOLDER: string;
	export const npm_config_globalconfig: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const BUN_INSTALL_CACHE_DIR: string;
	export const npm_execpath: string;
	export const PAGER: string;
	export const HOMEBREW_CACHE: string;
	export const ELECTRON_RUN_AS_NODE: string;
	export const LSCOLORS: string;
	export const npm_config_frozen_lockfile: string;
	export const npm_config_verify_deps_before_run: string;
	export const all_proxy: string;
	export const ALL_PROXY: string;
	export const PATH: string;
	export const npm_config_devdir: string;
	export const CURSOR_SANDBOX: string;
	export const LaunchInstanceID: string;
	export const npm_package_json: string;
	export const __CFBundleIdentifier: string;
	export const PWD: string;
	export const CP_HOME_DIR: string;
	export const npm_command: string;
	export const socks_proxy: string;
	export const VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
	export const SOCKS_PROXY: string;
	export const P9K_SSH: string;
	export const VSCODE_ESM_ENTRYPOINT: string;
	export const npm_config__jsr_registry: string;
	export const npm_lifecycle_event: string;
	export const CURSOR_AGENT: string;
	export const CONDA_PKGS_DIRS: string;
	export const npm_package_name: string;
	export const NODE_PATH: string;
	export const GIT_HTTP_PROXY: string;
	export const XPC_FLAGS: string;
	export const PLAYWRIGHT_BROWSERS_PATH: string;
	export const CURSOR_EXTENSION_HOST_ROLE: string;
	export const FORCE_COLOR: string;
	export const RBENV_SHELL: string;
	export const https_proxy: string;
	export const HTTPS_PROXY: string;
	export const GEM_SPEC_CACHE: string;
	export const XPC_SERVICE_NAME: string;
	export const npm_package_version: string;
	export const pnpm_config_verify_deps_before_run: string;
	export const SHLVL: string;
	export const HOME: string;
	export const GRADLE_USER_HOME: string;
	export const VSCODE_NLS_CONFIG: string;
	export const HOMEBREW_PREFIX: string;
	export const CI: string;
	export const no_proxy: string;
	export const PNPM_STORE_PATH: string;
	export const HTTP_PROXY: string;
	export const BUNDLE_PATH: string;
	export const LESS: string;
	export const TURBO_CACHE_DIR: string;
	export const NUGET_PACKAGES: string;
	export const NPM_CONFIG_CACHE: string;
	export const LOGNAME: string;
	export const GIT_HTTPS_PROXY: string;
	export const npm_config_cache: string;
	export const GOCACHE: string;
	export const npm_lifecycle_script: string;
	export const VSCODE_IPC_HOOK: string;
	export const VSCODE_CODE_CACHE_PATH: string;
	export const NVM_BIN: string;
	export const VSCODE_PID: string;
	export const CARGO_TARGET_DIR: string;
	export const npm_config_user_agent: string;
	export const INFOPATH: string;
	export const HOMEBREW_CELLAR: string;
	export const POETRY_CACHE_DIR: string;
	export const COMPOSER_HOME: string;
	export const VSCODE_CWD: string;
	export const SECURITYSESSIONID: string;
	export const UV_CACHE_DIR: string;
	export const __CURSOR_SANDBOX_ENV_RESTORE: string;
	export const npm_node_execpath: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		NVM_INC: string;
		_ZO_DOCTOR: string;
		GOMODCACHE: string;
		PUPPETEER_CACHE_DIR: string;
		npm_config_legacy_peer_deps: string;
		VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
		NODE: string;
		NVM_CD_FLAGS: string;
		socks5_proxy: string;
		SOCKS5_PROXY: string;
		INIT_CWD: string;
		TERM: string;
		SHELL: string;
		VSCODE_PROCESS_TITLE: string;
		HOMEBREW_REPOSITORY: string;
		TMPDIR: string;
		npm_config_npm_globalconfig: string;
		PIP_CACHE_DIR: string;
		MallocNanoZone: string;
		CURSOR_TRACE_ID: string;
		NO_COLOR: string;
		npm_config_registry: string;
		ZSH: string;
		PNPM_HOME: string;
		NO_PROXY: string;
		NVM_DIR: string;
		http_proxy: string;
		USER: string;
		NX_CACHE_DIRECTORY: string;
		CYPRESS_CACHE_FOLDER: string;
		LS_COLORS: string;
		COMMAND_MODE: string;
		CCACHE_DIR: string;
		YARN_CACHE_FOLDER: string;
		npm_config_globalconfig: string;
		PNPM_SCRIPT_SRC_DIR: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		BUN_INSTALL_CACHE_DIR: string;
		npm_execpath: string;
		PAGER: string;
		HOMEBREW_CACHE: string;
		ELECTRON_RUN_AS_NODE: string;
		LSCOLORS: string;
		npm_config_frozen_lockfile: string;
		npm_config_verify_deps_before_run: string;
		all_proxy: string;
		ALL_PROXY: string;
		PATH: string;
		npm_config_devdir: string;
		CURSOR_SANDBOX: string;
		LaunchInstanceID: string;
		npm_package_json: string;
		__CFBundleIdentifier: string;
		PWD: string;
		CP_HOME_DIR: string;
		npm_command: string;
		socks_proxy: string;
		VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
		SOCKS_PROXY: string;
		P9K_SSH: string;
		VSCODE_ESM_ENTRYPOINT: string;
		npm_config__jsr_registry: string;
		npm_lifecycle_event: string;
		CURSOR_AGENT: string;
		CONDA_PKGS_DIRS: string;
		npm_package_name: string;
		NODE_PATH: string;
		GIT_HTTP_PROXY: string;
		XPC_FLAGS: string;
		PLAYWRIGHT_BROWSERS_PATH: string;
		CURSOR_EXTENSION_HOST_ROLE: string;
		FORCE_COLOR: string;
		RBENV_SHELL: string;
		https_proxy: string;
		HTTPS_PROXY: string;
		GEM_SPEC_CACHE: string;
		XPC_SERVICE_NAME: string;
		npm_package_version: string;
		pnpm_config_verify_deps_before_run: string;
		SHLVL: string;
		HOME: string;
		GRADLE_USER_HOME: string;
		VSCODE_NLS_CONFIG: string;
		HOMEBREW_PREFIX: string;
		CI: string;
		no_proxy: string;
		PNPM_STORE_PATH: string;
		HTTP_PROXY: string;
		BUNDLE_PATH: string;
		LESS: string;
		TURBO_CACHE_DIR: string;
		NUGET_PACKAGES: string;
		NPM_CONFIG_CACHE: string;
		LOGNAME: string;
		GIT_HTTPS_PROXY: string;
		npm_config_cache: string;
		GOCACHE: string;
		npm_lifecycle_script: string;
		VSCODE_IPC_HOOK: string;
		VSCODE_CODE_CACHE_PATH: string;
		NVM_BIN: string;
		VSCODE_PID: string;
		CARGO_TARGET_DIR: string;
		npm_config_user_agent: string;
		INFOPATH: string;
		HOMEBREW_CELLAR: string;
		POETRY_CACHE_DIR: string;
		COMPOSER_HOME: string;
		VSCODE_CWD: string;
		SECURITYSESSIONID: string;
		UV_CACHE_DIR: string;
		__CURSOR_SANDBOX_ENV_RESTORE: string;
		npm_node_execpath: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
