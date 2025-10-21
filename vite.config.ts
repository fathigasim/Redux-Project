import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    // root: "./",
    // build: {
    //     outDir: "../wwwroot",   // ✅ build output directly into .NET wwwroot
    //     emptyOutDir: true,      // clears old files
    // },
    // server: {
    //     port: 3000,
    //     proxy: {
    //         "/api": "http://localhost:7171", // proxy API calls to backend during dev
    //     },
    // },
})
