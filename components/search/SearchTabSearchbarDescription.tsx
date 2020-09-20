import React from "react";
import {Card, Text} from "react-native-elements";
import {StyleSheet} from "react-native";

/**
 * SearchTabSearchBarDescriptionCard renders a card with a description of the purpose of the search bar. How to use it,
 * with examples.
 * @constructor
 */
function SearchTabSearchbarDescriptionCard() {
    return (
        <Card>
            <Card.Title style={styles.title}>Search Bar</Card.Title>
            <Card.Divider/>
            <Text>
                Using the searchbar above, enter Stop numbers of Bus Route/Service
                numbers. {"\n"} {"\n"}
                You will be presented with everything related to your search query (depending on
                the filters you have in place). {"\n"} {"\n"}
                Clicking on one of the links presented to you will take you to a page with all the
                information you will need about the Stop or Route/Service.
            </Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    title: {fontSize: 30},
})

export default SearchTabSearchbarDescriptionCard;
