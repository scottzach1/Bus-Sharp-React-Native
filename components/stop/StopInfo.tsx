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
    stopInfo: any | null | undefined,
    code: string,
}

interface State {
    saved: boolean,
}

/**
 * This component represents a card containing the different information about a given stop. This component also
 * encompasses the stop action button which can be used to trigger a bottom sheet of actions.
 *
 * The information includes the stops name, code and fare zone.
 */
class StopInfo extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            saved: false,
        }
    }

    /**
     * Gets saved stop data to check whether this stop is saved.
     */
    async componentDidMount() {
        const resp = await getSavedStops();
        this.setState({
            saved: resp.data.includes(this.props.code),
        });
        if (resp.errorMessage) {
            // Don't notify the user.
        }
    }

    /**
     * Extracts the stop name from the stop info prop.
     */
    getStopName() {
        if (!this.props.stopInfo?.Stop?.Name) return 'Unknown';
        else return this.props.stopInfo.Stop.Name;
    }

    /**
     * Extracts the fare zone from the stop info prop.
     */
    getFareZone() {
        if (!this.props.stopInfo?.Stop?.Farezone) return 'Unknown';
        else return this.props.stopInfo.Stop.Farezone;
    }

    /**
     * Extracts the notice count from the stop info prop.
     */
    getNumberNotices() {
        if (!this.props.stopInfo?.Notices) return 'Unknown';
        else return this.props.stopInfo.Notices.length;
    }

    /**
     * Toggles the saved status within local storage, also updating local state.
     */
    async toggleSaved() {
        const resp = await toggleSavedStop('stop', this.context);
        this.setState({
            saved: resp.data.state,
        })
    }

    /**
     * Renders a card containing the stop information as well as the stop actions button (triggers action sheet).
     */
    render() {
        return (
            <View>
                <Card key={`stop-info-card`}>
                    <Card.Title>{this.getStopName()}</Card.Title>
                    <Card.Divider/>
                    {this.props.stopInfo ?
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
