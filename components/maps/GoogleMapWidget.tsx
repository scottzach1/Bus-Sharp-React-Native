import {StackNavigationProp} from "@react-navigation/stack";
import React, {FC, useState} from "react";
import {Route, StyleSheet, Text, View} from "react-native";
import MapView, {Callout, Marker, Polyline} from 'react-native-maps';
import {navigateToMetlink} from "../../navigation/LinkingConfiguration";
import {mapStyles} from "./GoogleMapWidgetStyles";


interface Props {
    stopMarkers: StopMarker[] | null,
    navigation: StackNavigationProp<any>,
    route: Route,
    routePaths: ServiceRoute[] | null,
    searchResult?: { address: string, latitude: number, longitude: number } | null,
}

// Global variables that allow for changing state without re-rendering the object
let selectedId = "";

// STICK AROUND LOCATION TO ENSURE THEY DON'T RE-RENDER
let searchLocation: StopMarker | undefined = undefined

let routeLoaded = false
let googleLoaded = false;
let stopOneLoaded = false;

let region = {
    latitude: -41.286461,
    longitude: 174.776230,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
}

const GoogleMapWidget: FC<Props> = (props) => {
    const [selectedItem, setSelectedItem] = useState<StopMarker | null>(null)
    const [stopMarkers, setStopMarkers] = useState<any[]>([])

    // -------------------------------------------------------------------------------------------------------------
    // CHECKS RUN EVERY RENDER
    // -------------------------------------------------------------------------------------------------------------

    if (props.searchResult) {
        setSearchLocation()
    }

    generateMarkers().then();

    if (props.routePaths && !routeLoaded && googleLoaded) {
        if (props.routePaths.length !== 0) {
            let route = props.routePaths[Math.round(props.routePaths.length / 2) - 1]
            let midLoc = route.path[Math.round(route.path.length / 2) - 1]
            selectedId = "Route"
            selectItem(new StopMarker(
                "Route",
                route.key,
                route.key,
                "",
                new Position(midLoc.latitude, midLoc.longitude)))
            routeLoaded = true
        }
    }

    if (props.stopMarkers?.length === 1 && googleLoaded && !stopOneLoaded) {
        stopOneLoaded = true
        selectedId = "Stop"
        selectItem(props.stopMarkers[0])
    }

    // -------------------------------------------------------------------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------------------------------------------------------------------

    /**
     * Check that the parsed in search location is different to the currently stored location.
     * Returning TRUE means that the search location will be avoided. In this case, returning true is the fail safe
     * method.
     */
    function setSearchLocation() {
        if (props.searchResult?.address
            && props.searchResult?.latitude
            && props.searchResult.longitude
            && searchLocation === undefined) {
            searchLocation = new StopMarker(
                props.searchResult.address,
                "SearchLocation",
                props.searchResult.address,
                "",
                new Position(props.searchResult.latitude, props.searchResult.longitude))
            selectedId = "Search"
            selectItem(searchLocation)
        }
    }

    function selectItem(marker: StopMarker) {
        region = {
            latitude: marker.location.latitude,
            longitude: marker.location.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        }
        setSelectedItem(marker)
    }

    async function generateMarkers() {
        if (!props.stopMarkers || stopMarkers.length !== 0) return;

        setStopMarkers(props.stopMarkers?.map((marker) => (
            <Marker
                key={marker.key}
                coordinate={{
                    latitude: marker.location.latitude,
                    longitude: marker.location.longitude,
                }}
                onPress={() => {
                    selectedId = "Stop"
                    selectItem(marker)
                }}
            >
                <Callout
                    onPress={() => {
                        navigateToMetlink(marker.code, true, props.navigation, props.route)
                    }}
                >
                    <Text>
                        {marker.code + ": " + marker.name}
                    </Text>
                </Callout>
            </Marker>
        )))
    }

// -------------------------------------------------------------------------------------------------------------
// RETURNING MAP
// -------------------------------------------------------------------------------------------------------------
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                showsUserLocation={true}
                customMapStyle={mapStyles}
            >
                {stopMarkers}

                {props.routePaths?.map((route: { key: string | number | null | undefined; path: any[]; color: any; }) => (
                    <Polyline
                        key={route.key}
                        coordinates={route.path.map(position => ({
                            latitude: position.latitude,
                            longitude: position.longitude,
                        }))}
                        strokeColor={route.color}
                        strokeWidth={3}
                    />
                ))}

                {(selectedItem && selectedId === "Search") && (
                    <Marker
                        pinColor={"blue"}
                        coordinate={{
                            latitude: selectedItem.location.latitude,
                            longitude: selectedItem.location.longitude
                        }}
                    >

                        <Callout>
                            <Text>
                                {selectedItem.name}
                            </Text>
                        </Callout>
                    </Marker>
                )}
            </MapView>
        </View>
    )
}

class ServiceRoute {
    public key: string;
    public color: string;
    public path: Position[];

    /**
     * Creates a new route to be rendered by the GoogleMapWidget.
     * @param key
     * @param color
     * @param path
     */
    constructor(key: string, color: string, path: Position[]) {
        this.key = key;
        this.color = color;
        this.path = path;
    }
}

class StopMarker {
    public name: string | null;
    public code: string;
    public key: string;
    public location: Position;

    /**
     * Creates a new stop marker to be parsed by the GoogleMapWidget.
     * @param name - of the stop (Set to `null` if unknown).
     * @param code - of the stop.
     * @param key - unique key for the stop.
     * @param cordString - (opt) string representation of the location. (eg. "-41.3160304,174.7937765,0")
     * @param position - (opt) directly sets the position of the Marker in its raw form.
     */
    constructor(name: string | null, code: string, key: string, cordString?: string, position?: Position) {
        this.name = name;
        this.code = code;
        this.key = key;

        this.location = (position) ? position : new Position(undefined, undefined, cordString);
    }
}

class Position {
    public latitude: number = NaN;
    public longitude: number = NaN;

    /**
     * Creates a new Position
     * @param latitude - (opt) number containing the latitude of the marker coordinates.
     * @param longitude - (opt) number containing the longitude of the marker coordinates.
     * @param cordString - (opt) string representation of the location. (eg. "-41.3160304,174.7937765,0")
     */
    constructor(latitude?: number, longitude?: number, cordString?: string) {
        if (latitude && longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
            return;
        }
        if (cordString) {
            const splitCords: string[] = cordString.split(",");
            this.latitude = parseFloat(splitCords[0]);
            this.longitude = parseFloat(splitCords[1]);
            return;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default GoogleMapWidget;
export {ServiceRoute, StopMarker, Position};
