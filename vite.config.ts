import { defineConfig } from "vite";
import mdPlugin, { Mode } from "vite-plugin-markdown";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/chat-history/",
  plugins: [mdPlugin({ mode: [Mode.HTML] }), tsconfigPaths(), react()],
  server: {
    port: 3000,
  },
});
