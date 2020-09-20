import React, {Component} from "react";
import {Route, ScrollView} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Card} from "react-native-elements";
import ScheduleJourney from "../components/schedule/ScheduleJourney";
import ScheduleButton from "../components/schedule/ScheduleButton";
import ErrorCard from "../components/common/ErrorCard";
import ScheduleInfo from "../components/schedule/ScheduleInfo";
import {NotificationContext} from "../providers/NotificationProvider";
import {formatDistanceToNow, sub} from "date-fns";
import {getAllServices, getAllStops} from "../external/StorageManager";
import SuccessCard from "../components/common/SuccessCard";
import {getEstimatedWalkTime} from "../external/TimeEstimater";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    walkTime: number,
    arrivalTime: Date | null,
    stopCode: string | null,
    stopInfo: any | null,
    serviceCode: string | null,
    serviceInfo: any | null,
    errorMessage: string | null,
    successMessage: string | null,
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
            stopCode: stopCode,
            stopInfo: null,
            serviceCode: serviceCode,
            serviceInfo: null,
            errorMessage: error,
            successMessage: null,
        }
    }

    componentDidMount() {
        const stopCode = this.state.stopCode;

        if (stopCode) {
            getAllStops().then((resp) => {
                this.setState({
                    stopInfo: resp.data[stopCode]
                });
                if (resp.errorMessage) {
                    this.setState({errorMessage: resp.errorMessage});
                }
            });
        }

        const serviceCode = this.state.serviceCode;

        if (serviceCode) {
            getAllServices().then((resp) => {
                this.setState({
                    serviceInfo: resp.data[serviceCode],
                });
                if (resp.errorMessage) {
                    this.setState({errorMessage: resp.errorMessage});
                }
            });
        }
    }

    setWalkTime(mins: number) {
        console.log({mins})
        if (mins === this.state.walkTime) return;
        this.setState({walkTime: mins});
    }

    doSchedule() {
        const arrivalTime = this.state.arrivalTime;
        if (this.context && arrivalTime && this.state.stopCode && this.state.serviceCode) {
            const leaveDate = sub(arrivalTime, {
                minutes: this.state.walkTime,
            });
            this.context.scheduleServiceNotification({
                date: leaveDate,
                walkTime: this.state.walkTime,
                stopCode: this.state.stopCode,
                stopName: this.getStopName(),
                serviceCode: this.state.serviceCode,
                serviceName: this.getServiceName(),
            });
            this.setState({successMessage: `Success! You will be reminded in ${formatDistanceToNow(leaveDate)}`})
        } else if (this.context) {
            this.setState({errorMessage: `Failed, data hasn't fully loaded yet`});
        } else
            this.setState({errorMessage: `Not enough information to schedule event`})
    }

    getServiceName() {
        const serviceInfo = this.state.serviceInfo;

        if (!serviceInfo || !serviceInfo.route_long_name)
            return 'Unknown'

        // Extract Name
        let serviceName = serviceInfo.route_long_name.split('-');
        // Keep only first and last destination.
        serviceName = [
            serviceName[0],
            serviceName[serviceName.length - 1]
        ];
        // Join into string.
        return serviceName.join(' - ')
    }

    getStopName() {
        const stopInfo = this.state.stopInfo;
        return (stopInfo && stopInfo.stop_name) ? stopInfo.stop_name : 'Unknown';
    }

    render() {
        getEstimatedWalkTime(this.state.stopInfo, this.setWalkTime.bind(this)).then()

        return (
            <ScrollView>
                <Card>
                    <ScheduleInfo
                        stopCode={this.state.stopCode}
                        stopName={this.getStopName()}
                        serviceCode={this.state.serviceCode}
                        serviceName={this.getServiceName()}
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
                <SuccessCard
                    successMessage={this.state.successMessage}
                    clearMessage={() => this.setState({successMessage: null})}
                />
            </ScrollView>
        );
    }
}

export default ScheduleScreen;
