import React, {Component} from "react";
import GoogleMapWidget, {Position, StopMarker} from "../components/maps/GoogleMapWidget";
import {StackNavigationProp} from "@react-navigation/stack";
import {Route} from "react-native";
import {fetchStopData} from "../external/StorageManager";

interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
    stopCode: string,
    stopInfo: any,
}

interface State {
    stopData: any | null,
    stopCode: string,
    errorMessage: string | null,
}

let counter: number = 0;

class StopMapScreen extends Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            stopData: undefined,
            stopCode: this.props.route.params.code,
            errorMessage: null,
        }
    }

    componentDidMount() {
        if (!this.state.stopData || this.state.errorMessage)
            fetchStopData(this.state.stopCode).then((resp) => {
                this.setState({
                    stopData: resp.data,
                    errorMessage: resp.errorMessage,
                });
            });
    }


    render() {
        let stopMarkers: StopMarker[] = this.state.stopData ?
            [new StopMarker(
                this.state.stopData.Stop.Name,
                this.state.stopCode,
                "marker:" + this.state.stopCode + "-count" + counter++,
                undefined,
                new Position(this.state.stopData.Stop.Lat, this.state.stopData.Stop.Long)
            )] : []

        return (
            <GoogleMapWidget
                navigation={this.props.navigation}
                route={this.props.route}
                stopMarkers={stopMarkers}
                routePaths={[]}
            />
        );
    }
}

export default StopMapScreen;
