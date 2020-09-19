import React, {Component} from "react";
import {SearchBar, View} from "../components/styles/Themed";
import {Route, ScrollView, StyleSheet} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Button, Card} from "react-native-elements";
import SearchTabFilter from "../components/search/SearchTabFilter";
import SearchTabSearchbarDescriptionCard from "../components/search/SearchTabSearchbarDescription";
import SearchTabTabsDescription from "../components/search/SearchTabTabsDescription";
import StopListContainer, {StopListProp} from "../components/stops/StopListContainer";
import {getAllServices, getAllStops} from "../external/StorageManager";
import ServiceListContainer, {ServiceListProp} from "../components/services/ServiceListContainer";

interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
}


interface State {
    stopsData: StopListProp[],
    servicesData: StopListProp[],
    stopsErrorMessage: string | null,
    servicesErrorMessage: string | null,
    searchText: string,
    selectedIndex: number,
    flipper: boolean
}


const viewCount = 7
let stopDisplayMultiplier = 1;
let serviceDisplayMultiplier = 1;

let remainingStops: number = 0
let remainingServices: number = 0

class SearchScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            stopsData: [],
            servicesData: [],
            stopsErrorMessage: null,
            servicesErrorMessage: null,
            searchText: "",
            selectedIndex: 0,
            flipper: false

        }
    }

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
                        .map((route: any) => new ServiceListProp(route[1].route_long_name, route[1].route_id))
                        .sort(function (a, b) {
                            return a.code.localeCompare(b.code)
                        }),
                    servicesErrorMessage: resp.errorMessage
                })
            });
        }
    }

    updateIndex(newValue: number) {
        this.setState({selectedIndex: newValue})
        this.resetMultipliers()
    }

    filterStops() {
        if (this.state.stopsData.length === 0
            || this.state.stopsData.length === 0
            || this.state.selectedIndex === 1) {
            return []
        }

        let filtered = this.state.stopsData
            .filter((stop: StopListProp) => this.filterListElement(stop.name, stop.code))

        remainingStops = filtered.length - (viewCount * stopDisplayMultiplier)

        return filtered.slice(0, Math.min(filtered.length, (viewCount * stopDisplayMultiplier)))
    }

    filterServices() {
        if (this.state.servicesData.length === 0
            || this.state.servicesData.length === 0
            || this.state.selectedIndex === 2) {
            return []
        }

        let filtered = this.state.servicesData
            .filter((service: ServiceListProp) => this.filterListElement(service.name, service.code))

        remainingServices = filtered.length - (viewCount * serviceDisplayMultiplier)

        return filtered.slice(0, Math.min(filtered.length, (viewCount * serviceDisplayMultiplier)))
    }


    filterListElement(name: string, code: string) {
        if (name === undefined || code === undefined) return false

        return this.state.selectedIndex !== 3 ?
            (name.toLowerCase().includes(this.state.searchText.toLowerCase())
                || code.toLowerCase().includes(this.state.searchText.toLowerCase())) :
            (name.toLowerCase().startsWith(this.state.searchText.toLowerCase())
                || code.toLowerCase().startsWith(this.state.searchText.toLowerCase()))
    }

    resetMultipliers() {
        stopDisplayMultiplier = 1;
        serviceDisplayMultiplier = 1;
    }

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
                                    title={"more..."}
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
                                key={"stop-list-esults"}
                                route={this.props.route}
                                navigation={this.props.navigation}
                                stops={stops}
                            />
                            {remainingStops > 0 && (
                                <Button
                                    title={"more..."}
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
