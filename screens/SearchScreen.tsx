import React, {Component} from "react";
import {View} from "../components/styles/Themed";
import {Route, ScrollView, StyleSheet} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {SearchBar} from "react-native-elements";
import SearchTabFilter from "../components/search-tab/SearchTabFilter";
import SearchTabSearchbarDescriptionCard from "../components/search-tab/SearchTabSearchbarDescription";
import SearchTabTabsDescription from "../components/search-tab/SearchTabTabsDescription";

interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
}


interface State {
    // stopsData: StopListProp[],
    // servicesData: StopListProp[],
    stopsErrorMessage: string | null,
    servicesErrorMessage: string | null,
    searchText: string,
    selectedIndex: number,
    flipper: boolean
}

const viewCount = 7
let stopDisplayMultiplier = 1;
let serviceDisplayMultiplier = 1;

class SearchScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            // stopsData: [],
            // servicesData: [],
            stopsErrorMessage: null,
            servicesErrorMessage: null,
            searchText: "",
            selectedIndex: 0,
            flipper: false
        }
    }

    updateIndex(newValue: number) {
        this.setState({selectedIndex: newValue})
        this.resetMultipliers()
    }

    resetMultipliers() {
        stopDisplayMultiplier = 1;
        serviceDisplayMultiplier = 1;
    }

    render() {
        return (
            <View style={styles.container}>
                <SearchBar
                    placeholder={"Search Here..."}
                    onChangeText={(e) => {
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
