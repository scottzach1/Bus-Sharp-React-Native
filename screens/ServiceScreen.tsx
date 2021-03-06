import React, {Component} from "react";
import {Route, StyleSheet} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {View} from "../components/styles/Themed";
import GoogleMapWidget, {Position, ServiceRoute, StopMarker} from "../components/maps/GoogleMapWidget";
import {fetchServiceData} from "../external/StorageManager";
import ServiceInfo from "../components/service/ServiceInfo";

/**
 * Route: The route currently taken to get to this component.
 * Navigation: The navigation stack used to get to this component.
 */
interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

/**
 * serviceData: All the service data ripped from the local storage.
 * serviceCode: The Code for the service. I.e. "21" represents bus number 21.
 * errorMessage: Any error message received from the local storage component.
 * serviceRoutes: An array of ServiceRoute objects to create polylines on the GoogleMapsWidget.
 * stopMarkers: An array of StopMarker objects to create stop markers on the GoogleMapsWidget.
 */
interface State {
    serviceData: any | null,
    serviceCode: string,
    errorMessage: string | null,
    serviceRoutes: ServiceRoute[],
    stopMarkers: StopMarker[],
}

/**
 * A screen to present the user with a route for some bus.
 */
class ServiceScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            serviceData: undefined,
            serviceCode: this.props.route.params.code,
            errorMessage: null,
            serviceRoutes: [],
            stopMarkers: [],
        }
    }

    /**
     * After the component has mounted, load the data
     */
    componentDidMount() {
        if (!this.state.serviceData || this.state.errorMessage)
            fetchServiceData(this.state.serviceCode).then((resp) => {
                this.setState({
                    serviceData: resp.data,
                    errorMessage: resp.errorMessage,
                });
            });
    }

    /**
     * Creates StopMarker and ServiceRoute objects based on the collected information from local storage.
     */
    generateMapRoute() {
        // Buffer for calculated map-tab elements.
        let parsedRoutes: ServiceRoute[] = [];
        let parsedMarkers: StopMarker[] = [];

        if (this.state.serviceData &&
            ((!this.state.serviceRoutes && !this.state.stopMarkers)
                || (this.state.serviceRoutes?.length == 0 || this.state.stopMarkers?.length === 0)
            )) {
            // Pre-calculate values, update prop after.
            let counter: number = 0;
            for (const route of this.state.serviceData.RouteMaps) {
                let parsedRoute: Position[] = [];

                const key = "route:" + this.state.serviceCode + "-path:" + counter++;
                const strokeColor = "#e076b4";

                for (const point of route.Path) {
                    parsedRoute.push(new Position(undefined, undefined, point));
                }

                parsedRoutes.push(new ServiceRoute(key, strokeColor, parsedRoute));
            }

            // Pre-calculate values, update prop after.
            counter = 0;
            for (const point of this.state.serviceData.StopLocations) {
                const name = null;
                const code = point.Sms;
                const location = point.LatLng;
                const key = "marker:" + code + "-count" + counter++;

                parsedMarkers.push(
                    new StopMarker(
                        name, code, key, location, undefined
                    )
                );
            }

            // Set prop values at same time here to avoid reload between calculations.
            this.setState({serviceRoutes: parsedRoutes});
            this.setState({stopMarkers: parsedMarkers});
        }
    }

    /**
     * Renders the component. Loading the GoogleMapWidget first, else it will block out the Info card.
     */
    render() {
        this.generateMapRoute();

        return (
            <View style={styles.container}>
                <GoogleMapWidget route={this.props.route}
                                 navigation={this.props.navigation}
                                 routePaths={this.state.serviceRoutes}
                                 stopMarkers={this.state.stopMarkers}/>
                <ServiceInfo
                    navigation={this.props.navigation}
                    route={this.props.route}
                    serviceData={this.state.serviceData}
                    code={this.state.serviceCode}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});


export default ServiceScreen;
