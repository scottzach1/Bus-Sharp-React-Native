import React, {Component} from "react";
import {Route, ScrollView} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import SavedStopList from "../components/saved/SavedStopList";
import SavedServiceList from "../components/saved/SavedServiceList";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
}

/**
 *
 */
class SavedScreen extends Component<Props, State> {
    render() {
        return (
            <ScrollView>
                <ScrollView>
                    <SavedStopList route={this.props.route} navigation={this.props.navigation}/>
                    <SavedServiceList route={this.props.route} navigation={this.props.navigation}/>
                </ScrollView>
            </ScrollView>
        );
    }
}

export default SavedScreen;
