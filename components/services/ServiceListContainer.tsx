import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import MetlinkListItem from "../common/MetlinkListItem";
import {getSavedServices, toggleSavedStop} from "../../external/StorageManager";
import {View} from "../Themed";

interface Props {
    navigation: StackNavigationProp<any>,
    services: ServiceListProp[],
    showHours?: boolean,
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
        if (!this.props.services) return undefined;

        let services: ServiceListProp[] = this.props.services;

        return services.map((service) => {
            const timeRemaining: string = (service.arrival) ? ((this.props.showHours) ?
                this.getHoursRemaining(service.arrival) : this.getTime(service.arrival)) : ' ';

            return (
                <MetlinkListItem
                    navigation={this.props.navigation}
                    code={service.code}
                    name={service.name}
                    isLive={service.live}
                    isStop={false}
                    isFavourite={this.checkFavourite(service.code)}
                    toggleFavourite={() => this.toggleFavourite(service.code)}
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

export class ServiceListProp {
    public name: string;
    public code: string;
    public live?: boolean;
    public arrival?: string;

    constructor(name: string, code: string, live?:boolean, arrival?: string) {
        this.name = name;
        this.code = code;
        this.live = live;
        this.arrival = arrival;
    }
}

export default ServiceListContainer;