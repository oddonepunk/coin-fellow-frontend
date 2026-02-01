import { plugin } from "postcss";

export default {
    darkMode: 'class',
    content: [
        "./resources/**/*.{vue,js,ts,jsx,tsx}",
        "./resources/views/**/*.blade.php",
    ],
    theme: {
        extend: {
            colors: {
                'winter': {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                'frost': {
                    50:  '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
                'aurora': {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                },
                'snow': '#ffffff',
                'ice': '#e0f7fa',
                'polar': '#bbdefb',
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'display': ['Poppins', 'Inter', 'system-ui'],
            },
            backgroundImage: {
                'winter-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'snow-gradient': 'linear-gradient(to bottom, #f8fafc, #e2e8f0)',
                'aurora-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #ffd166 100%)',
                'frost-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'snowfall': 'snowfall 10s linear infinite',
                'aurora': 'aurora 8s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                },
            keyframes: {
                float: {
                    '0%, 100%': {transform: 'translateY(0)'},
                    '50%': {transform: 'translateY(-10px)'},
                },
                snowfall: {
                    '0%': {transform: 'translateY(-10px) translateX(0)'},
                    '100%': {transform: 'translateY(100vh) translateX(20px)'},
                },
                aurora: {
                    '0%, 100%': {opacity: '0.3'},
                    '50%': {opacity: '0.7'},
                },
            },
         
        },
    },
    plugins: [],
}