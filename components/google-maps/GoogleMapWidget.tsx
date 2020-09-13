import React, {FC} from "react";
import {GoogleMap, useLoadScript} from "@react-google-maps/api";
import "./GoogleMapWidget.css";
import {mapStyles} from "./GoogleMapWidgetStyles";
import {Text} from 'react-native';
import {View} from "../common/Themed";
import Constants from 'expo-constants';


interface Props {
    stopMarkers: StopMarker[] | null,
    routePaths: ServiceRoute[] | null,
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

    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: Constants.manifest.extra.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    })

    // -------------------------------------------------------------------------------------------------------------
    // CHECKS RUN EVERY RENDER
    // -------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------
// FUNCTIONS
// -------------------------------------------------------------------------------------------------------------

    function onLoad(map: google.maps.Map<Element> | null) {
        if (map)
            mapRef = map

        googleLoaded = true
    }

// -------------------------------------------------------------------------------------------------------------
// RETURNING MAP
// -------------------------------------------------------------------------------------------------------------

    console.log('errors:', isLoaded, loadError, options);

    return (
        <>
            {(loadError || !isLoaded) ? <View><Text>Welp</Text></View> :
                <GoogleMap
                    mapContainerClassName={"map"}
                    zoom={16}
                    center={center}
                    options={options}
                    // onDragStart={deselectItem}
                    onLoad={(map) => {
                        map && (onLoad(map))
                    }}
                >
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
