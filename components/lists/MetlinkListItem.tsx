import React, {Component} from "react";
import {Badge, Icon, ListItem} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";
import {navigateToMetlink} from "../../navigation/LinkingConfiguration";
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
    arrivalTime?: Date | null,
}

interface State {
    saved: boolean,
}

class MetlinkListItem extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            saved: false,
        }
    }

    doSchedule() {
        if (!this.props.arrivalTime) return;

        this.props.navigation.navigate("SavedScheduleScreen", {
            date: this.props.arrivalTime.toJSON(),
        });
    }

    render() {
        let badgeSpacing = "";
        for (let i = this.props.name.length; i < 4; ++i) badgeSpacing += " ";

        return (
            <ListItem
                onPress={() => navigateToMetlink(this.props.code, this.props.isStop, this.props.navigation, this.props.route)}
                bottomDivider
            >
                <Badge status={(this.props.isStop) ? "primary" : "warning"} value={this.props.code}/>
                <ListItem.Content>
                    <ListItem.Title>{badgeSpacing}{this.props.name}</ListItem.Title>
                    {this.props.timeRemaining &&
                    <Text>{badgeSpacing}{this.props.timeRemaining}</Text>}
                </ListItem.Content>
                {this.props.isLive && <Badge status={"success"} value={"live"}/>}
                <Icon
                    name={(this.props.isFavourite) ? "star" : "star-outline"}
                    type={"material-community"}
                    onPress={() => this.props.toggleFavourite()}
                />
                {this.props.arrivalTime &&
                <Icon
                    onPress={() => this.doSchedule()}
                    name={'timer'}
                    type={'material-community'}
                />}
            </ListItem>
        );
    }
}

export default MetlinkListItem;
