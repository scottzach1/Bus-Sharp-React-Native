import React, {Component} from "react";
import {ActivityIndicator, Route, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {getAllStops, getSavedStops} from "../../external/StorageManager";
import {Card} from "react-native-elements";
import StopListContainer, {StopListProp} from "./StopListContainer";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    savedStops: string[] | undefined,
    allStops: any | undefined,
    errorMessage: string | null,
}

class SavedStopList extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            savedStops: undefined,
            allStops: undefined,
            errorMessage: null,
        }
    }

    componentDidMount() {
        getAllStops().then((resp) =>
            this.setState({
                errorMessage: resp.errorMessage,
                allStops: resp.data
            }));

        getSavedStops().then((resp) =>
            this.setState({
                errorMessage: resp.errorMessage,
                savedStops: resp.data
            }));
    }

    updateSavedStops(savedStops: string[]) {
        this.setState({savedStops: savedStops});
    }

    generateStops() {
        if (!this.state.allStops || !this.state.savedStops) return [];

        let containerProps: StopListProp[] = [];
        const allStops = this.state.allStops;

        for (let stopCode of this.state.savedStops) {
            const stopEntry: any | null = (allStops.hasOwnProperty(stopCode)) ? allStops[stopCode] : null;
            const stopName = (stopEntry) ? stopEntry.stop_name : 'Unknown';

            containerProps.push(new StopListProp(stopName, stopCode));
        }

        return containerProps;
    }

    render() {
        return (
            <View>
                <Card>
                    <Card.Title>Saved Stops</Card.Title>
                    <Card.Divider/>
                    {(this.state.savedStops && this.state.allStops) ?
                        <StopListContainer
                            stops={this.generateStops()}
                            setSavedStops={(savedStops) => this.updateSavedStops(savedStops)}
                            navigation={this.props.navigation}
                            route={this.props.route}
                        />
                        :
                        <ActivityIndicator/>}
                </Card>
            </View>
        );
    }
}

export default SavedStopList;