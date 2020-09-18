import React, {Component} from "react";
import {Route, ScrollView} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Card} from "react-native-elements";
import ScheduleJourney from "../components/schedule/ScheduleJourney";
import ScheduleButton from "../components/schedule/ScheduleButton";
import ErrorCard from "../components/common/ErrorCard";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    walkTime: number,
    arrivalTime: Date | null,
    errorMessage: string | null,
}

class ScheduleScreen extends Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);

        let date, error;
        try {
            date = new Date(this.props.route.params.date);
            error = null;
        } catch (e) {
            date = null;
            error = 'Invalid date parameter';
        }

        this.state = {
            walkTime: 5,
            arrivalTime: date,
            errorMessage: error,
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
                    {this.state.arrivalTime &&
                    <ScheduleJourney
                        arrivalTime={this.state.arrivalTime}
                        walkTime={this.state.walkTime}
                        setWalkTime={(v) => this.setWalkTime(v)}
                    />}
                    <Card.Divider/>
                    <ScheduleButton onPress={() => {
                    }}/>
                </Card>
                <ErrorCard
                    errorMessage={this.state.errorMessage}
                    clearMessage={() => this.setState({errorMessage: null})}
                />
            </ScrollView>
        );
    }
}

export default ScheduleScreen;
