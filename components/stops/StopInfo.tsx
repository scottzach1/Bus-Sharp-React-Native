import React, {Component} from "react";
import {Card, Text} from "react-native-elements";

interface Props {
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