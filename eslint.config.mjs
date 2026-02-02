import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: ["**/dist/**", "**/assets/vendor/**"],
	},
	js.configs.recommended,
	...tseslint.configs.recommended.map((config) => ({
		...config,
		files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs"],
	})),
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jquery,
			},
			parser: tseslint.parser,
		},
		rules: {
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"prefer-const": "error",
			"no-undef": "off",
		},
	},
	eslintConfigPrettier,
];
