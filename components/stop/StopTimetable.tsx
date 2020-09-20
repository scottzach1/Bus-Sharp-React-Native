import React, {Component} from "react";
import {Card} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";
import {ActivityIndicator, Route, View} from "react-native";
import ServiceListContainer, {ServiceListProp} from "../lists/ServiceListContainer";
import ToggleListItem from "../lists/ToggleListItem";

interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
    stopData: any | null | undefined,
    stopCode: string,
    errorMessage: string | null,
}

interface State {
    showHours: boolean,
}

/**
 * This component represents the upcoming services timetable for a given stop.
 *
 * Within this component, we render a card full of `MetlinkListItem`'s containing not only the service information, the
 * 'live' badge if relevant to the service, a toggleable list item to switch between hours and arrival time as well as
 * the schedule button
 */
class StopTimetable extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            showHours: true,
        }
    }

    /**
     * Generates the props to pass the `ServiceListContainer`, including additional information such as the arrival time
     * and the live status.
     */
    generateListContainerProps() {
        if (!this.props.stopData?.Services) return [];

        let containerProps: ServiceListProp[] = this.props.stopData.Services.map((service: any) => {
            // Parse the time information from the response json.
            const name: string = service.Service.Name.split("-")[0];
            const code: string = service.ServiceID;
            const isLive: boolean = service.IsRealtime;
            const timeRemaining: string = service.AimedArrival;

            return new ServiceListProp(name, code, isLive, timeRemaining);
        });

        containerProps.sort(function (a, b) {
            return (a.arrival && b.arrival) ? a.arrival.localeCompare(b.arrival) : -1;
        });

        return containerProps;
    }

    /**
     * Switches the show hours within local state forcing re-render.
     */
    toggleMinutesHours() {
        this.setState({showHours: !(this.state.showHours)});
    }

    /**
     * Renders a card containing a stylised service list container and a toggle switch.
     */
    render() {
        return (
            <View style={{height: '100%'}}>
                <Card>
                    <Card.Title>Upcoming Services</Card.Title>
                    <Card.Divider/>
                    <ToggleListItem
                        title={'Toggle Minutes / Time'}
                        toggled={this.state.showHours}
                        onPress={() => this.toggleMinutesHours()}
                    />
                    {this.props.stopData ?
                        <ServiceListContainer
                            services={this.generateListContainerProps()}
                            showHours={this.state.showHours}
                            navigation={this.props.navigation}
                            route={this.props.route}
                            originStopCode={this.props.stopCode}
                        /> :
                        <ActivityIndicator/>}
                </Card>
            </View>
        );
    }
}

export default StopTimetable;
