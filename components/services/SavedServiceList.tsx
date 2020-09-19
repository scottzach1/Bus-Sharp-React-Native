import {ActivityIndicator, Route, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import {getAllServices, getSavedServices} from "../../external/StorageManager";
import ServiceListContainer, {ServiceListProp} from "./ServiceListContainer";
import {Card} from "react-native-elements";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    savedServices: string[] | undefined,
    allServices: any | undefined,
    errorMessage: string | null,
}

class SavedServiceList extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            savedServices: undefined,
            allServices: undefined,
            errorMessage: null,
        }
    }

    componentDidMount() {
        getAllServices().then((resp) =>
            this.setState({
                errorMessage: resp.errorMessage,
                allServices: resp.data
            }));

        getSavedServices().then((resp) =>
            this.setState({
                errorMessage: resp.errorMessage,
                savedServices: resp.data
            }));
    }

    updateSavedServices(savedServices: string[]) {
        this.setState({savedServices: savedServices});
    }

    generateServices() {
        if (!this.state.allServices || !this.state.savedServices) return []

        let containerProps: ServiceListProp[] = [];
        const allServices = this.state.allServices;

        for (let serviceCode of this.state.savedServices) {
            const serviceEntry: any | null = (allServices.hasOwnProperty(serviceCode)) ? allServices[serviceCode] : null;
            const serviceName = (serviceEntry) ? serviceEntry.route_long_name : 'Unknown';

            containerProps.push(new ServiceListProp(serviceName, serviceCode));
        }

        return containerProps;
    }

    render() {
        return (
            <View>
                <Card>
                    <Card.Title>Saved Services</Card.Title>
                    <Card.Divider/>
                    {(this.state.savedServices && this.state.allServices) ?
                        <ServiceListContainer
                            route={this.props.route}
                            navigation={this.props.navigation}
                            services={this.generateServices()}
                            setSavedServices={(savedServices) => this.updateSavedServices(savedServices)}
                        /> :
                        <ActivityIndicator/>}
                </Card>
            </View>
        )
    }
}

export default SavedServiceList;
