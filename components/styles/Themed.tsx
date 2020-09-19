import * as React from 'react';
import {Text as DefaultText, TextInput as DefaultTextInput, View as DefaultView} from 'react-native';
import {
    ButtonGroup as DefaultButtonGroup,
    ButtonGroupProps,
    SearchBar as DefaultSearchBar,
    SearchBarProps
} from "react-native-elements";

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
    const theme = useColorScheme();
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type TextInputProps = ThemeProps & DefaultTextInput['props'];

export function Text(props: TextProps) {
    const {style, lightColor, darkColor, ...otherProps} = props;
    const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');

    return <DefaultText style={[{color}, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
    const {style, lightColor, darkColor, ...otherProps} = props;
    const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');

    return (
        <DefaultTextInput
            underlineColorAndroid={color}
            style={{color: color}}
            {...otherProps}
        />
    );
}

export function View(props: ViewProps) {
    const {style, lightColor, darkColor, ...otherProps} = props;
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'background');

    return <DefaultView style={[{backgroundColor}, style]} {...otherProps} />;
}

export function SearchBar(props: SearchBarProps | any) {
    const {style, lightColor, darkColor, ...otherProps} = props;
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'background');
    const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');

    return (
        <DefaultSearchBar
            containerStyle={{backgroundColor: backgroundColor}}
            inputStyle={{color: color}} // Apparently redundant.
            inputContainerStyle={{color: color}} // Apparently redundant.
            {...otherProps}/>
    );
}

export function ButtonGroup(props: ButtonGroupProps | any) {
    const {style, lightColor, darkColor, ...otherProps} = props;
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'background');
    const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');

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
