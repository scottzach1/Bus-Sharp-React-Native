import React, {Component} from "react";
import {ActivityIndicator, Button, Route, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {getAllStops, getSavedStops, setSavedStops} from "../../external/StorageManager";
import {Card} from "react-native-elements";
import StopListContainer, {StopListProp} from "../lists/StopListContainer";
import {UserContext} from "../../providers/UserProvider";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    savedStops: string[] | undefined,
    allStops: any | undefined,
    errorMessage: string | null,
}

/**
 * This component provides a container to display all of the saved stops.
 *
 * Within this list, we also maintain the saved state of all of the stops. This means that when this state changes
 * the entire component re-renders updating all other containing Metlink list entries.
 */
class SavedStopList extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            savedStops: undefined,
            allStops: undefined,
            errorMessage: null,
        }
    }

    /**
     * Obtains all of the saved stops, as well as all of the stop information for children (eg, name and code).
     */
    componentDidMount() {
        getAllStops().then((resp) =>
            this.setState({
                errorMessage: resp.errorMessage,
                allStops: resp.data
            }));

        this.checkSavedServices().then();
    }

    /**
     * Checks local storage for any updates, only updating the component and re-rendering if there is an observed
     * difference.
     */
    async checkSavedServices() {
        getSavedStops().then((resp) => {
            const savedString = JSON.stringify(this.state.savedStops);
            const respString = JSON.stringify(resp.data);

            if (savedString === respString) return;

            this.setState({
                errorMessage: resp.errorMessage,
                savedStops: resp.data
            })});
    }

    /**
     * Updates the list of saved stops locally.
     *
     * NOTE: This acts as a callback received to refresh the other components instead of actually updating the local
     * storage (already handled by the `StopListContainer`).
     *
     * @param savedStops - the new value to set locally.
     */
    updateSavedStops(savedStops: string[]) {
        this.setState({savedStops: savedStops});
    }

    /**
     * Clears saved within local storage, updating this components state once the action completes.
     */
    async clearSavedStops() {
        await setSavedStops([], this.context)
        this.setState({savedStops: []});
    }

    /**
     * Generates the list of `MetlinkListItem`'s to be rendered within this container. These will be styled based upon
     * the different props that have been passed to this component.
     */
    generateStopListItems() {
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

    // Render styled card containing the stop list within a view with an optional error card.
    render() {
        // Check for any updates since last render.
        this.checkSavedServices().then();

        return (
            <View>
                <Card>
                    <Card.Title>Saved Stops</Card.Title>
                    <Button title={"Clear"} onPress={() => this.clearSavedStops()}/>
                    <Card.Divider/>
                    {(this.state.savedStops && this.state.allStops) ?
                        <StopListContainer
                            stops={this.generateStopListItems()}
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
