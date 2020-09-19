import {View} from "../components/styles/Themed";
import React, {Component} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import {Route, StyleSheet} from "react-native";
import GoogleMapWidget, {Position, StopMarker} from "../components/maps/GoogleMapWidget";
import {getAllStops} from "../external/StorageManager";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    stopsData: any | null,
    stopsErrorMessage: string | null,
    searchLocation: { address: string, latitude: number, longitude: number } | null,
    stopMarkers: StopMarker[],
}

class MapScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            stopsData: undefined,
            stopsErrorMessage: null,
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
                {this.state.stopMarkers && (
                    <GoogleMapWidget
                        navigation={this.props.navigation}
                        route={this.props.route}
                        routePaths={[]}
                        stopMarkers={this.state.stopMarkers}
                        searchResult={this.state.searchLocation}/>
                )}
                <GooglePlacesAutocomplete
                    placeholder='Search'
                    onPress={(data, details = null) => {
                        if (details) {
                            this.setState({
                                searchLocation: {
                                    address: details.formatted_address,
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng
                                }
                            })
                        }
                    }}
                    query={{
                        key: "AIzaSyAI5mcBlQsxr2RjeOr2UxeKyjl_z2oh6UI",
                        language: 'en',
                        radius: 200000,
                        location: "-41.286461,174.776230",

                    }}
                    fetchDetails={true}
                    styles={{
                        listView: {backgroundColor: "#fff"}
                    }}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        display: "flex",
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
