import React, {Component} from "react";
import {Route, StyleSheet, Text, View} from "react-native";
import {fetchStopData} from "../external/StorageManager";

interface Props {
    route: Route,
}

interface State {
    stopData: any | null,
    errorMessage: string | null,
}

class StopScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            stopData: undefined,
            errorMessage: null,
        }
    }

    getCode() {
        return this.props.route.params.code;
    }

    componentDidMount() {
        if (!this.state.stopData || this.state.errorMessage)
            fetchStopData(this.getCode()).then((resp) => {
                this.setState({
                    stopData: resp.data,
                    errorMessage: resp.errorMessage,
                });
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Stop {this.getCode()}!</Text>
                <Text>{this.state.errorMessage}</Text>
                <Text>{this.state.stopData? 'data loaded' : undefined}</Text>
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