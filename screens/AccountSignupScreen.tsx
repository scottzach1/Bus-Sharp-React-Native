import {StackNavigationProp} from "@react-navigation/stack";
import {Route, StyleSheet} from "react-native";
import React, {Component} from "react";
import {View, Text} from "../components/styles/Themed";
import EditScreenInfo from "../components/styles/EditScreenInfo";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
}

class AccountSignupScreen extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>TODO Account Signup</Text>
                <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                <EditScreenInfo path="/screens/TabOneScreen.tsx" />
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


export default AccountSignupScreen;