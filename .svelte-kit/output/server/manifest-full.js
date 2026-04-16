export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.De3QDlTk.js",app:"_app/immutable/entry/app.CRbaQiZk.js",imports:["_app/immutable/entry/start.De3QDlTk.js","_app/immutable/chunks/D0AHZQ5W.js","_app/immutable/chunks/DlkHK8tS.js","_app/immutable/chunks/CwMaCe3_.js","_app/immutable/entry/app.CRbaQiZk.js","_app/immutable/chunks/DlkHK8tS.js","_app/immutable/chunks/Ctkmxivi.js","_app/immutable/chunks/qTjWkZjA.js","_app/immutable/chunks/CwMaCe3_.js","_app/immutable/chunks/BUBQzQl3.js","_app/immutable/chunks/_Gqn3gR2.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
