 $npm run dev

> -job-searchvue@0.1.0 dev
> vite

The CJS build of Vite's Node API is deprecated. See https://vite.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.
failed to load config from /home/rita/personal/portfolio-items/job-search/vite.config.js
error when starting dev server:
Error: Cannot find module '@vitejs/plugin-vue'
Require stack:
- /home/rita/personal/portfolio-items/job-search/vite.config.js
- /home/rita/personal/portfolio-items/job-search/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:939:15)
    at Module._load (node:internal/modules/cjs/loader:780:27)
    at Module.require (node:internal/modules/cjs/loader:1005:19)
    at require (node:internal/modules/cjs/helpers:102:18)
    at Object.<anonymous> (/home/rita/personal/portfolio-items/job-search/vite.config.js:36:33)
    at Module._compile (node:internal/modules/cjs/loader:1105:14)
    at _require.extensions.<computed> [as .js] (file:///home/rita/personal/portfolio-items/job-search/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66987:16)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Module._load (node:internal/modules/cjs/loader:827:12)
    at Module.require (node:internal/modules/cjs/loader:1005:19)

    That error means your project is missing the Vue plugin for Vite — it’s required to process .vue files.
Here’s how to fix it 👇

🧩 Step 1: Install the missing dependency
Run this in your project directory:
npm install @vitejs/plugin-vue


🧰 Step 2: Make sure Vue is installed
If you haven’t yet, install Vue 3 as well:
npm install vue

(Optional but recommended for full Vue 3 setup)
npm install @vue/compiler-sfc


⚙️ Step 3: Check your vite.config.js
Make sure it looks like this:
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000', // adjust if your backend uses another port
    },
  },
})


🧼 Step 4: Try again
Once everything’s installed:
npm run dev


If you still see warnings like

“The CJS build of Vite's Node API is deprecated”
you can safely ignore it — it’s just a deprecation notice for CommonJS users. It won’t stop your app from running.


Would you like me to check your vite.config.js content to be sure it’s set up correctly? You can paste it here.