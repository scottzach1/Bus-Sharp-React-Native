import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import {getSavedStops, toggleSavedStop} from "../../external/StorageManager";
import MetlinkListItem from "../common/MetlinkListItem";

interface Props {
    navigation: StackNavigationProp<any>,
    stops: StopListProp[],
}

interface State {
    savedStops: string[] | undefined,
}

class ServiceListContainer extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.setState({
            savedStops: undefined,
        });
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

    toggleFavourite(stopCode: string) {
        toggleSavedStop(stopCode)
            .then((resp) => this.setState({savedStops: resp.data.savedStops}))
            .catch((resp) => this.setState({savedStops: resp.data.savedStops}));
    }

    generateStops() {
        if (!this.props.stops) return undefined;

        let stops: StopListProp[] = this.props.stops;

        return stops.map((stop) => (
            <MetlinkListItem
                navigation={this.props.navigation}
                code={stop.code}
                name={stop.name}
                isStop={true}
                isFavourite={this.checkFavourite(stop.code)}
                toggleFavourite={() => this.toggleFavourite(stop.code)}
            />
        ))
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