import React, {FC, useState} from "react";
import {GoogleMap, InfoWindow, Marker, Polyline, useLoadScript} from "@react-google-maps/api";
// import "./GoogleMapWidget.css";
import {mapStyles} from "./GoogleMapWidgetStyles";
import {Route, Text, View} from 'react-native';
import Constants from 'expo-constants';
import {getLatLng} from "react-places-autocomplete";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {StackNavigationProp} from "@react-navigation/stack";
import {navigateToMetlink} from "../../navigation/LinkingConfiguration";


interface Props {
    stopMarkers: StopMarker[] | null,
    navigation: StackNavigationProp<any>,
    route: Route,
    routePaths: any | null,
    geoCoderResult?: google.maps.GeocoderResult,
}

const libraries = ["places"];


/**
 * Options for the map-tab to allow for zoom and movement on the map-tab.
 */
const options = {
    disableDefaultUI: true, // Commented for street view.
    styles: mapStyles,
    zoomControl: false,
    streetViewControl: true,
    fullscreenControl: true,
    fullscreenControlOptions: {
        // I believe this isn't recognised by TypeScript as it needs to be in the Maps component.
        // I don't know why, but video I saw said this needed to be outside to stop the page
        // refreshing.
        // https://developers.google.com/maps/documentation/javascript/controls
        position: 9, // 'google.maps.ControlPosition.RIGHT_BOTTOM'
    },
    mapTypeControl: true,
    mapTypeControlOptions: {
        // https://developers.google.com/maps/documentation/javascript/controls
        style: 1, // google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: 6, // 'google.maps.ControlPosition.LEFT_BOTTOM'
    },
}

/**
 * Location where the map-tab is centered
 */
const center = {
    lat: -41.286461,
    lng: 174.776230,
}

// Global variables that allow for changing state without re-rendering the object
let selectedId = "";
let mapRef: google.maps.Map | null = null;

// STICK AROUND LOCATION TO ENSURE THEY DON'T RE-RENDER
let userLocation: StopMarker | null = null
let searchLocation: StopMarker | undefined = undefined

let routeLoaded = false
let googleLoaded = false;
let stopOneLoaded = false;

const GoogleMapWidget: FC<Props> = (props) => {
    // TOAST
    const [showToast, setShowToast] = useState<boolean>(false)

    // SELECTED ITEM
    // A StopMarker used to represent the item, maintains information about the selected item.
    const [selectedItem, setSelectedItem] = useState<StopMarker | null>(null)

    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: Constants.manifest.extra.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    })

    // -------------------------------------------------------------------------------------------------------------
    // CHECKS RUN EVERY RENDER
    // -------------------------------------------------------------------------------------------------------------

    if (props.geoCoderResult) {
        setSearchLocation()
    }

    if (!userLocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successfulPosition);
    }

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
        if (props.geoCoderResult === undefined) return
        getLatLng(props.geoCoderResult)
            .then(latLng => {
                if (searchLocation === undefined
                    || searchLocation.location.latitude !== latLng.lat
                    || searchLocation.location.longitude !== latLng.lng) {
                    searchLocation = new StopMarker(
                        null,
                        "SearchLocation",
                        props.geoCoderResult?.formatted_address ? props.geoCoderResult.formatted_address : "",
                        "",
                        new Position(latLng.lat, latLng.lng))
                    selectedId = "Search"
                    selectItem(searchLocation)
                }
            })
    }

    /**
     * A function to create a user location if the geoLocation is successful in getting the current position.
     * @param position - The geoLocation of the user.
     */
    function successfulPosition(position: any) {
        userLocation = new StopMarker(
            "User Location",
            "USR_LOC",
            "USR_LOC",
            undefined,
            new Position(parseFloat(position.coords.latitude), parseFloat(position.coords.longitude), undefined))
        setShowToast(true)
    }


    function selectItem(marker: StopMarker) {
        if (mapRef != null) {
            mapRef.panTo({lat: marker.location.latitude, lng: marker.location.longitude})
        }
        setSelectedItem(marker);
    }

    function deselectItem() {
        selectedId = "";
        setSelectedItem(null)
    }

    function onLoad(map: google.maps.Map<Element> | null) {
        if (map)
            mapRef = map
        googleLoaded = true
    }

    // -------------------------------------------------------------------------------------------------------------
    // RETURNING MAP
    // -------------------------------------------------------------------------------------------------------------
    return (
        <>
            {!isLoaded ? <View><Text>Loading...</Text></View> :
                <GoogleMap
                    mapContainerClassName={"map"}
                    zoom={16}
                    center={center}
                    options={options}
                    onDragStart={deselectItem}
                    onLoad={(map) => {
                        map && (onLoad(map))
                    }}
                >

                    {userLocation && (
                        <Marker
                            key={userLocation.name}
                            position={{
                                lat: userLocation.location.latitude,
                                lng: userLocation.location.longitude,
                            }}
                            onClick={() => {
                                if (userLocation) {
                                    selectedId = "User"
                                    selectItem(userLocation);
                                }
                            }}
                            icon="https://www.robotwoods.com/dev/misc/bluecircle.png"
                        />
                    )}

                    {props.stopMarkers?.map((marker) => (
                        <Marker
                            key={marker.key}
                            position={{
                                lat: marker.location.latitude,
                                lng: marker.location.longitude,
                            }}
                            onClick={() => {
                                selectedId = "Stop"
                                selectItem(marker)
                            }}
                        />
                    ))}

                    {props.routePaths?.map((route: { key: string | number | null | undefined; path: any[]; color: any; }) => (
                        <Polyline
                            key={route.key}
                            path={route.path.map(position => ({
                                lat: position.latitude,
                                lng: position.longitude,
                            }))}
                            options={{strokeColor: route.color}}
                        />
                    ))}

                    {(selectedId === "User" && userLocation) && (
                        <InfoWindow
                            key={userLocation.name}
                            position={{
                                lat: userLocation.location.latitude,
                                lng: userLocation.location.longitude,
                            }}
                            onCloseClick={() => {
                                deselectItem()
                            }}
                        >
                            <div id="selected-stop-popup">
                                <strong>User Location</strong>
                            </div>
                        </InfoWindow>
                    )}

                    {(selectedId === "Stop" && selectedItem) && (
                        <InfoWindow
                            key={selectedItem.key + "-selected"}
                            position={{
                                lat: selectedItem.location.latitude,
                                lng: selectedItem.location.longitude,
                            }}
                            onCloseClick={() => {
                                deselectItem()
                            }}
                        >
                            <div
                                id="selected-stop-popup"
                                onClick={() => navigateToMetlink(selectedItem.code, true, props.navigation, props.route)}
                            >
                                <Text>
                                    <MaterialCommunityIcons name="map-marker" size={16} color="black"/>
                                    <strong> {selectedItem.code + ": " + selectedItem.name}</strong>
                                </Text>
                            </div>
                        </InfoWindow>
                    )}

                    {(selectedId === "Search" && searchLocation) && (
                        <InfoWindow
                            key={searchLocation.key}
                            position={{
                                lat: searchLocation.location.latitude,
                                lng: searchLocation.location.longitude,
                            }}
                            onCloseClick={() => {
                                deselectItem()
                            }}
                        >
                            <div id="selected-stop-popup">
                                <strong>{searchLocation.key}</strong>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>}
        </>
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

export default GoogleMapWidget;
export {ServiceRoute, StopMarker, Position};
