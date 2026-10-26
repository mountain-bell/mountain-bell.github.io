import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: ["**/vendor/**"],
	},
	js.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jquery,
			},
		},
		rules: {
			"no-unused-vars": [
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
