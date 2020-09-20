import React, {FC} from "react";
import {RefreshControl, Route, ScrollView} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import SavedStopList from "../components/saved/SavedStopList";
import SavedServiceList from "../components/saved/SavedServiceList";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

const wait = (timeout: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

/**
 * This component is responsible for showing the user all of the stops and services that have been saved.
 *
 * Note, this list is obtained from local storage and does not try to fetch from the user account on component load.
 * This list will however be updated when the user clears any list.
 */
const SavedScreen: FC<Props> = (props) => {
    const [refreshing, setRefreshing] = React.useState(false);

    /**
     * Callback when screen refreshes.
     */
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(50).then(() => setRefreshing(false));
    }, []);

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        >
            <SavedStopList route={props.route} navigation={props.navigation}/>
            <SavedServiceList route={props.route} navigation={props.navigation}/>
        </ScrollView>
    );
}

export default SavedScreen;
