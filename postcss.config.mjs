// const config = {
//   plugins: ["@tailwindcss/postcss"],
// };

// export default config;

// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/widgets/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/entities/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 프로젝트에 필요한 테마 확장 설정
    },
  },
  plugins: ["@tailwindcss/postcss"]
};

