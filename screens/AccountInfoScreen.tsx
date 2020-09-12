import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";

interface Props {
}

interface State {
}

class AccountInfoScreen extends Component<Props, State> {
    render() {
        return (
            <View style={styles.container}>
                <Text>Account Info!</Text>
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

export default AccountInfoScreen;