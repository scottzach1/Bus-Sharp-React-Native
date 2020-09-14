import React, {Component} from "react";
import {Card, ThemeProvider} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";
import {View} from "../Themed";
import {ActivityIndicator} from "react-native";
import MetlinkListItem from "../common/MetlinkListItem";

const theme = {
    colors: {
        platform: {
            "default": {
                "grey": "#FFF"
            }
        }
    }
};

interface Props {
    navigation: StackNavigationProp<any>,
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

    getHoursRemaining(arrivalTime: string) {
        const arrivalDate: Date = new Date(arrivalTime);
        const currentDate: Date = new Date();

        let timeRemaining: number | string = Math.round((arrivalDate.getTime() - currentDate.getTime()) / 60000);
        return (timeRemaining < 0) ? 'due' : timeRemaining + ' mins';
    }

    getTime(arrivalTime: string) {
        const arrivalDate: Date = new Date(arrivalTime);
        const dateTimeFormat = new Intl.DateTimeFormat('en', {
            month: 'short',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric'
        });
        return dateTimeFormat.format(arrivalDate);
    }

    generateStops() {
        if (!this.props.stopData) return undefined;

        let services: any[] = this.props.stopData.Services;
        let listItems: any[] = [];

        services.sort(function (a: { AimedArrival: number; }, b: { AimedArrival: number; }) {
            return a.AimedArrival - b.AimedArrival;
        });

        for (const service of services) {
            // Parse the time information from the response json.

            const serviceName: string = service.Service.Name.split("-")[0];
            const serviceCode: string = service.ServiceID;
            const isLive: boolean = service.IsRealtime;
            const timeRemaining: string = (this.state.showHours) ?
                this.getHoursRemaining(service.AimedArrival) : this.getTime(service.AimedArrival);

            listItems.push(
                <MetlinkListItem
                    navigation={this.props.navigation}
                    code={serviceCode}
                    name={serviceName}
                    isLive={isLive}
                    isStop={false}
                    timeRemaining={timeRemaining}
                />
            )
        }

        return <>{listItems}</>;
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <View style={{height: '100%'}}>
                    <Card>
                        <Card.Title>Upcoming Services</Card.Title>
                        <Card.Divider/>
                        {this.props.stopData ? this.generateStops() : <ActivityIndicator/>}
                    </Card>
                </View>
            </ThemeProvider>
        );
    }
}

export default StopTimetable;