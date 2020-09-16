import React from "react";
import {Card} from "react-native-elements";
import {Text} from "../common/Themed";

function SearchTabTabsDescription() {
    return (
        <Card>
            <Card.Title>Tabs</Card.Title>
            <Card.Divider/>
            <Text>
                Below the searchbar is four tabs. These tabs act as filters for your search.
                {/*<br/>*/}
                {/*<ul>*/}
                {/*    <li>*/}
                All: The All tab will present you with everything remotely
                related to your search. Don't remember the entire Stop number? Type into the
                searchbar what you do remember and scroll through the contents presented to you
                to find the related Stop or Route/Service.
                {/*</li>*/}
                {/*<br/>*/}
                {/*<li>*/}
                Routes: The Routes tab will present you with every bus route
                remotely related to your search. For example, typing in "2" will present you
                with bus routes 112, 12, 120, 121, 12e, 2, 20...
                {/*</li>*/}
                {/*<br/>*/}
                {/*<li>*/}
                {/*    <strong>Stops:</strong>*/}
                The Stops tab will present you with every Stop remotely
                related to your search. For example, typing in "500" will present you with bus
                stops 1500, 2500, 3500, 4500, 5000, 5002...
                {/*</li>*/}
                {/*<br/>*/}
                {/*<li>*/}
                Exact: The exact tab will present you with everything that
                starts with your search query. For example, typing in "500" will present you
                with bus stops 5000, 5002, 5006, 5008. No bus routes start with "500" so none
                will be presented in the search. This is a faster, more precise method of
                finding a stop or bus service that you want.
                {/*</li>*/}
                {/*</ul>*/}
            </Text>
        </Card>
    );
}

export default SearchTabTabsDescription;
