import 'styled-components'

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            primary: string
            primaryStrong: string
            primaryHeavy: string

            secondary: string

            text: {
                primary: string
                secondary: string
                disabled: string
                white: string
            }
            background: {
                primary: string
                secondary: string
                tertiary: string
            }
            border: {
                primary: string
            }
            status: {
                success: string
                warning: string
                error: string
                info: string
            }
            neutral: {
                white: string
                black: string
                gray100: string
                gray200: string
                gray300: string
                gray400: string
                gray500: string
                gray600: string
                gray700: string
                gray800: string
                gray900: string
            }
        }
        typography: {
            fontSize: {
                h1: string
                h2: string
                h3: string
                h4: string
                h5: string
                body1: string
                body2: string
                caption: string
            }
            fontWeight: {
                regular: number
                medium: number
                bold: number
            }
            lineHeight: {
                h1: string
                h2: string
                h3: string
                h4: string
                h5: string
                body1: string
                body2: string
                caption: string
            }
        }
        spacing: (unit: number) => string
    }
}
