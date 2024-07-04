import { CssVarsProvider, ThemeProvider, extendTheme } from "@mui/joy";
import { ReactNode } from "preact/compat";

interface DefaultThemeProviderProps {
    children: ReactNode;
}

export function DefaultThemeProvider(props: DefaultThemeProviderProps) {
    const theme = extendTheme({
        fontFamily: {
            display: `"Roboto", sans-serif`,
            body: `"Roboto", sans-serif`
        }
    });

    return (
        <CssVarsProvider
            theme={theme}
            defaultMode={"dark"}
        >
            {props.children}
        </CssVarsProvider>
    );
}