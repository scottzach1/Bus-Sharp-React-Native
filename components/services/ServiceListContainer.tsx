import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import MetlinkListItem from "../common/MetlinkListItem";
import {getSavedServices, toggleSavedStop} from "../../external/StorageManager";
import {View} from "../common/Themed";

interface Props {
    navigation: StackNavigationProp<any>,
    stopData: any | null | undefined,
    showHours: boolean,
}

interface State {
    showHours: boolean,
    savedServices: any[] | undefined,
}

class ServiceListContainer extends Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);

        this.setState({
            showHours: false,
            savedServices: undefined,
        });
    }

    componentDidMount() {
        getSavedServices().then((resp) => {
            this.setState({savedServices: resp.data});
        });
    }

    checkFavourite(serviceCode: string) {
        if (!this.state?.savedServices) return false;
        else return this.state.savedServices.includes(serviceCode);
    }

    toggleFavourite(serviceCode: string) {
        toggleSavedStop(serviceCode)
            .then((resp) => this.setState({savedServices: resp.data.savedServices}))
            .catch((resp) => this.setState({savedServices: resp.data.savedServices}));
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

        services.sort(function (a: { AimedArrival: number; }, b: { AimedArrival: number; }) {
            return a.AimedArrival - b.AimedArrival;
        });

        return services.map((service) => {
            // Parse the time information from the response json.
            const serviceName: string = service.Service.Name.split("-")[0];
            const serviceCode: string = service.ServiceID;
            const isLive: boolean = service.IsRealtime;
            const timeRemaining: string = (this.props.showHours) ?
                this.getHoursRemaining(service.AimedArrival) : this.getTime(service.AimedArrival);

            return (
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
            );
        });
    }

    render() {
        return (
            <View>
                {this.generateStops()}
            </View>
        );
    }
}

export default ServiceListContainer;
