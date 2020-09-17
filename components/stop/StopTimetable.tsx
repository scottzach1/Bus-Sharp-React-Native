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
    errorMessage: string | null,
}

interface State {
    showHours: boolean,
}

class StopTimetable extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            showHours: true,
        }
    }

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

    toggleMinutesHours() {
        this.setState({showHours: !(this.state.showHours)});
    }

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
                        /> :
                        <ActivityIndicator/>}
                </Card>
            </View>
        );
    }
}

export default StopTimetable;