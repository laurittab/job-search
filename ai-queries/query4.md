 npm run dev

> -job-searchvue@0.1.0 dev
> vite

✘ [ERROR] "@vitejs/plugin-vue" resolved to an ESM file. ESM file cannot be loaded by `require`. See https://vite.dev/guide/troubleshooting.html#this-package-is-esm-only for more details. [plugin externalize-deps]

    node_modules/esbuild/lib/main.js:1225:27:
      1225 │         let result = await callback({
           ╵                            ^

    at file:///home/rita/personal/portfolio-items/job-search/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66928:23
    at requestCallbacks.on-resolve (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:1225:28)
    at handleRequest (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:647:17)
    at handleIncomingPacket (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:672:7)
    at Socket.readFromStdout (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:600:7)
    at Socket.emit (node:events:527:28)
    at addChunk (node:internal/streams/readable:324:12)
    at readableAddChunk (node:internal/streams/readable:297:9)
    at Readable.push (node:internal/streams/readable:234:10)
    at Pipe.onStreamRead (node:internal/stream_base_commons:190:23)

  This error came from the "onResolve" callback registered here:

    node_modules/esbuild/lib/main.js:1150:20:
      1150 │       let promise = setup({
           ╵                     ^

    at setup (file:///home/rita/personal/portfolio-items/job-search/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66890:18)
    at handlePlugins (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:1150:21)
    at buildOrContextImpl (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:873:5)
    at Object.buildOrContext (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:699:5)
    at /home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:2023:15
    at new Promise (<anonymous>)
    at Object.build (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:2022:25)
    at build (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:1873:51)
    at bundleConfigFile (file:///home/rita/personal/portfolio-items/job-search/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66845:24)

  The plugin "externalize-deps" was triggered by this import

    vite.config.js:2:16:
      2 │ import vue from '@vitejs/plugin-vue'
        ╵                 ~~~~~~~~~~~~~~~~~~~~

failed to load config from /home/rita/personal/portfolio-items/job-search/vite.config.js
error when starting dev server:
Error: Build failed with 1 error:
node_modules/esbuild/lib/main.js:1225:27: ERROR: [plugin: externalize-deps] "@vitejs/plugin-vue" resolved to an ESM file. ESM file cannot be loaded by `require`. See https://vite.dev/guide/troubleshooting.html#this-package-is-esm-only for more details.
    at failureErrorWithLog (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:1472:15)
    at /home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:945:25
    at runOnEndCallbacks (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:1315:45)
    at buildResponseToResult (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:943:7)
    at /home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:970:16
    at responseCallbacks.<computed> (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:622:9)
    at handleIncomingPacket (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:677:12)
    at Socket.readFromStdout (/home/rita/personal/portfolio-items/job-search/node_modules/esbuild/lib/main.js:600:7)
    at Socket.emit (node:events:527:28)
    at addChunk (node:internal/streams/readable:324:12)
rita@Rita-Lappy-13:~/personal/portfolio-items/job-search$ 



Good — this is a common Vite + Node configuration mismatch.
Your error means your project is using CommonJS (require) somewhere (or your Node version treats your config that way), but Vite and its plugins are ESM-only (they must use import/export syntax).

Let’s fix it cleanly 👇

✅ Step-by-step fix
1. Rename your config file to .mjs

Rename your Vite config file so Node treats it as an ESM module:

mv vite.config.js vite.config.mjs

2. Make sure it uses ESM syntax

Open vite.config.mjs and confirm it looks like this:

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})

3. Ensure your Node version supports ESM

Run:

node -v


Make sure it’s v18+ (preferably Node 20+).
If it’s older, update it (Vite 5 and plugins require Node 18+).

4. Update your package.json (optional alternative)

If you prefer to keep vite.config.js,
you can instead tell Node your entire project uses ESM by adding this line to your package.json:

"type": "module",


Then you can keep the filename as vite.config.js and still use import/export.

5. Clean up old caches (optional)

Sometimes dependencies conflict after Vite upgrades:

rm -rf node_modules package-lock.json
npm install

6. Run it again
npm run dev


💡 TL;DR
The safest and simplest fix is:

mv vite.config.js vite.config.mjs


and ensure you’re using Node 18 or later.

If it still fails after this, please paste the first 10 lines of your vite.config.js (or .mjs) — I can verify whether there’s a lingering CJS reference.