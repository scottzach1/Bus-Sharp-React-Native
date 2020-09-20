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
    originStopCode?: string,
    // Optional callback if the parent wants to be notified of any updates to saved services.
    setSavedServices?: (services: string[]) => void,
}

interface State {
    showHours: boolean,
    savedServices: string[] | undefined,
}

/**
 * This component provides a convenient wrapper to display a list of Metlink services within a card.
 *
 * Within this component there are a variety of different helper methods to manage each of the underlying
 * `MetlinkListItem`'s (eg. Saved service state). Information for each of the services to be rendered is propagated to
 * this component via the class `ServiceListProp` defined at the bottom of the file and passed via the prop `services`
 *
 * Additionally there are other optional props that can passed if relevant to customise the appearance and of the
 * internal `MetlinkListItem`'s.
 */
class ServiceListContainer extends Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            showHours: false,
            savedServices: undefined,
        };
    }

    /**
     * Obtains the list of saved services from local storage.
     */
    componentDidMount() {
        getSavedServices().then((resp) => {
            this.setState({savedServices: resp.data});
        });
    }

    /**
     * Checks whether a service is within the saved services (from local state). If this has not loaded, then this will
     * default to `false`.
     *
     * @param serviceCode - to check whether saved.
     */
    checkFavourite(serviceCode: string) {
        if (!this.state?.savedServices) return false;
        else return this.state.savedServices.includes(serviceCode);
    }

    /**
     * Toggles the saved status of a given service by service code. The change is propagated to both the local storage
     * as well as any of the other `MetlinkListItem`'s within this container.
     *
     * @param serviceCode - to toggle saved on.
     */
    async toggleFavourite(serviceCode: string) {
        const savedServices = (await toggleSavedService(serviceCode)).data.savedServices;
        this.setState({savedServices: savedServices});
        if (this.props.setSavedServices) await this.props.setSavedServices(savedServices);
    }

    /**
     * Formats a date as a string to represent the total time distance from now..
     *
     * @param arrivalTime - time to format as duration string.
     */
    getHoursRemaining(arrivalTime: Date) {
        return formatDistanceToNowStrict(arrivalTime, {
            unit: 'minute',
        });
    }

    /**
     * Formats the time as a string that can be displayed within the `MetlinkListItem`'s
     *
     * @param arrivalTime - time to format is time string.
     */
    formatTime(arrivalTime: Date) {
        return format(arrivalTime, 'ccc cc MMM, p');
    }

    /**
     * Generates the list of `MetlinkListItem`'s to be rendered within this container. These will be styled based upon
     * the different props that have been passed to this component.
     */
    generateServiceItems() {
        // Not present.
        if (!this.props.services) return undefined;

        // Helper variable.
        let services: ServiceListProp[] = this.props.services;
        let counter = 0;

        return services.map((service) => {
            // Extract additional information.
            const arrivalTime = (service.arrival) ? new Date(service.arrival) : null;
            const timeRemaining: string = (arrivalTime) ? ((this.props.showHours) ?
                this.getHoursRemaining(arrivalTime) : this.formatTime(arrivalTime)) : ' ';

            // Generate styled list items.
            return (
                <MetlinkListItem
                    code={service.code}
                    name={service.name}
                    isLive={service.live}
                    isStop={false}
                    isFavourite={this.checkFavourite(service.code)}
                    toggleFavourite={() => this.toggleFavourite(service.code)}
                    timeRemaining={timeRemaining}
                    arrivalTime={arrivalTime}
                    originStopCode={this.props.originStopCode}
                    navigation={this.props.navigation}
                    route={this.props.route}
                    key={`list-item-${service.code}-${service.name}-${timeRemaining ? timeRemaining : ''}-${counter++}`}
                />
            );
        });
    }

    // Return view containing styled `MetlinkListItem`'s.
    render() {
        return (
            <View>
                {this.generateServiceItems()}
            </View>
        );
    }
}

/**
 * Defines a new prop that represents a new service entry within the ServiceListContainer.
 */
export class ServiceListProp {
    public name: string;
    public code: string;
    public live?: boolean;
    public arrival?: string;

    /**
     * Creates a new prop that represents a new service entry within the ServiceListContainer.
     *
     * @param name - of the service.
     * @param code - the service code.
     * @param live (optional) - whether to display the live badge.
     * @param arrival (optional) - when the service arrives.
     */
    constructor(name: string, code: string, live?: boolean, arrival?: string) {
        this.name = name;
        this.code = code;
        this.live = live;
        this.arrival = arrival;
    }
}

export default ServiceListContainer;
