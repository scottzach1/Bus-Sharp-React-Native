import {View} from "../components/styles/Themed";
import React, {Component} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import {Route, StyleSheet} from "react-native";
import GoogleMapWidget from "../components/google-maps/GoogleMapWidget";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
}


class MapScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <View style={styles.container}>
                <GoogleMapWidget
                    navigation={this.props.navigation}
                    route={this.props.route}
                    routePaths={[]}
                    stopMarkers={[]}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});


export default MapScreen;
