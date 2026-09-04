import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { projectStructurePlugin } from "eslint-plugin-project-structure";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "project-structure": projectStructurePlugin,
    },
    settings: {
      "project-structure/independent-modules-config-path":
        "independentModules.jsonc",
    },
    rules: {
      "project-structure/independent-modules": "error",
    },
  },
];

export default eslintConfig;
