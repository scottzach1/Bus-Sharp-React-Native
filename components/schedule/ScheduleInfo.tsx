import React, {Component} from "react";
import {Card} from "react-native-elements";
import {Text, View} from "../styles/Themed";

interface Props {
    stopCode: string | null,
    stopName: string | null,
    serviceCode: string | null,
    serviceName: string | null,
    setError: (error: string) => void,
}

interface State {
}

class ScheduleInfo extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {}
    }

    render() {
        return (
            <View>
                <Card.Title>
                    {`${this.props.serviceCode} - ${this.props.serviceName}`}
                </Card.Title>
                <Text style={{fontSize: 15}}>
                    {`From ${this.props.stopName} (${this.props.stopCode})`}
                </Text>
            </View>
        );
    }
}

export default ScheduleInfo;
