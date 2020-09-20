import {StackScreenProps} from '@react-navigation/stack';
import * as React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {RootStackParamList} from '../navigation/tabParameters';
import {Text, View} from "../components/styles/Themed";

/**
 * This screen handles notifying the users when they tried to enter a bad path. The valid paths can be observed within
 * the schema specified within `navigation/LinkingConfiguration`.
 *
 * @param navigation - component passed via React Native Router (see `RootNavigator()` within `index.tsx`);
 */
export default function NotFoundScreen({navigation}: StackScreenProps<RootStackParamList, 'NotFound'>) {
    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>This screen doesn't exist.</Text>
            <TouchableOpacity onPress={() => navigation.replace('Root')} style={styles.link}>
                <Text style={styles.linkText}>Go to home screen!</Text>
            </TouchableOpacity>
        </View>
    );
}

/**
 * Stylesheet specific to the Not Found screen.
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
});
