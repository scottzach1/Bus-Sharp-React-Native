import * as React from 'react';
import {Text as DefaultText, TextInput as DefaultTextInput, View as DefaultView} from 'react-native';
import {
    ButtonGroup as DefaultButtonGroup,
    ButtonGroupProps,
    SearchBar as DefaultSearchBar,
    SearchBarProps,
} from "react-native-elements";

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

/**
 * Finds the appropriate color from the `Colors` constant file based off the users prefers color settings.
 *
 * @param props - that may contain color preferences.
 * @param colorName - target name of the color to find (check `Colors.ts`).
 */
export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark) {
    // Use color scheme and check for theme within props.
    const theme = useColorScheme();
    const colorFromProps = props[theme];


    if (colorFromProps) {
        // Color preference already set.
        return colorFromProps;
    } else {
        // No color preference set, search `Colors.tx`.
        return Colors[theme][colorName];
    }
}

/**
 * Partial that defines the theme specific properties of a component.
 */
type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

// Merge into encompassing type.
export type TextProps = ThemeProps & DefaultText['props'];

/**
 * Create a styled text by injecting new styles into the returned component.
 *
 * @param props - to pass to the Text component.
 */
export function Text(props: TextProps) {
    // Extract properties, and set color based off preferences.
    const {style, lightColor, darkColor, ...otherProps} = props;
    const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');
    // Return styled Text component.
    return <DefaultText style={[{color}, style]} {...otherProps} />;
}

// Merge into encompassing type.
export type TextInputProps = ThemeProps & DefaultTextInput['props'];

/**
 * Create a styled TextInput by injecting new styles into the returned component.
 *
 * @param props - to pass to the TextInput component.
 */
export function TextInput(props: TextInputProps) {
    // Extract properties, and set color based off preferences.
    const {style, lightColor, darkColor, ...otherProps} = props;
    const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');
    // Return styled TextInput component.
    return (
        <DefaultTextInput
            underlineColorAndroid={color}
            style={{color: color}}
            {...otherProps}
        />
    );
}

// Merge into encompassing type.
export type ViewProps = ThemeProps & DefaultView['props'];

/**
 * Create a styled View by injecting new styles into the returned component.
 *
 * @param props - pass to the View component.
 */
export function View(props: ViewProps) {
    const {style, lightColor, darkColor, ...otherProps} = props;
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'background');

    return <DefaultView style={[{backgroundColor}, style]} {...otherProps} />;
}

/**
 * Create a styled SearchBar by injecting new styles into the returned component.
 * @param props - pass to the View component.
 */
export function SearchBar(props: SearchBarProps | any) {
    // Extract properties, and set color based off preferences.
    const {style, lightColor, darkColor, ...otherProps} = props;
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'background');
    const searchBg = useThemeColor({light: lightColor, dark: darkColor}, 'searchBg');
    const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');
    // Return styled SearchBar.
    return (
        <DefaultSearchBar
            containerStyle={{backgroundColor: backgroundColor}}
            inputStyle={{color: color}} // Apparently redundant.
            inputContainerStyle={{
                color: color,
                backgroundColor: searchBg,
            }} // Apparently redundant.
            {...otherProps}/>
    );
}

/**
 * Create a styled ButtonGroup by injecting new styles into the returned component.
 * @param props - pass to the View component.
 */
export function ButtonGroup(props: ButtonGroupProps | any) {
    // Extract properties, and set color based off preferences.
    const {style, lightColor, darkColor, ...otherProps} = props;
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'background');
    const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');
    // Return styled ButtonGroup.
    return (
        <DefaultButtonGroup
            textStyle={{
                color: color,
            }}
            buttonContainerStyle={{
                backgroundColor: backgroundColor,
            }}
            {...otherProps}
        />
    );
}
