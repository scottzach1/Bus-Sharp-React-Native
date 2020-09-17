import React, {Component} from "react";
import {Route, ScrollView} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {fetchStopData} from "../external/StorageManager";
import StopInfo from "../components/stop/StopInfo";
import StopTimetable from "../components/stop/StopTimetable";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
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
            <ScrollView>
                <StopInfo
                    stopData={this.state.stopData}
                    code={this.getCode()}
                    errorMessage={this.state.errorMessage}
                    navigation={this.props.navigation}
                />
                <StopTimetable
                    stopData={this.state.stopData}
                    errorMessage={this.state.errorMessage}
                    navigation={this.props.navigation}
                    route={this.props.route}
                />
            </ScrollView>
        );
    }
}

export default StopScreen;