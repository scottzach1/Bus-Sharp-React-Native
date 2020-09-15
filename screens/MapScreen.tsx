import React, {Component} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import GoogleMapWidget, {Position, StopMarker} from "../components/google-maps/GoogleMapWidget";
import {getAllStops} from "../external/StorageManager";
import {StackNavigationProp} from "@react-navigation/stack";
import {Card, ListItem, SearchBar, ThemeProvider} from "react-native-elements";
import Constants from "expo-constants";
import {geocodeByAddress} from "react-places-autocomplete";

const theme = {
    colors: {
        platform: {
            "default": {
                "grey": "#FFF"
            }
        }
    }
};

interface Props {
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

let prevSearch: string = "";

class MapScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            stopsData: undefined,
            stopsErrorMessage: null,
            searchText: "",
            searchResults: null,
            searchLocation: null,
            stopMarkers: []
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

    updateSearchResults() {
        if (this.state.searchText.length === 0 || prevSearch === this.state.searchText) return

        prevSearch = this.state.searchText

        let proxy = "https://cors-anywhere.herokuapp.com/";
        let urlBuilder = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json")
        urlBuilder.searchParams.append("input", this.state.searchText)
        urlBuilder.searchParams.append("location", "-41.28646,174.77623")
        urlBuilder.searchParams.append("radius", "200000")
        urlBuilder.searchParams.append("key", Constants.manifest.extra.REACT_APP_GOOGLE_MAPS_API_KEY)

        fetch(proxy + urlBuilder.href + "&strictbounds")
            .then(results => results.json())
            .then(data => {
                if (data.predictions.length > 0) this.setState({searchResults: this.getPredictions(data.predictions)})
            })
    }

    getPredictions(data: any) {
        return (
            <ThemeProvider theme={theme}>
                <ScrollView>
                    <Card>
                        {data.map((result: any) =>
                            <ListItem
                                style={styles.listItem}
                                onPress={() => this.loadLocation(result)}
                                bottomDivider
                            >
                                <ListItem.Content>
                                    <ListItem.Title>
                                        {result.description}
                                    </ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        )}
                    </Card>
                </ScrollView>
            </ThemeProvider>
        )
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
        this.updateSearchResults()

        if (this.state.stopMarkers.length === 0) {
            this.generateStopMarkers()
        }

        return (
            <View style={styles.container}>
                <GoogleMapWidget
                    routePaths={[]}
                    stopMarkers={this.state.stopMarkers}
                    geoCoderResult={this.state.searchLocation}
                    navigation={this.props.navigation}
                />
                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={(e) => this.setState({searchText: e})}
                    value={this.state.searchText}
                />
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
