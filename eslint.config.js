import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
    {
        ignores: [
            "**/dist/**",
            "**/node_modules/**",
            "**/coverage/**",
            "**/playwright-report/**",
            "**/test-results/**",
        ],
    },
    {
        files: ["**/*.{ts,tsx}"],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        rules: {
            curly: ["error", "all"],
        },
    },
    {
        files: ["apps/**/src/**/*.{ts,tsx}", "packages/**/src/**/*.{ts,tsx}"],
        plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["error", { allowConstantExport: true }],
        },
    },
    {
        files: ["packages/shared-domain/src/**/*.ts"],
        ignores: ["**/*.test.ts"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        "react",
                        "react-dom",
                        "node:*",
                        "@wekamb/app-core*",
                        "@wekamb/bridge-contract",
                        "@wekamb/shared-ui*",
                    ],
                },
            ],
        },
    },
    {
        files: ["packages/shared-ui/src/**/*.{ts,tsx}"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        "@wekamb/app-core*",
                        "@wekamb/shared-domain",
                        "@wekamb/bridge-contract",
                        "**/apps/**",
                    ],
                },
            ],
        },
    },
    {
        files: ["packages/app-core/src/**/*.{ts,tsx}"],
        rules: {
            "no-restricted-imports": ["error", { patterns: ["@wekamb/web*", "**/apps/**"] }],
            "no-restricted-globals": ["error", "localStorage", "sessionStorage"],
        },
    },
);
