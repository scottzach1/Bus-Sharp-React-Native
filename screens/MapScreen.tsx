import {View} from "../components/styles/Themed";
import React, {Component} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import {Route, ScrollView, StyleSheet} from "react-native";
import GoogleMapWidget, {Position, StopMarker} from "../components/google-maps/GoogleMapWidget";
import {getAllStops} from "../external/StorageManager";
import {Card, ListItem, SearchBar} from "react-native-elements";
import {geocodeByAddress} from "react-places-autocomplete";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    stopsData: any | null,
    stopsErrorMessage: string | null,
    searchText: string,
    searchResults: any | null,
    searchLocation: any | null,
    stopMarkers: StopMarker[],
}

class MapScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            stopsData: undefined,
            stopsErrorMessage: null,
            searchText: "",
            searchResults: null,
            searchLocation: null,
            stopMarkers: [],
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
    }

    loadLocation(location: any) {
        geocodeByAddress(location.description).then(location => {
            this.setState({searchLocation: location[0]})
            this.setState({searchText: ""})
        })
    }

    generateStopMarkers() {
        if (!this.state.stopsData) return

        Object.entries(this.state.stopsData).forEach((stop) => {
            if (stop[1]) {
                let item: any = stop[1]
                let marker = new StopMarker(
                    item.stop_name,
                    item.stop_id,
                    item.stop_id,
                    undefined,
                    new Position(parseFloat(item.stop_lat), parseFloat(item.stop_lon))
                )
                this.state.stopMarkers?.push(marker)
            }
        })
    }


    render() {
        if (this.state.stopMarkers.length === 0) {
            this.generateStopMarkers()
        }

        return (
            <View style={styles.container}>
                <GoogleMapWidget
                    navigation={this.props.navigation}
                    route={this.props.route}
                    routePaths={[]}
                    stopMarkers={this.state.stopMarkers}
                    geoCoderResult={this.state.searchLocation}/>
                {(this.state.searchText.length > 0 && this.state.searchResults) && (this.state.searchResults)}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listItem: {
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0
    }
})


export default MapScreen;
