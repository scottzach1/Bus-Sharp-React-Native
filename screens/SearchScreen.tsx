import React, {Component} from "react";
import {ScrollView, StyleSheet} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {getAllServices, getAllStops} from "../external/StorageManager";
import {Card, SearchBar} from "react-native-elements";
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
    stopsData: any | null,
    servicesData: any | null,
    stopsErrorMessage: string | null,
    servicesErrorMessage: string | null,
    searchText: string,
    selectedIndex: number,
    stopListElements: StopListProp[],
    serviceListElements: ServiceListProp[]
}

let prevSearch: string = ""
let prevFilter: number = 0
let remainingStops: number = 0
let remainingServices: number = 0

class SearchScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            stopsData: undefined,
            servicesData: undefined,
            stopsErrorMessage: null,
            servicesErrorMessage: null,
            searchText: "",
            selectedIndex: 0,
            stopListElements: [],
            serviceListElements: []
        }
    }

    componentDidMount() {
        if (!this.state.stopsData) {
            getAllStops().then((resp) => {
                this.setState({
                    stopsData: resp.data,
                    stopsErrorMessage: resp.errorMessage,
                })
            });
        }

        if (!this.state.servicesData) {
            getAllServices().then((resp) => {
                this.setState({
                    servicesData: resp.data,
                    servicesErrorMessage: resp.errorMessage
                })
            });
        }
    }

    updateIndex(newValue: number) {
        this.setState({selectedIndex: newValue})
    }

    /**
     * Creates new ServiceListProps and StopListProps to display as potential results to the user.
     */
    async updateSearchResults() {
        if (!this.state.stopsData || !this.state.servicesData ||
            (prevSearch === this.state.searchText && prevFilter === this.state.selectedIndex)) {
            return
        }

        prevSearch = this.state.searchText
        prevFilter = this.state.selectedIndex

        this.updateStopResults()
        this.updateServiceResults()
    }

    /**
     * Maps all stops to searchable items, then these searchable items are then filtered based on the users
     * input. These results are then mapped to StopListProps
     */
    updateStopResults() {
        // Get a set of filtered STOP search items
        let filterStops: SearchItem[] = Object.entries(this.state.stopsData)
            .map((i: any) => {
                let item = i[1]
                return new SearchItem(item.stop_id + "", item.stop_name + "", true)
            })
            .filter((searchItem: SearchItem) => this.filterItem(searchItem))

        let sliceStops: StopListProp[] = filterStops
            .slice(0, Math.min(filterStops.length, 51))
            .map((item: SearchItem) => new StopListProp(item.name, item.code))

        this.setState({stopListElements: sliceStops})
    }

    /**
     * Maps all services to searchable items, then these searchable items are then filtered based on the users
     * input. These results are then mapped to ServiceListProps
     */
    updateServiceResults() {
        // Get a set of filtered SERVICE search items
        let filterServices: SearchItem[] = Object.entries(this.state.servicesData)
            .map((i: any) => {
                let item = i[1]
                return new SearchItem(item.route_id + "", item.route_long_name + "", false)
            })
            .filter((searchItem: SearchItem) => this.filterItem(searchItem))

        let sliceServices: ServiceListProp[] = filterServices
            .slice(0, Math.min(filterServices.length, 51))
            .map((item: SearchItem) => new ServiceListProp(item.name, item.code))

        // Update the list elements
        this.setState({serviceListElements: sliceServices})
    }

    filterItem(item: SearchItem) {
        const filter: number = this.state.selectedIndex
        const searchText: string = this.state.searchText.toLowerCase();

        if ((filter === 1 && !item.isStop) || (filter === 2 && item.isStop)) {
            return false;
        }

        if (searchText.length) {
            for (const key of item.searchText) {
                if ((filter !== 4) ? key.includes(searchText) : key.startsWith(searchText))
                    return true;
            }
        }
        return false;
    }

    render() {
        this.updateSearchResults().then()

        return (
            <View style={styles.container}>
                <SearchBar
                    placeholder={"Search Here..."}
                    onChangeText={(e) => this.setState({searchText: e})}
                    value={this.state.searchText ? this.state.searchText : ""}
                />
                <SearchTabFilter updateIndex={this.updateIndex.bind(this)}/>
                <ScrollView>
                    {!this.state.searchText && (
                        <SearchTabSearchbarDescriptionCard/>
                    )}
                    {!this.state.searchText && (
                        <SearchTabTabsDescription/>
                    )}
                    {this.state.serviceListElements.length && (
                        <Card>
                            <Card.Title>Services</Card.Title>
                            <Card.Divider/>
                            <ServiceListContainer
                                navigation={this.props.navigation}
                                services={this.state.serviceListElements}/>
                        </Card>
                    )}
                    {this.state.stopListElements.length && (
                        <Card>
                            <Card.Title>Stops</Card.Title>
                            <Card.Divider/>
                            <StopListContainer
                                navigation={this.props.navigation}
                                stops={this.state.stopListElements}/>
                        </Card>
                    )}
                </ScrollView>
            </View>
        );
    }
}


class SearchItem {
    searchText: string[];
    code: string;
    name: string;
    isStop: boolean;

    constructor(code: string, name: string, isStop: boolean) {
        this.searchText = [code.toLowerCase(), name.toLowerCase()];
        this.isStop = isStop;
        this.name = name;
        this.code = code;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default SearchScreen;
