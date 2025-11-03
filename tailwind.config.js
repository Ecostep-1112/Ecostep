/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',        // iOS/macOS: San Francisco
          'BlinkMacSystemFont',   // macOS fallback
          'Roboto',               // Android 및 기타 플랫폼
          'sans-serif',           // 최종 fallback
        ],
      },
    },
  },
  plugins: [],
}