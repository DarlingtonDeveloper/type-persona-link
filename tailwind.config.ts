import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			// Brand-specific font family
			fontFamily: {
				'brand': ['Inter', 'sans-serif'],
				'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			// Brand-specific font sizes
			fontSize: {
				'brand-gif': ['30px', { lineHeight: '1.2' }],
				'brand-heading': ['50px', { lineHeight: '1.1' }],
				'brand-body': ['30px', { lineHeight: '1.4' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Legacy colors (keeping for backward compatibility)
				linkdark: '#1b1b1b',
				linklight: '#e7e6e3',
				// New brand-specific colors from client specifications
				'brand-black': '#1b1b1b',      // Black/grey from brand specs
				'brand-white': '#FEFEFA',      // White Egg shell from brand specs
				'brand-primary': '#1b1b1b',    // Primary brand color
				'brand-secondary': '#FEFEFA',  // Secondary brand color
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'blink': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' }
				},
				'typewriter': {
					to: {
						left: '100%'
					}
				},
				// New: Welcome GIF animations
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'progress-bar': {
					'0%': { width: '0%' },
					'100%': { width: '100%' }
				},
				// New: Completion animations
				'bounce-in': {
					'0%': {
						transform: 'scale(0.3)',
						opacity: '0'
					},
					'50%': {
						transform: 'scale(1.05)',
						opacity: '0.8'
					},
					'70%': {
						transform: 'scale(0.9)',
						opacity: '0.9'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'slide-in-right': {
					'0%': {
						transform: 'translateX(100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'blink': 'blink 0.7s infinite',
				'typewriter': 'typewriter 2s steps(40) forwards',
				// New animations
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'progress-bar': 'progress-bar 30s linear',
				'bounce-in': 'bounce-in 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.4s ease-out',
			},
			// New: Brand-specific spacing for consistent design
			spacing: {
				'brand-xs': '8px',
				'brand-sm': '16px',
				'brand-md': '24px',
				'brand-lg': '32px',
				'brand-xl': '48px',
			},
			// New: Enhanced shadows for glassmorphism effects
			boxShadow: {
				'brand-soft': '0 2px 20px rgba(27, 27, 27, 0.1)',
				'brand-medium': '0 4px 30px rgba(27, 27, 27, 0.15)',
				'brand-strong': '0 8px 40px rgba(27, 27, 27, 0.2)',
			},
			// New: Backdrop blur utilities
			backdropBlur: {
				'brand-xs': '2px',
				'brand-sm': '4px',
				'brand-md': '8px',
				'brand-lg': '16px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;