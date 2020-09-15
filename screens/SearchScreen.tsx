import React, {Component} from "react";
import {ScrollView, StyleSheet} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {getAllServices, getAllStops} from "../external/StorageManager";
import {Button, Card, SearchBar} from "react-native-elements";
import {View} from "../components/common/Themed";
import SearchTabSearchbarDescriptionCard from "../components/search-tab/SearchTabSearchbarDescription";
import SearchTabTabsDescription from "../components/search-tab/SearchTabTabsDescription";
import SearchTabFilter from "../components/search-tab/SearchTabFilter";
import ServiceListContainer, {ServiceListProp} from "../components/services/ServiceListContainer";
import StopListContainer, {StopListProp} from "../components/stops/StopListContainer";

interface Props {
    navigation: StackNavigationProp<any>,
}

interface State {
    stopsData: StopListProp[],
    servicesData: StopListProp[],
    stopsErrorMessage: string | null,
    servicesErrorMessage: string | null,
    searchText: string,
    selectedIndex: number,
}

let prevSearch: string = ""
let prevFilter: number = 0
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
        }
    }

    componentDidMount() {
        if (this.state.stopsData.length === 0) {
            getAllStops().then((resp) => {
                this.setState({
                    stopsData: Object.entries(resp.data).map((stop: any) => new StopListProp(stop[1].stop_name, stop[1].stop_id)),
                    stopsErrorMessage: resp.errorMessage,
                })
            });
        }

        if (this.state.servicesData.length === 0) {
            getAllServices().then((resp) => {
                this.setState({
                    servicesData: Object.entries(resp.data).map((route: any) => new ServiceListProp(route[1].route_long_name, route[1].route_id)),
                    servicesErrorMessage: resp.errorMessage
                })
            });
        }
    }

    updateIndex(newValue: number) {
        this.setState({selectedIndex: newValue})
    }

    filterStops() {
        if (this.state.stopsData.length === 0
            || this.state.stopsData.length === 0
            || this.state.selectedIndex === 1) {
            return []
        }

        let filtered = this.state.stopsData
            .filter((stop: StopListProp) => this.filterListElement(stop.name, stop.code))

        remainingStops = filtered.length - 5

        return filtered.slice(0, Math.min(filtered.length, 5))
    }

    filterServices() {
        if (this.state.servicesData.length === 0
            || this.state.servicesData.length === 0
            || this.state.selectedIndex === 2) {
            return []
        }

        let filtered = this.state.servicesData
            .filter((service: ServiceListProp) => this.filterListElement(service.name, service.code))

        remainingServices = filtered.length - 5

        return filtered.slice(0, Math.min(filtered.length, 5))
    }


    filterListElement(name: string, code: string) {
        if (name === undefined || code === undefined) return false

        return this.state.selectedIndex !== 4 ?
            (name.includes(this.state.searchText) || code.includes(this.state.searchText)) :
            (name.startsWith(this.state.searchText) || code.startsWith(this.state.searchText))
    }

    render() {
        let services: ServiceListProp[] = (this.state.servicesData.length > 0 && this.state.searchText.length > 0)
            ? this.filterServices() : []
        let stops: StopListProp[] = (this.state.stopsData.length > 0 && this.state.searchText.length > 0)
            ? this.filterStops() : []

        return (
            <View style={styles.container}>
                <SearchBar
                    placeholder={"Search Here..."}
                    onChangeText={(e) => {
                        this.setState({searchText: e});
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
                                navigation={this.props.navigation}
                                services={services}
                            />
                            {remainingServices > 0 && (
                                <Button title={"more..."} type={"outline"}/>)}
                        </Card>
                    )}
                    {(stops && stops.length > 0) && (
                        <Card>
                            <Card.Title>Stops</Card.Title>
                            <Card.Divider/>
                            <StopListContainer
                                navigation={this.props.navigation}
                                stops={stops}
                            />
                            {remainingStops > 0 && (
                                <Button title={"more..."} type={"outline"}/>)}
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
    }
})

export default SearchScreen;
