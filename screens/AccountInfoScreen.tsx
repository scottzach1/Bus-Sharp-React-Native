import {Route, StyleSheet} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import {Text, View} from "../components/styles/Themed";
import EditScreenInfo from "../components/styles/EditScreenInfo";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    doc: any | null,
    errorMessage: string | null,
}

class AccountInfoScreen extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            doc: null,
            errorMessage: null,
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Account Info</Text>
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

export default AccountInfoScreen;