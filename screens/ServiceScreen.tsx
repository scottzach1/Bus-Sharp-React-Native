import React, {Component} from "react";
import {Route, StyleSheet, Text, View} from "react-native";

interface Props {
    route: Route,
}

interface State {
    code: string,
}

class ServiceScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            code: this.props.route.params.serviceCode
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Service {this.state.code}!</Text>
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