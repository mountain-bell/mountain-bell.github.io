import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jquery,
			},
		},
		rules: {
			"no-unused-vars": "warn",
			"no-console": "warn",
			"prefer-const": "error",
			"no-undef": "error",
		},
	},
	eslintConfigPrettier,
];
