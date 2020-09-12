import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";

interface Props {
}

interface State {
}

class ServiceScreen extends Component<Props, State> {
    static path = "service";

    render() {
        return (
            <View style={styles.container}>
                <Text>Service!</Text>
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

export default ServiceScreen;