import {ActivityIndicator, Button, Route, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import {getAllServices, getSavedServices, setSavedServices} from "../../external/StorageManager";
import {Card} from "react-native-elements";
import ServiceListContainer, {ServiceListProp} from "../lists/ServiceListContainer";
import ErrorCard from "../common/ErrorCard";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    savedServices: string[] | undefined,
    allServices: any | undefined,
    errorMessage: string | null,
}

/**
 * This component provides a container to display all of the saved services.
 *
 * Within this list, we also maintain the saved state of all of the services. This means that when this state changes
 * the entire component re-renders updating all other containing Metlink list entries.
 */
class SavedServiceList extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            savedServices: undefined,
            allServices: undefined,
            errorMessage: null,
        }
    }

    /**
     * Obtains all of the saved services, as well as all of the service information for children (eg, name and code).
     */
    componentDidMount() {
        getAllServices().then((resp) =>
            this.setState({
                errorMessage: resp.errorMessage,
                allServices: resp.data
            }));

        this.checkSavedServices().then();
    }

    /**
     * Checks local storage for any updates, only updating the component and re-rendering if there is an observed
     * difference.
     */
    async checkSavedServices() {
        getSavedServices().then((resp) => {
            const savedString = JSON.stringify(this.state.savedServices);
            const respString = JSON.stringify(resp.data);

            if (savedString === respString) return;

            this.setState({
                errorMessage: resp.errorMessage,
                savedServices: resp.data
            });
        });
    }

    /**
     * Updates the list of saved services locally.
     *
     * NOTE: This acts as a callback received to refresh the other components instead of actually updating the local
     * storage (already handled by the `ServiceListContainer`).
     *
     * @param savedServices - the new value to set locally.
     */
    updateSavedServices(savedServices: string[]) {
        this.setState({savedServices: savedServices});
    }

    /**
     * Clears saved within local storage, updating this components state once the action completes.
     */
    async clearSavedServices() {
        await setSavedServices([], this.context)
        this.setState({savedServices: []});
    }

    /**
     * Generates the list of `MetlinkListItem`'s to be rendered within this container. These will be styled based upon
     * the different props that have been passed to this component.
     */
    generateServiceListItems() {
        if (!this.state.allServices || !this.state.savedServices) return [];

        let containerProps: ServiceListProp[] = [];
        const allServices = this.state.allServices;

        for (let serviceCode of this.state.savedServices) {
            const serviceEntry: any | null = (allServices.hasOwnProperty(serviceCode)) ? allServices[serviceCode] : null;
            const serviceName = (serviceEntry) ? serviceEntry.route_long_name : 'Unknown';

            containerProps.push(new ServiceListProp(serviceName, serviceCode));
        }

        return containerProps;
    }

    // Render styled card containing the service list within a view with optional error card.
    render() {
        // Check for any updates since last render.
        this.checkSavedServices().then();

        return (
            <View>
                <Card>
                    <Card.Title>Saved Services</Card.Title>
                    <Button title={"Clear"} onPress={() => this.clearSavedServices()}/>
                    <Card.Divider/>
                    {(this.state.savedServices && this.state.allServices) ?
                        <ServiceListContainer
                            services={this.generateServiceListItems()}
                            setSavedServices={(savedServices) => this.updateSavedServices(savedServices)}
                            navigation={this.props.navigation}
                            route={this.props.route}
                        /> :
                        <ActivityIndicator/>}
                </Card>
                <ErrorCard
                    errorMessage={this.state.errorMessage}
                    clearMessage={() => this.setState({errorMessage: null})}
                />
            </View>
        )
    }
}

export default SavedServiceList;
