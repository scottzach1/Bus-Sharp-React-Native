import React, {Component} from "react";
import {Card} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";
import {ActivityIndicator, Route} from "react-native";
import StopActionButton from "./ServiceActionButton";
import {Text, View} from "../styles/Themed";
import {getSavedServices, toggleSavedService} from "../../external/StorageManager";
import {UserContext} from "../../providers/UserProvider";

/**
 * Navigation: The navigation stack used to get to this component.
 * Route: The route currently taken to get to this component.
 * ServiceData: Data loaded from the local storage containing information about the current service in the perspective.
 * Code: The code used to identify this service from every other service.
 */
interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
    serviceData: any | null | undefined,
    code: string,
}

interface State {
    saved: boolean,
}

/**
 * ServiceInfo component renders a card to represent a Services information on the service perspective.
 */
class ServiceInfo extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            saved: false,
        }
    }

    /**
     * On component did mount, the data about the current service is loaded into this object such that is can be loaded
     * faster if the user is to manuever around the map.
     */
    async componentDidMount() {
        const resp = await getSavedServices();
        this.setState({
            saved: resp.data.includes(this.props.code),
        });
        if (resp.errorMessage) {
            // Don't notify the user.
        }
    }

    /**
     * Get the name of the Service on the ServicePerspective.
     */
    getServiceName() {
        if (!this.props.serviceData?.Name) return 'Unknown';
        else return this.props.serviceData.Name;
    }

    /**
     * Toggles the service from being saved/unsaved.
     */
    async toggleSaved() {
        const resp = await toggleSavedService(this.props.code, this.context);
        this.setState({
            saved: resp.data.state,
        })
    }

    /**
     * Renders the component in the following order:
     *  - Title
     *  - Divider
     *  - Code
     *  - ActionButton
     *  - if pressed: Action Sheet
     */
    render() {
        this.getServiceName()
        console.log(this.props.code)
        return (
            <View>
                <Card key={`stop-info-card`}>
                    <Card.Title>{this.getServiceName()}</Card.Title>
                    <Card.Divider/>
                    {this.props.serviceData ?
                        <View>
                            <Text key={`stop-info-code`}>
                                Code {this.props.code}
                            </Text>
                        </View>
                        : <ActivityIndicator/>}
                    <StopActionButton
                        serviceCode={this.props.code}
                        serviceName={this.getServiceName()}
                        saved={this.state.saved}
                        toggleSaved={() => this.toggleSaved()}
                        navigation={this.props.navigation}
                        route={this.props.route}
                    />
                </Card>
            </View>
        );
    }
}

export default ServiceInfo;
