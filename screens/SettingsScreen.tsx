import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {fetchServiceData, fetchStopData} from "../external/StorageManager";

interface Props {
}

interface State {
}

class SettingsScreen extends Component<Props, State> {

    componentDidMount() {
        fetchStopData('7909').then((res) => console.log('stop', res));
        fetchServiceData('21').then((res) => console.log('service', res));
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Settings!</Text>
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

export default SettingsScreen;