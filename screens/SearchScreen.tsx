import React, {Component} from "react";
import {Button, StyleSheet, Text, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {getAllServices, getAllStops} from "../external/StorageManager";

interface Props {
    navigation: StackNavigationProp<any>,
}

interface State {
    stopsData: any | null,
    servicesData: any | null,
    stopsErrorMessage: string | null,
    servicesErrorMessage: string | null,
}

class SearchScreen extends Component<Props, State> {

    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            stopsData: undefined,
            servicesData: undefined,
            stopsErrorMessage: null,
            servicesErrorMessage: null,
        }
    }

    componentDidMount() {
        if (!this.state.stopsData) {
            getAllStops().then((resp) => {
                this.setState({
                    stopsData: resp.data,
                    stopsErrorMessage: resp.errorMessage,
                })
            });
        }

        if (!this.state.servicesData) {
            getAllServices().then((resp) => {
                this.setState({
                    servicesData: resp.data,
                    servicesErrorMessage: resp.errorMessage
                })
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Search!</Text>
                <Button
                    title={"Visit Service Screen"}
                    onPress={() => this.props.navigation.navigate("SearchServiceScreen", {
                        code: '21',
                    })}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default SearchScreen;