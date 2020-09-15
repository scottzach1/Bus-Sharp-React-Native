import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";

interface Props {
    navigation: StackNavigationProp<any>,
}

interface State {
}

class SettingsScreen extends Component<Props, State> {
    render() {
        return (
            <View style={styles.container}>
                <Text>Settings!</Text>
                <Text onPress={() => this.props.navigation.navigate('SettingsTwitterScreen')}>Twitter Link</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default SettingsScreen;