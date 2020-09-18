import React, {Component} from "react";
import {getAllServices, getAllStops} from "../../external/StorageManager";
import {Card} from "react-native-elements";
import {Text, View} from "../styles/Themed";

interface Props {
    stopCode: string | null,
    serviceCode: string | null,
    setError: (error: string) => void,
}

interface State {
    stopData: any | null,
    serviceData: any | null,
}

class ScheduleInfo extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            stopData: undefined,
            serviceData: undefined,
        }
    }

    componentDidMount() {
        const stopCode = this.props.stopCode;

        if (stopCode) {
            getAllStops().then((resp) => {
                this.setState({
                    stopData: resp.data[stopCode]
                });
                if (resp.errorMessage) {
                    this.props.setError(resp.errorMessage);
                }
            });
        }

        const serviceCode = this.props.serviceCode;

        if (serviceCode) {
            getAllServices().then((resp) => {
                this.setState({
                    serviceData: resp.data[serviceCode],
                });
                if (resp.errorMessage) {
                    this.props.setError('resp.errorMessage');
                }
            });
        }
    }

    getServiceName() {
        const serviceInfo = this.state.serviceData;
        let serviceName;

        if (!serviceInfo || !serviceInfo.route_long_name)
            serviceName = 'Unkown'
        else {
            // Extract Name
            serviceName = serviceInfo.route_long_name.split('-');
            // Keep only first and last destination.
            serviceName = [
                serviceName[0],
                serviceName[serviceName.length-1]
            ];
            // Join into string.
            serviceName = serviceName.join(' - ')
        }

        return `${this.props.serviceCode} - ${serviceName}`;
    }

    getStopName() {
        const stopInfo = this.state.stopData;
        let stopName;

        if (!stopInfo || !stopInfo.stop_name)
            stopName = 'Unknown'
        else
            stopName = stopInfo.stop_name;

        return `From ${stopName} (${this.props.stopCode})`;
    }


    render() {
        return (
            <View>
                <Card.Title>
                    {this.getServiceName()}
                </Card.Title>
                <Text style={{fontSize: 15}}>
                    {this.getStopName()}
                </Text>
            </View>
        );
    }
}

export default ScheduleInfo;
