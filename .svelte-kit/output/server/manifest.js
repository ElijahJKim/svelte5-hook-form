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
		client: {start:"_app/immutable/entry/start.HWdveFnO.js",app:"_app/immutable/entry/app.CP5gdOaF.js",imports:["_app/immutable/entry/start.HWdveFnO.js","_app/immutable/chunks/DB9k1acu.js","_app/immutable/chunks/FFEW_qIB.js","_app/immutable/chunks/BObLoIZJ.js","_app/immutable/entry/app.CP5gdOaF.js","_app/immutable/chunks/FFEW_qIB.js","_app/immutable/chunks/DDIVTVOi.js","_app/immutable/chunks/DybjUDna.js","_app/immutable/chunks/BObLoIZJ.js","_app/immutable/chunks/CiKOc9RD.js","_app/immutable/chunks/D0_MsRDN.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
