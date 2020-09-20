import {StackNavigationProp} from "@react-navigation/stack";
import React, {FC, useState} from "react";
import {Route, StyleSheet, Text, View} from "react-native";
import MapView, {Callout, Marker, Polyline} from 'react-native-maps';
import {mapStyles} from "./GoogleMapWidgetStyles";
import {navigateToMetlink} from "../../navigation/LinkingConfiguration";


/**
 * Navigation: The navigation stack used to get to this component.
 * Route: The route currently taken to get to this component.
 * StopMarkers: All StopMarkers that should be presented on the google widget.
 * RoutePaths: All paths that should be presented on the google maps widget.
 * SearchResult: The result of some searched location, in the form of an object with a lat/lng and address.
 */
interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
    stopMarkers: StopMarker[] | null,
    routePaths: ServiceRoute[] | null,
    searchResult?: { address: string, latitude: number, longitude: number } | null,
}

// Global variables that allow for changing state without re-rendering the object
let selectedId = "";

// STICK AROUND LOCATION TO ENSURE THEY DON'T RE-RENDER
let searchLocation: StopMarker | undefined = undefined

let googleLoaded = false;
let stopOneLoaded = false;

/**
 * Location of where where the map is to go, and the last loaded location. The current preset places the user in the
 * middle of Wellington.
 */
let region = {
    latitude: -41.286461,
    longitude: 174.776230,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
}


/**
 * A widget that can be used in multiple places to show the user a view of a Google Maps, loaded with relevant information.
 *
 * @param props - As seen in the Props interface above.
 * @constructor - None exist. This a purely hook object.
 */
const GoogleMapWidget: FC<Props> = (props) => {
    const [selectedItem, setSelectedItem] = useState<StopMarker | null>(null)
    const [stopMarkers, setStopMarkers] = useState<any[]>([])

    // -------------------------------------------------------------------------------------------------------------
    // CHECKS RUN EVERY RENDER
    // -------------------------------------------------------------------------------------------------------------

    // If there are search results then set the location of the map to the search location.
    if (props.searchResult) {
        setSearchLocation()
    }

    // Generate the markers to present them on the map as soon as possible.
    generateMarkers().then();

    // If the map has been given some routes, then load these routes into the object such that the user can be presented
    // with them on the map.
    if (props.routePaths) {
        if (props.routePaths.length !== 0) {
            let route = props.routePaths[Math.round(props.routePaths.length / 2) - 1]
            let midLoc = route.path[Math.round(route.path.length / 2) - 1]
            let maxLat: number = 0, minLat: number = 0;
            let maxLng: number = 0, minLng: number = 0;
            route.path.forEach((loc) => {
                maxLat = (maxLat === 0 || maxLat < loc.latitude) ? loc.latitude : maxLat;
                minLat = (minLat === 0 || minLat > loc.latitude) ? loc.latitude : minLat;

                maxLng = (maxLng === 0 || maxLng < loc.longitude) ? loc.longitude : maxLng;
                minLng = (minLng === 0 || minLng > loc.longitude) ? loc.longitude : minLng;
            })

            let latDelta = (maxLat - minLat)
            let lngDelta = (maxLng - minLng)

            region = {
                latitude: midLoc.latitude,
                longitude: midLoc.longitude,
                latitudeDelta: latDelta,
                longitudeDelta: lngDelta,
            }
        }
    }

    // If the object has been parsed some stop markers then load those onto the map and select the first one.
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

    /**
     * Selects a stop marker on the map, and relocated the maps position to center on that location.
     * @param marker - The marker to center on.
     */
    function selectItem(marker: StopMarker) {
        region = {
            latitude: marker.location.latitude,
            longitude: marker.location.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        }
        setSelectedItem(marker)
    }

    /**
     * Generate stop markers for all the data given to the object through a prop from local storage.
     */
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
