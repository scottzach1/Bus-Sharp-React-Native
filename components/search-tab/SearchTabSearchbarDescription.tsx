import React from "react";
import {Text} from "react-native";
import {Card} from "react-native-elements";

function SearchTabSearchbarDescriptionCard() {
    return (
        <Card>
            <Card.Title>Search Bar</Card.Title>
            <Card.Divider/>
            <Text>
                Using the searchbar above, enter Stop numbers of Bus Route/Service
                numbers.
                {/*<br/><br/>*/}
                You will be presented with everything related to your search query (depending on
                the filters you have in place).
                {/*<br/><br/>*/}
                Clicking on one of the links presented to you will take you to a page with all the
                information you will need about the Stop or Route/Service.
            </Text>
        </Card>
    );
}

export default SearchTabSearchbarDescriptionCard;
