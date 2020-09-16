import React, {Component} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import {Route, StyleSheet} from "react-native";
import EditScreenInfo from '../components/styles/EditScreenInfo';
import {Text, View} from '../components/styles/Themed';


interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
}

class AccountLoginScreen extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>TODO Account Login</Text>
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});


export default AccountLoginScreen;