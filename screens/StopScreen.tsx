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

/**
 * This screen is responsible for letting the user view information about a given Metlink bus stop. This screen consists
 * of two different parts, first of which is the info card which will provide the user information about the given stop,
 * as well as perform actions on the given stop. The second part is a card which contains the full upcoming service
 * timetable. Each of these entries will have options to favourite, schedule as well as be clickable to pivot to the
 * services screen.
 */
class StopScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            stopData: undefined,
            stopCode: this.props.route.params.code,
            errorMessage: null,
        }
    }

    /**
     * Load the stop data if it hasn't been loaded, or there previously was an error.
     * (Error might occur where there is limited connectivity, StorageManager will provide cached information however
     * preferably we want to be using latest fetched data).
     */
    componentDidMount() {
        if (!this.state.stopData || this.state.errorMessage)
            fetchStopData(this.state.stopCode).then((resp) => {
                this.setState({
                    stopData: resp.data,
                    errorMessage: resp.errorMessage,
                });
            });
    }

    /**
     * Render the Stop screen.
     */
    render() {
        return (
            <ScrollView>
                <StopInfo
                    stopInfo={this.state.stopData}
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
