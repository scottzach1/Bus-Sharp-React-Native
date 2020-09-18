import React, {Component} from "react";
import {Route, ScrollView} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Card} from "react-native-elements";
import ScheduleJourney from "../components/schedule/ScheduleJourney";
import ScheduleButton from "../components/schedule/ScheduleButton";
import ErrorCard from "../components/common/ErrorCard";
import ScheduleInfo from "../components/schedule/ScheduleInfo";
import {NotificationContext} from "../providers/NotificationProvider";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    walkTime: number,
    arrivalTime: Date | null,
    errorMessage: string | null,
    stopCode: string | null,
    serviceCode: string | null,
}

class ScheduleScreen extends Component<Props, State> {
    static contextType = NotificationContext;

    constructor(props: Readonly<Props>) {
        super(props);

        let date, stopCode, serviceCode, error;
        try {
            date = new Date(this.props.route.params.date);
            stopCode = this.props.route.params.stopCode;
            serviceCode = this.props.route.params.serviceCode;
            error = null;
        } catch (e) {
            date = null;
            error = `Invalid URL parameter: ${e.message}`;
        }

        this.state = {
            walkTime: 5,
            arrivalTime: date,
            errorMessage: error,
            stopCode: stopCode,
            serviceCode: serviceCode,
        }
    }

    setWalkTime(mins: number) {
        this.setState({walkTime: mins});
    }

    doSchedule() {
        if (this.context)
            this.context.scheduleNotif();
        else
            this.setState({errorMessage: 'WHELP'});
    }

    render() {
        return (
            <ScrollView>
                <Card>
                    <ScheduleInfo
                        stopCode={this.state.stopCode}
                        serviceCode={this.state.serviceCode}
                        setError={(e) => this.setState({errorMessage: e})}
                    />
                    <Card.Divider/>
                    {this.state.arrivalTime &&
                    <ScheduleJourney
                        arrivalTime={this.state.arrivalTime}
                        walkTime={this.state.walkTime}
                        setWalkTime={(v) => this.setWalkTime(v)}
                    />}
                    <Card.Divider/>
                    <ScheduleButton onPress={() => this.doSchedule()}/>
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
