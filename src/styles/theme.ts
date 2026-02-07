import { DefaultTheme } from 'styled-components'

export const theme: DefaultTheme = {
    colors: {
        primary: '#3366FF', // Wanted Blue
        primaryStrong: '#254EDB',
        primaryHeavy: '#1939B7',

        secondary: '#00C896', // Example secondary, widely used in Wanted for job pass etc

        text: {
            primary: '#171719', // Nearly black
            secondary: '#8a8a8e', // Gray for subtext
            disabled: '#C4C4C4',
            white: '#FFFFFF',
        },
        background: {
            primary: '#FFFFFF',
            secondary: '#F4F6FA', // Light gray bg for sections
            tertiary: '#F8F8F9',
        },
        border: {
            primary: '#E1E2E4',
        },
        status: {
            success: '#00C896',
            warning: '#FFB900',
            error: '#FF4D4D',
            info: '#3366FF',
        },
        neutral: {
            white: '#FFFFFF',
            black: '#000000',
            gray100: '#F8F9FA',
            gray200: '#F1F3F5',
            gray300: '#E9ECEF',
            gray400: '#DEE2E6',
            gray500: '#CED4DA',
            gray600: '#ADB5BD',
            gray700: '#868E96',
            gray800: '#495057',
            gray900: '#212529',
        },
    },
    typography: {
        fontSize: {
            h1: '32px',
            h2: '28px',
            h3: '24px',
            h4: '20px',
            h5: '18px',
            body1: '16px',
            body2: '14px',
            caption: '12px',
        },
        fontWeight: {
            regular: 400,
            medium: 500,
            bold: 700,
        },
        lineHeight: {
            h1: '1.4',
            h2: '1.4',
            h3: '1.4',
            h4: '1.4',
            h5: '1.4',
            body1: '1.6',
            body2: '1.6',
            caption: '1.5',
        },
    },
    spacing: (unit: number) => `${unit * 4}px`,
}
