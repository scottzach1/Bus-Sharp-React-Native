import React, {Component} from "react";
import {StyleSheet} from "react-native";
import EditScreenInfo from "../components/styles/EditScreenInfo";
import {View, Text} from "../components/styles/Themed";

interface Props {
}

interface State {
}

/**
 * BROKEN ON MOBILE: Displays the latest Twitter feed by utilising `widget.js`.
 */
class TwitterScreen extends Component<Props, State> {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.subtitle}>TODO Twitter</Text>
                <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                <EditScreenInfo path="/screens/TabOneScreen.tsx" />
            </View>
        );
    }
}

/**
 * Styles unique to the Twitter screen.
 */
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


export default TwitterScreen;
