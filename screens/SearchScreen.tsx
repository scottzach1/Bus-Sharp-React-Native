import React, {Component} from "react";
import {SearchBar, View} from "../components/styles/Themed";
import {Route, ScrollView, StyleSheet} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Button, Card} from "react-native-elements";
import SearchTabFilter from "../components/search/SearchTabFilter";
import SearchTabSearchbarDescriptionCard from "../components/search/SearchTabSearchbarDescription";
import SearchTabTabsDescription from "../components/search/SearchTabTabsDescription";
import {getAllServices, getAllStops} from "../external/StorageManager";
import StopListContainer, {StopListProp} from "../components/lists/StopListContainer";
import ServiceListContainer, {ServiceListProp} from "../components/lists/ServiceListContainer";

/**
 * Route: The route currently taken to get to this component.
 * Navigation: The navigation stack used to get to this component.
 */
interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
}

/**
 * StopsData: An array of StopListProps to present to the user.
 * ServiceData: An array of ServiceListProps to present to the user.
 * StopsErrorMessage: An error message returned from the local storage when attempting to collect the stop data.
 * ServiceErrorMessage: An error message returned from the local storage when attempting to collect the service data.
 * SearchText: A string maintaining the user entered text for their search.
 * SelectedIndex: A String representation of the index where the filter button group is currently at.
 * Flipper: Used to re-render the page when needed.
 */
interface State {
    stopsData: StopListProp[],
    servicesData: ServiceListProp[],
    stopsErrorMessage: string | null,
    servicesErrorMessage: string | null,
    searchText: string,
    selectedIndex: "ALL" | "ROUTES" | "STOPS" | "EXACT",
    flipper: boolean
}

/**
 * ViewCount: The amount of viewable Stop/ServiceListProps that are viewable by default. Loading in too many results in
 * a lag when entering text with multiple results.
 */
const viewCount = 7
/**
 * StopDisplayMultiplier: A multiplier to increase the number of viewable StopListProps.
 */
let stopDisplayMultiplier = 1;
/**
 * ServiceDisplayMultiplier: A multiplier to increase the number of viewable ServiceListProps.
 */
let serviceDisplayMultiplier = 1;

/**
 * RemainingStops: The number of remaining stops not currently presented to the user.
 */
let remainingStops: number = 0
/**
 * RemainingServices: The number of remaining services not currently presented to the user.
 */
let remainingServices: number = 0

/**
 * SearchScreen: A class to render the ability for the user to locate particular service or stops. This is the default
 * screen loaded by the application, and is rendered when the SearchTab button is clicked.
 */
class SearchScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            stopsData: [],
            servicesData: [],
            stopsErrorMessage: null,
            servicesErrorMessage: null,
            searchText: "",
            selectedIndex: "ALL",
            flipper: false

        }
    }

    /**
     * After the component has mounted, the Stop and Service data in the local data is loaded into this object for ease
     * of access.
     */
    componentDidMount() {
        if (this.state.stopsData.length === 0) {
            getAllStops().then((resp) => {
                this.setState({
                    stopsData: Object.entries(resp.data)
                        .map((stop: any) => new StopListProp(stop[1].stop_name, stop[1].stop_id))
                        .sort(function (a, b) {
                            return a.code.localeCompare(b.code)
                        }),
                    stopsErrorMessage: resp.errorMessage,
                })
            });
        }

        if (this.state.servicesData.length === 0) {
            getAllServices().then((resp) => {
                this.setState({
                    servicesData: Object.entries(resp.data)
                        .map((route: any) => new ServiceListProp(route[1].route_long_name, route[1].route_short_name))
                        .sort(function (a, b) {
                            return a.code.localeCompare(b.code)
                        }),
                    servicesErrorMessage: resp.errorMessage
                })
            });
        }
    }

    /**
     * A function to update the currently selected filter.
     * @param newValue - An integer value of which button (0-3) is currently pressed.
     */
    updateIndex(newValue: number) {
        let buttonValue: "ALL" | "ROUTES" | "STOPS" | "EXACT";
        switch (newValue) {
            case 0:
                buttonValue = "ALL";
                break;
            case 1:
                buttonValue = "ROUTES";
                break;
            case 2:
                buttonValue = "STOPS";
                break;
            case 3:
                buttonValue = "EXACT";
                break;
            default:
                buttonValue = "ALL"
        }
        this.setState({selectedIndex: buttonValue})
        this.resetMultipliers()
    }

    /**
     * Filters all the stops presented to the user based on the number of stops the user has selected to be presented,
     * and the filter choices of the user.
     */
    filterStops() {
        if (this.state.stopsData.length === 0
            || this.state.selectedIndex === "ROUTES") {
            return []
        }

        let filtered = this.state.stopsData
            .filter((stop: StopListProp) => this.filterListElement(stop.name, stop.code))

        remainingStops = filtered.length - (viewCount * stopDisplayMultiplier)

        return filtered.slice(0, Math.min(filtered.length, (viewCount * stopDisplayMultiplier)))
    }

    /**
     * Filters all the services presented to the user based on the number of services the user has selected to be
     * presented, and the filter choices of the user.
     */
    filterServices() {
        if (this.state.servicesData.length === 0
            || this.state.selectedIndex === "STOPS") {
            return []
        }

        let filtered = this.state.servicesData
            .filter((service: ServiceListProp) => this.filterListElement(service.name, service.code))

        remainingServices = filtered.length - (viewCount * serviceDisplayMultiplier)

        return filtered.slice(0, Math.min(filtered.length, (viewCount * serviceDisplayMultiplier)))
    }


    /**
     * Given a name and code of a ListProp, determine weather or not these parameters meet the filtering selected by
     * the user. We use the name and code of each service/stop such that both are available to the user.
     * @param name - The stop/service name.
     * @param code - The stop/service code (the one that is available to all users publicly).
     */
    filterListElement(name: string, code: string) {
        if (name === undefined || code === undefined) return false

        return this.state.selectedIndex !== "EXACT" ?
            (name.toLowerCase().includes(this.state.searchText.toLowerCase())
                || code.toLowerCase().includes(this.state.searchText.toLowerCase()))
            :
            (name.toLowerCase().startsWith(this.state.searchText.toLowerCase())
                || code.toLowerCase().startsWith(this.state.searchText.toLowerCase()))
    }

    /**
     * Reset the number of stops/services presented to the user as the filter changes.
     */
    resetMultipliers() {
        stopDisplayMultiplier = 1;
        serviceDisplayMultiplier = 1;
    }

    /**
     * Render the page in the following order:
     *  - Search bar.
     *  - Filter buttons.
     *  - If there is no search text: Explain the search options and filters.
     *  - If there is some search text: Present all matching items to the user.
     */
    render() {
        let services: ServiceListProp[] = (this.state.servicesData.length > 0 && this.state.searchText.length > 0)
            ? this.filterServices() : []
        let stops: StopListProp[] = (this.state.stopsData.length > 0 && this.state.searchText.length > 0)
            ? this.filterStops() : []

        return (
            <View
                style={styles.container}
            >
                <SearchBar
                    placeholder={"Search Here..."}
                    onChangeText={(e: string) => {
                        this.setState({searchText: e})
                        this.resetMultipliers()
                    }}
                    value={this.state.searchText}
                />
                <SearchTabFilter updateIndex={this.updateIndex.bind(this)}/>
                <ScrollView>
                    {!this.state.searchText && (
                        <View>
                            <SearchTabSearchbarDescriptionCard/>
                            <SearchTabTabsDescription/>
                        </View>
                    )}
                    {(services && services.length > 0) && (
                        <Card>
                            <Card.Title>Services</Card.Title>
                            <Card.Divider/>
                            <ServiceListContainer
                                key={"search-list-results"}
                                route={this.props.route}
                                navigation={this.props.navigation}
                                services={services}
                            />
                            {remainingServices > 0 && (
                                <Button
                                    title={"more... (+" + remainingServices + ")"}
                                    type={"outline"}
                                    onPress={() => {
                                        serviceDisplayMultiplier++;
                                        this.setState({flipper: !this.state.flipper})
                                    }}
                                />)}
                        </Card>
                    )}
                    {(stops && stops.length > 0) && (
                        <Card>
                            <Card.Title>Stops</Card.Title>
                            <Card.Divider/>
                            <StopListContainer
                                key={"stop-list-results"}
                                route={this.props.route}
                                navigation={this.props.navigation}
                                stops={stops}
                            />
                            {remainingStops > 0 && (
                                <Button
                                    title={"more... (+" + remainingStops + ")"}
                                    type={"outline"}
                                    onPress={() => {
                                        stopDisplayMultiplier++;
                                        this.setState({flipper: !this.state.flipper})
                                    }}
                                />)}
                        </Card>
                    )}

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
});


export default SearchScreen;
