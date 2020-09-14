import React, {Component} from "react";
import {Card} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";
import {Text, View} from "../Themed";
import {ActivityIndicator} from "react-native";

interface Props {
    navigation: StackNavigationProp<any>,
    stopData: any | null | undefined,
    code: string,
    errorMessage: string | null,
}

interface State {
}

class StopInfo extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {}
    }

    getStopName() {
        if (!this.props.stopData?.Stop?.Name) return 'Unknown';
        else return this.props.stopData.Stop.Name;
    }

    getFareZone() {
        if (!this.props.stopData?.Stop?.Farezone) return 'Unknown';
        else return this.props.stopData.Stop.Farezone;
    }

    getNumberNotices() {
        if (!this.props.stopData?.Notices) return 'Unknown';
        else return this.props.stopData.Notices.length;
    }

    render() {
        console.log('info', this.props.stopData);

        return (
            <Card>
                <Card.Title>{this.getStopName()}</Card.Title>
                <Card.Divider/>
                {this.props.stopData ?
                    <View>
                        <Text>Code {this.props.code}</Text>
                        <Text>Faze zone {this.getFareZone()}</Text>
                        <Text>Notices {this.getNumberNotices()}</Text>
                    </View>
                    : <ActivityIndicator/>}
            </Card>
        );
    }
}

export default StopInfo;