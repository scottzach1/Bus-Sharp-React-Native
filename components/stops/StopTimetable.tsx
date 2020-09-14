import React, {Component} from "react";
import {Card, ThemeProvider} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";
import {View} from "../Themed";
import {ActivityIndicator} from "react-native";
import MetlinkListItem from "../common/MetlinkListItem";
import {getSavedServices, toggleSavedStop} from "../../external/StorageManager";

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
    savedServices: any[] | undefined,
}

class StopTimetable extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            showHours: true,
            savedServices: undefined,
        }
    }

    componentDidMount() {
        getSavedServices().then((resp) => {
            this.setState({savedServices: resp.data});
        });
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

    checkFavourite(serviceCode: string) {
        if (!this.state.savedServices) return false;
        else return this.state.savedServices.includes(serviceCode);
    }

    toggleFavourite(serviceCode: string) {
        toggleSavedStop(serviceCode)
            .then((resp) => this.setState({savedServices: resp.data.savedServices}))
            .catch((resp) => this.setState({savedServices: resp.data.savedServices}));
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
                    isFavourite={this.checkFavourite(serviceCode)}
                    toggleFavourite={() => this.toggleFavourite(serviceCode)}
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