import React, {Component} from "react";
import {Route, ScrollView} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Card} from "react-native-elements";
import ScheduleJourney from "../components/schedule/ScheduleJourney";
import ScheduleButton from "../components/schedule/ScheduleButton";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    walkTime: number,
}

class ScheduleScreen extends Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            walkTime: 5,
        }
    }

    setWalkTime(mins: number) {
        this.setState({walkTime: mins});
    }

    render() {
        return (
            <ScrollView>
                <Card>
                    <Card.Title>
                        Schedule a Reminder
                    </Card.Title>
                    <ScheduleJourney
                        arrivalTime={new Date()}
                        walkTime={this.state.walkTime}
                        setWalkTime={(v) => this.setWalkTime(v)}
                    />
                    <Card.Divider/>
                    <ScheduleButton onPress={() => {}}/>
                </Card>
            </ScrollView>
        );
    }
}

export default ScheduleScreen;
