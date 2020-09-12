import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";

interface Props {
}

interface State {
}

class MapScreen extends Component<Props, State> {

    static navigationOptions = {
        title: "Map"
    }

    static path = "feed";

    render() {
        return (
            <View style={styles.container}>
                <Text>Map!</Text>
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

export default MapScreen;