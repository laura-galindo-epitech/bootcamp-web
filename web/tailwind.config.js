import type { Config } from 'tailwindcss'

export default {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            borderRadius: {
                '2xl': '1rem',
            },
            container: {
                center: true,
                padding: '1rem',
            },
        }
    },
    plugins: [],
} satisfies Config          