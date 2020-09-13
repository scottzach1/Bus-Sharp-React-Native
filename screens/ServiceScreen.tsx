import React, {Component} from "react";
import {Route, StyleSheet, Text, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {fetchServiceData} from "../external/StorageManager";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    serviceData: any | null,
    errorMessage: string | null,
}

class ServiceScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            serviceData: undefined,
            errorMessage: null,
        }
    }

    getCode() {
        return this.props.route.params.code;
    }


    componentDidMount() {
        if (!this.state.serviceData || this.state.errorMessage)
            fetchServiceData(this.getCode()).then((resp) => {
                this.setState({
                    serviceData: resp.data,
                    errorMessage: resp.errorMessage,
                });
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Service {this.getCode()}!</Text>
                <Text>{this.state.errorMessage}</Text>
                <Text>{this.state.serviceData? 'data loaded' : undefined}</Text>
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