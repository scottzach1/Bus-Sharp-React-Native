import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import {getSavedServices, toggleSavedService} from "../../external/StorageManager";
import {Route, View} from "react-native";
import MetlinkListItem from "./MetlinkListItem";
import {format, formatDistanceToNowStrict} from "date-fns";

interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
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
        return formatDistanceToNowStrict(new Date(arrivalTime), {
            unit: 'minute',
        });
    }

    getTime(arrivalTime: string) {
        return format(new Date(arrivalTime), 'ccc cc MMM, p');
    }

    generateServices() {
        if (!this.props.services) return undefined;

        let services: ServiceListProp[] = this.props.services;
        let counter = 0;

        return services.map((service) => {
            const timeRemaining: string = (service.arrival) ? ((this.props.showHours) ?
                this.getHoursRemaining(service.arrival) : this.getTime(service.arrival)) : ' ';

            return (
                <MetlinkListItem
                    code={service.code}
                    name={service.name}
                    isLive={service.live}
                    isStop={false}
                    isFavourite={this.checkFavourite(service.code)}
                    toggleFavourite={() => this.toggleFavourite(service.code)}
                    timeRemaining={timeRemaining}
                    navigation={this.props.navigation}
                    route={this.props.route}
                    key={`list-item-${service.code}-${service.name}-${timeRemaining ? timeRemaining : ''}-${counter++}`}
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