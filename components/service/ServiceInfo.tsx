import React, {Component} from "react";
import {Card} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";
import {ActivityIndicator, Route} from "react-native";
import StopActionButton from "./ServiceActionButton";
import {Text, View} from "../styles/Themed";
import {getSavedServices, toggleSavedService} from "../../external/StorageManager";
import {UserContext} from "../../providers/UserProvider";

interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
    serviceData: any | null | undefined,
    code: string,
}

interface State {
    saved: boolean,
}

class ServiceInfo extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            saved: false,
        }
    }

    async componentDidMount() {
        const resp = await getSavedServices();
        this.setState({
            saved: resp.data.includes(this.props.code),
        });
        if (resp.errorMessage) {
            // Don't notify the user.
        }
    }

    getServiceName() {
        if (!this.props.serviceData?.Name) return 'Unknown';
        else return this.props.serviceData.Name;
    }

    async toggleSaved() {
        const resp = await toggleSavedService(this.props.code, this.context);
        this.setState({
            saved: resp.data.state,
        })
    }

    render() {
        this.getServiceName()
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
