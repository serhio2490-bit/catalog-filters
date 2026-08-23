import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base — папка проекта на GitHub Pages. Локально './' тоже работает,
// поэтому сборку можно просто открыть двойным щелчком.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
