import React, {FC} from "react";
import {Badge, Icon, ListItem} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";
import {navigateToMetlink, navigateToSchedule} from "../../navigation/LinkingConfiguration";
import {Route} from "react-native";
import {Text} from "../styles/Themed";

interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
    code: string,
    name: string,
    isStop: boolean,
    isLive?: boolean,
    isFavourite: boolean,
    toggleFavourite: () => void,
    timeRemaining?: string,
    originStopCode?: string,
    arrivalTime?: Date | null,
}

/**
 * This component is responsible for displaying any Metlink entry within a list throughout the app.
 *
 * The requirements for this component vary depending on the use case so there are a lot of props. It is not recommended
 * to interface with this component directly. Instead, checkout the `ServiceListContainer` and `StopListContainer` props
 * that provide a more streamlined experience.
 *
 * @param props - `Props` interface defined above.
 */
const MetlinkListItem: FC<Props> = (props) => {

    /**
     * Attempts to redirect the user to the schedule screen passing the appropriate parameters. If insufficient
     * information is present, then this will simply not do anything.
     */
    const doSchedule = () => {
        if (!props.arrivalTime || !props.originStopCode) return;

        navigateToSchedule(props.originStopCode, props.code, props.arrivalTime, props.navigation, props.route);
    }

    // Attempt to align text within the list entries.
    let badgeSpacing = " ".repeat(Math.max(0, 4 - props.name.length));

    // Render styled list item.
    return (
        <ListItem
            onPress={() => navigateToMetlink(props.code, props.isStop, props.navigation, props.route)}
            bottomDivider
        >
            {/* Badge containing stop / service code. */}
            <Badge status={(props.isStop) ? "primary" : "warning"} value={props.code}/>
            {/* List Item's text, containing name. */}
            <ListItem.Content>
                <ListItem.Title>{badgeSpacing}{props.name}</ListItem.Title>
                {/* Additionally, optionally the time remaining too. */}
                {props.timeRemaining &&
                <Text>{badgeSpacing}{props.timeRemaining}</Text>}
            </ListItem.Content>
            {/* Live badge at end if relevant. */}
            {props.isLive && <Badge status={"success"} value={"live"}/>}
            {/* Favourite icon at end. */}
            <Icon
                name={(props.isFavourite) ? "star" : "star-outline"}
                type={"material-community"}
                onPress={() => props.toggleFavourite()}
            />
            {/* Schedule button at end if relevant. */}
            {(props.arrivalTime && !props.isStop) &&
            <Icon
                onPress={() => doSchedule()}
                name={'timer'}
                type={'material-community'}
            />}
        </ListItem>
    );
}

export default MetlinkListItem;
