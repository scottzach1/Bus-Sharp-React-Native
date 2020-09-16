import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import {getSavedStops, toggleSavedStop} from "../../external/StorageManager";
import MetlinkListItem from "../common/MetlinkListItem";
import {Route, View} from "react-native";

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

class StopListContainer extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            savedStops: undefined,
        };
    }

    componentDidMount() {
        getSavedStops().then((resp) => {
            this.setState({savedStops: resp.data});
        });
    }

    checkFavourite(stopCode: string) {
        if (!this.state?.savedStops) return false;
        else return this.state.savedStops.includes(stopCode);
    }

    async toggleFavourite(stopCode: string) {
        const savedStops = (await toggleSavedStop(stopCode)).data.savedStops;
        this.setState({savedStops: savedStops});
        if (this.props.setSavedStops) await this.props.setSavedStops(savedStops);
    }

    generateStops() {
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
            />
        ));
    }

    render() {
        return <View>{this.generateStops()}</View>;
    }
}

export class StopListProp {
    public name: string;
    public code: string;

    constructor(name: string, code: string) {
        this.name = name;
        this.code = code;
    }
}

export default StopListContainer;