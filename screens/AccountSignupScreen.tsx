import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";

interface Props {
}

interface State {
}

class AccountSignupScreen extends Component<Props, State> {
    render() {
        return (
            <View style={styles.container}>
                <Text>Account Login!</Text>
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

export default AccountSignupScreen;