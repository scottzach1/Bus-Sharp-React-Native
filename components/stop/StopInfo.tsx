import React, {Component} from "react";
import {Card} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";
import {ActivityIndicator} from "react-native";
import StopActionSheet from "./StopActionSheet";
import {View, Text} from "../styles/Themed";

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

        this.state = {
        }
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
        return (
            <View>
                <Card key={`stop-info-card`}>
                    <Card.Title>{this.getStopName()}</Card.Title>
                    <Card.Divider/>
                    {this.props.stopData ?
                        <View>
                            <Text key={`stop-info-code`}>
                                Code {this.props.code}
                            </Text>
                            <Text key={`stop-info-fare-zone`}>
                                Faze zone {this.getFareZone()}
                            </Text>
                            <Text key={`stop-info-notice-count`}>
                                Notices {this.getNumberNotices()}
                            </Text>
                        </View>
                        : <ActivityIndicator/>}
                        <StopActionSheet stopCode={this.props.code} stopName={this.getStopName()}/>
                </Card>
            </View>
        );
    }
}

export default StopInfo;
