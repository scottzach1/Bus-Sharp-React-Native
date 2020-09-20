import React, {FC} from "react";
import {Platform} from "react-native";
import useColorScheme from "../hooks/useColorScheme";
import useColorSchemeWeb from "../hooks/useColorScheme.web";
import {ThemeProvider} from "react-native-elements";

/**
 * This component is responsible for exposing the ColorScheme to the rest of the application.
 *
 * @param props - None used.
 */
const CustomThemeProvider: FC = (props) => {
    // Obtain color scheme.
    let colorScheme = (Platform.OS !== 'web') ? useColorScheme() : useColorSchemeWeb();

    // Inject the gry color: (Known bug with library when rendering cards).
    const theme = {
        colors: {
            platform: {
                "default": {
                    "grey": "#FFF"
                }
            }
        }
    }

    // Provider to expose the color scheme to the rest of the application.
    return (
        <ThemeProvider useDark={colorScheme === 'dark'} theme={theme}>
            <>{props.children}</>
        </ThemeProvider>
    );
}

export default CustomThemeProvider;
