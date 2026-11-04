import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    root: fileURLToPath(new URL(".", import.meta.url)),
    css: {
        postcss: fileURLToPath(new URL("../../tooling/config", import.meta.url)),
    },
    build: {
        outDir: fileURLToPath(new URL("../../dist", import.meta.url)),
        emptyOutDir: true,
    },
});
