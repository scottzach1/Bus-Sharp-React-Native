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

/**
 * This screen is responsible for handling any time scheduling. A schedule will represent a given time and stop where a
 * service will intersect. These are represented via URL props as `date`, `stopCode` and `serviceCode` respectively.
 *
 * Within this screen, the user will be provided a break down of the journey and required leave time estimated by using
 * Google Maps trip planning API. The user is then able to further tweak this before they schedule a reminder in the
 * form of a local push notification.
 */
class ScheduleScreen extends Component<Props, State> {
    // We want to utilise the applications `NotificationService` exposed by the apps `NotificationContext` context.
    static contextType = NotificationContext;

    /**
     * Initializes the Schedule Screen and parses the required URL props into state.
     *
     * @param props - exposed by React Navigation.
     */
    constructor(props: Readonly<Props>) {
        super(props);

        // Parse URL props.
        let date, stopCode, serviceCode, error;
        try {
            date = new Date(this.props.route.params.date);
            stopCode = this.props.route.params.stopCode;
            serviceCode = this.props.route.params.serviceCode;
            // Success
            error = null;
        } catch (e) {
            date = null;
            // Error Encountered.
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

    /**
     * When component loads, load the information relevant to the stop and service from local storage cache using the
     * StorageManager.
     */
    componentDidMount() {
        const stopCode = this.state.stopCode;

        if (stopCode) {
            getAllStops().then((resp) => {
                this.setState({
                    // Extract only the information for the specific stop.
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
                    // Extract only the information for the specific service.
                    serviceInfo: resp.data[serviceCode],
                });
                if (resp.errorMessage) {
                    this.setState({errorMessage: resp.errorMessage});
                }
            });
        }
    }

    /**
     * Sets the number of minutes delegated for travel time within the local stage. Helper method for child components.
     * @param minutes - number of travel minutes to set within local state.
     */
    setWalkTime(minutes: number) {
        this.setState({walkTime: minutes});
    }

    /**
     * Attempts to schedule a local push notification by utilising the NotificationHandler and NotificationService.
     * These are proxied via the context stored within NotificationProvider. The user will be notified of any success
     * / error encountered by utilising the local states. These are rendered within Success and Error cards.
     */
    doSchedule() {
        const arrivalTime = this.state.arrivalTime;
        // Check notification context loaded and valid params are present.
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

    /**
     * Parses and re-formats the name of the service to be presented. This will return 'Unknown' if the Service cannot
     * be found within Local Storage.
     */
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

    /**
     * Parses the name of the stop to be presented. This will return 'Unknown' if the stop cannot be found within
     * Local Storage.
     */
    getStopName() {
        const stopInfo = this.state.stopInfo;
        return (stopInfo && stopInfo.stop_name) ? stopInfo.stop_name : 'Unknown';
    }

    /**
     * Renders the Schedule Screen.
     */
    render() {
        return (
            <ScrollView>
                {/* Main View */}
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
                {/* Notify Success / Failure */}
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
