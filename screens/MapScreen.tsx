import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import GoogleMapWidget from "../components/google-maps/GoogleMapWidget";

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
                <GoogleMapWidget
                    routePaths={[]}
                    stopMarkers={[]}
                />
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