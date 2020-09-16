import React, {FC} from "react";
import {Platform} from "react-native";
import useColorScheme from "../hooks/useColorScheme";
import useColorSchemeWeb from "../hooks/useColorScheme.web";
import {ThemeProvider} from "react-native-elements";

const CustomThemeProvider: FC = (props) => {

    let colorScheme = (Platform.OS !== 'web') ? useColorScheme() : useColorSchemeWeb();

    const theme = {
        colors: {
            platform: {
                "default": {
                    "grey": "#FFF"
                }
            }
        }
    }

    return (
        <ThemeProvider useDark={colorScheme === 'dark'} theme={theme}>
            <>{props.children}</>
        </ThemeProvider>
    );
}

export default CustomThemeProvider;