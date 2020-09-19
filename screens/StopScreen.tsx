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
    stopCode: string,
    errorMessage: string | null,
}

class StopScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            stopData: undefined,
            stopCode: this.props.route.params.code,
            errorMessage: null,
        }
    }

    componentDidMount() {
        if (!this.state.stopData || this.state.errorMessage)
            fetchStopData(this.state.stopCode).then((resp) => {
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
                    code={this.state.stopCode}
                    navigation={this.props.navigation}
                    route={this.props.route}
                />
                <StopTimetable
                    stopData={this.state.stopData}
                    stopCode={this.state.stopCode}
                    errorMessage={this.state.errorMessage}
                    navigation={this.props.navigation}
                    route={this.props.route}
                />
            </ScrollView>
        );
    }
}

export default StopScreen;
