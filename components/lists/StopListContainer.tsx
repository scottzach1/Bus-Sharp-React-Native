import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import {getSavedStops, toggleSavedStop} from "../../external/StorageManager";
import {Route, View} from "react-native";
import MetlinkListItem from "./MetlinkListItem";

interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
    stops: StopListProp[],
    // Optional callback if the parent wants to be notified of any updates to saved stops.
    setSavedStops?: (stops: string[]) => void,
}

interface State {
    savedStops: string[] | undefined,
}

/**
 * This component provides a convenient wrapper to display a list of Metlink stops within a card.
 *
 * Within this component there are a variety of different helper methods to manage each of the underlying
 * `MetlinkListItem`'s (eg. Saved stop state). Information for each of the stops to be rendered is propagated
 * to this component via the class `StopListProp` defined at the bottom of the file and passed via the
 * prop `stops`
 *
 * Additionally there are other optional props that can passed if relevant to customise the appearance and of the
 * internal `MetlinkListItem`'s.
 */
class StopListContainer extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            savedStops: undefined,
        };
    }

    /**
     * Obtains the list of saved stops from local storage.
     */
    componentDidMount() {
        getSavedStops().then((resp) => {
            this.setState({savedStops: resp.data});
        });
    }

    /**
     * Checks whether a stop is within the saved stop (from local state). If this has not loaded, then this will
     * default to `false`.
     *
     * @param stopCode - to check whether saved.
     */
    checkFavourite(stopCode: string) {
        if (!this.state?.savedStops) return false;
        else return this.state.savedStops.includes(stopCode);
    }

    /**
     * Toggles the saved status of a given stop by stop code. The change is propagated to both the local storage
     * as well as any of the other `MetlinkListItem`'s within this container.
     *
     * @param stopCode - to toggle saved on.
     */
    async toggleFavourite(stopCode: string) {
        const savedStops = (await toggleSavedStop(stopCode)).data.savedStops;
        this.setState({savedStops: savedStops});
        if (this.props.setSavedStops) await this.props.setSavedStops(savedStops);
    }

    /**
     * Generates the list of `MetlinkListItem`'s to be rendered within this container. These will be styled based upon
     * the different props that have been passed to this component.
     */
    generateStopListItems() {
        if (!this.props.stops) return undefined;

        let stops: StopListProp[] = this.props.stops;

        return stops.map((stop) => (
            <MetlinkListItem
                code={stop.code}
                name={stop.name}
                isStop={true}
                isFavourite={this.checkFavourite(stop.code)}
                toggleFavourite={() => this.toggleFavourite(stop.code)}
                navigation={this.props.navigation}
                route={this.props.route}
                key={`list-item-${stop.code}-${stop.name}`}
            />
        ));
    }

    // Return view containing styled `MetlinkListItem`'s.
    render() {
        return <View>{this.generateStopListItems()}</View>;
    }
}

/**
 * Creates a new prop that represents a new stop entry within the StopListContainer.
 */
export class StopListProp {
    public name: string;
    public code: string;

    /**
     * Creates a new prop that represents a new stop entry within the StopListContainer.
     *
     * @param name - of the stop.
     * @param code - the stop code.
     */
    constructor(name: string, code: string) {
        this.name = name;
        this.code = code;
    }
}

export default StopListContainer;
