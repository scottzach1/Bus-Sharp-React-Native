import React, {Component} from "react";
import {Card} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";

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

    render() {
        return (
            <Card>
                <Card.Title>Stop {this.props.code}</Card.Title>
            </Card>
        );
    }
}

export default StopInfo;