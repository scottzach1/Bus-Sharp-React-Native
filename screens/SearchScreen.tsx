import React, {Component} from "react";
import {ScrollView, StyleSheet} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {getAllServices, getAllStops} from "../external/StorageManager";
import {SearchBar} from "react-native-elements";
import {View} from "../components/common/Themed";
import SearchTabSearchbarDescriptionCard from "../components/search-tab/SearchTabSearchbarDescription";
import SearchTabTabsDescription from "../components/search-tab/SearchTabTabsDescription";
import SearchTabFilter from "../components/search-tab/SearchTabFilter";

interface Props {
    navigation: StackNavigationProp<any>,
}

interface State {
    stopsData: any | null,
    servicesData: any | null,
    stopsErrorMessage: string | null,
    servicesErrorMessage: string | null,
    searchText: string,
    selectedIndex: number
}

class SearchScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            stopsData: undefined,
            servicesData: undefined,
            stopsErrorMessage: null,
            servicesErrorMessage: null,
            searchText: "",
            selectedIndex: 0
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

    render() {
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
