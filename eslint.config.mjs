import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	{
		ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react/no-unescaped-entities': 'off',
			'react/prop-types': 'off',
			'comma-dangle': 0,
			quotes: [
				1,
				'single',
				{
					avoidEscape: true,
				},
			],
			'no-undef': 'off',
			'global-strict': 0,
			'no-extra-semi': 1,
			'no-underscore-dangle': 0,
			'no-console': 1,
			'no-debugger': 'warn',
			'no-trailing-spaces': [
				1,
				{
					skipBlankLines: true,
				},
			],
			'no-unreachable': 1,
			'no-alert': 0,
			'@typescript-eslint/no-non-null-assertion': 0,
			'@typescript-eslint/no-unused-vars': 'warn',
			'no-unused-vars': 'off',
			'no-warning-comments': [1, { terms: ['debug'], location: 'anywhere' }],
		},
	},
];

export default eslintConfig;
