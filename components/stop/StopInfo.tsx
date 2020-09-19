import React, {Component} from "react";
import {Card} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";
import {ActivityIndicator, Route} from "react-native";
import StopActionButton from "./StopActionButton";
import {Text, View} from "../styles/Themed";
import {getSavedStops, toggleSavedStop} from "../../external/StorageManager";
import {UserContext} from "../../providers/UserProvider";

interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
    stopData: any | null | undefined,
    code: string,
}

interface State {
    saved: boolean,
}

class StopInfo extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            saved: false,
        }
    }

    async componentDidMount() {
        const resp = await getSavedStops();
        this.setState({
            saved: resp.data.includes(this.props.code),
        });
        if (resp.errorMessage) {
            // Don't notify the user.
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

    async toggleSaved() {
        const resp = await toggleSavedStop('stop', this.context);
        this.setState({
            saved: resp.data.state,
        })
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
                    <StopActionButton
                        stopCode={this.props.code}
                        stopName={this.getStopName()}
                        saved={this.state.saved}
                        toggleSaved={() => this.toggleSaved()}
                        navigation={this.props.navigation}
                        route={this.props.route}
                    />
                </Card>
            </View>
        );
    }
}

export default StopInfo;
