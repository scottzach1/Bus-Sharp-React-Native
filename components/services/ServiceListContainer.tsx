import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import {getSavedServices, toggleSavedService} from "../../external/StorageManager";
import MetlinkListItem from "../styles/MetlinkListItem";
import {Route, View} from "react-native";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
    services: ServiceListProp[],
    showHours?: boolean,
    // Optional callback if the parent wants to be notified of any updates to saved services.
    setSavedServices?: (services: string[]) => void,
}

interface State {
    showHours: boolean,
    savedServices: string[] | undefined,
}

class ServiceListContainer extends Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            showHours: false,
            savedServices: undefined,
        };
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

    async toggleFavourite(serviceCode: string) {
        const savedServices = (await toggleSavedService(serviceCode)).data.savedServices;
        this.setState({savedServices: savedServices});
        if (this.props.setSavedServices) await this.props.setSavedServices(savedServices);
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

    generateServices() {
        if (!this.props.services) return undefined;

        let services: ServiceListProp[] = this.props.services;

        return services.map((service) => {
            const timeRemaining: string = (service.arrival) ? ((this.props.showHours) ?
                this.getHoursRemaining(service.arrival) : this.getTime(service.arrival)) : ' ';

            return (
                <MetlinkListItem
                    route={this.props.route}
                    navigation={this.props.navigation}
                    code={service.code}
                    name={service.name}
                    isLive={service.live}
                    isStop={false}
                    isFavourite={this.checkFavourite(service.code)}
                    toggleFavourite={() => this.toggleFavourite(service.code)}
                    timeRemaining={timeRemaining}
                    key={`list-item-${service.code}-${service.name}`}
                />
            );
        });
    }

    render() {
        return (
            <View>
                {this.generateServices()}
            </View>
        );
    }
}

export class ServiceListProp {
    public name: string;
    public code: string;
    public live?: boolean;
    public arrival?: string;

    constructor(name: string, code: string, live?: boolean, arrival?: string) {
        this.name = name;
        this.code = code;
        this.live = live;
        this.arrival = arrival;
    }
}

export default ServiceListContainer;
