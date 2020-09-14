import React, {Component} from "react";
import {Card, ThemeProvider} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";
import {View} from "../Themed";
import {ActivityIndicator} from "react-native";
import ServiceListContainer from "../services/ServiceListContainer";

const theme = {
    colors: {
        platform: {
            "default": {
                "grey": "#FFF"
            }
        }
    }
};

interface Props {
    navigation: StackNavigationProp<any>,
    stopData: any | null | undefined,
    errorMessage: string | null,
}

interface State {
    showHours: boolean,
}

class StopTimetable extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            showHours: true,
        }
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <View style={{height: '100%'}}>
                    <Card>
                        <Card.Title>Upcoming Services</Card.Title>
                        <Card.Divider/>
                        {this.props.stopData ?
                            <ServiceListContainer
                                navigation={this.props.navigation}
                                stopData={this.props.stopData}
                                showHours={true}
                            /> :
                            <ActivityIndicator/>}
                    </Card>
                </View>
            </ThemeProvider>
        );
    }
}

export default StopTimetable;