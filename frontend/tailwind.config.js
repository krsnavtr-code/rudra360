/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary-color)',
                'primary-hover': 'var(--primary-hover)',
                body: 'var(--bg-body)',
                card: 'var(--bg-card)',
                main: 'var(--text-main)',
                muted: 'var(--text-muted)',
                border: 'var(--border-color)',
            }
        },
    },
    plugins: [],
};

export default config;