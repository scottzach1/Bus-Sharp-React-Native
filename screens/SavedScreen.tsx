import React, {Component} from "react";
import {Route, StyleSheet} from "react-native";
import EditScreenInfo from "../components/styles/EditScreenInfo";
import {Text, View} from "../components/styles/Themed";
import {StackNavigationProp} from "@react-navigation/stack";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
}

class SavedScreen extends Component<Props, State> {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.subtitle}>TODO Saved</Text>
                <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
                <EditScreenInfo path="/screens/TabOneScreen.tsx"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});


export default SavedScreen;
