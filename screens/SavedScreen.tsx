import React, {Component} from "react";
import {Route, ScrollView} from "react-native";
import SavedStopList from "../components/stops/SavedStopList";
import {StackNavigationProp} from "@react-navigation/stack";
import SavedServiceList from "../components/services/SavedServiceList";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
}

class SavedScreen extends Component<Props, State> {
    render() {
        return (
            <ScrollView>
                <SavedStopList route={this.props.route} navigation={this.props.navigation}/>
                <SavedServiceList route={this.props.route} navigation={this.props.navigation}/>
            </ScrollView>
        );
    }
}

export default SavedScreen;