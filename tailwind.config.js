const colors = require('tailwindcss/colors');
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",],
  theme: {
    colors: {
			transparent: 'transparent',
			current: 'currentColor',
			blue: {
				...colors.blue,
				DEFAULT: '#010047',
				faded: '#25385b',
				light: '#056c69',
				dark: '#040824',
				hovered: '#1E3A8A'
			},
			green: {
				...colors.green,
				DEFAULT: '#4BB543'
			},
			teal: {
				...colors.teal,
				DEFAULT: '#14b8a6'
			},
			red: {
				...colors.red,
				DEFAULT: '#EF4444'
			},
			yellow: {
				...colors.yellow,
				DEFAULT: '#f9c600',
				dark: '#d8ab00',
				darker: '#bf9500'
			},
			amber: {
				...colors.amber,
				DEFAULT: '#fbb829',
				dark: '#d97706'
			},
			cyan: {
				...colors.cyan,
				DEFAULT: '#06b6d4',
				dark: '#164e63'
			},
			rose: {
				...colors.rose
			},
			white: colors.white,
			gray: colors.gray,
			black: colors.black,
			'primary': '#393E46',
			'secondary': '#6D9886',
			'main': '#F2E7D5',
			'bg': '#F7F7F7' 
		},
    screens: {
			xs: '480px',
			// => @media (min-width: 480) { ... }

			sm: '640px',
			// => @media (min-width: 640px) { ... }

			md: '768px',
			// => @media (min-width: 768px) { ... }

			lg: '1024px',
			// => @media (min-width: 1024px) { ... }

			xl: '1280px',
			// => @media (min-width: 1280px) { ... }

			'2xl': '1536px'
			// => @media (min-width: 1536px) { ... }
		},
		listStyleType: {
			square: 'square',
			disc: 'disc',
			decimal: 'decimal'
		},
    extend: {},
  },
  plugins: [],
}
