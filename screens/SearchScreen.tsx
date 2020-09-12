import React, {Component} from "react";
import {Button, StyleSheet, Text, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";

interface Props {
    navigation: StackNavigationProp<any>,
}

interface State {
}

class SearchScreen extends Component<Props, State> {
    render() {
        return (
            <View style={styles.container}>
                <Text>Search!</Text>
                <Button
                    title={"Visit Service Screen"}
                    onPress={() => this.props.navigation.navigate("service", {
                        code: '7909'
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