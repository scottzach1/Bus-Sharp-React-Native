import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";

interface Props {
}

interface State {
}

class SavedScreen extends Component<Props, State> {
    render() {
        return (
            <View style={styles.container}>
                <Text>Saved!</Text>
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

export default SavedScreen;