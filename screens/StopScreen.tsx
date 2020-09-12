import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";

interface Props {
}

interface State {
}

class StopScreen extends Component<Props, State> {
    render() {
        return (
            <View style={styles.container}>
                <Text>Stop!</Text>
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

export default StopScreen;