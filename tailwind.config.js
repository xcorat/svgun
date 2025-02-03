/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			container: {
				center: true,
				padding: '2rem'
			},
			fontFamily: {
				'irish-grover': ['"Irish Grover"', 'system-ui', 'sans-serif']
			}
		}
	},

	plugins: [require('daisyui')],
	daisyui: {
		themes: ['lemonade', 'coffee'],
		darkTheme: 'coffee',
		base: true,
		styled: true,
		utils: true,
		prefix: '',
		logs: false,
		themeRoot: ':root'
	}
};
