import React, {Component} from "react";
import {Badge, Icon, ListItem} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";
import {navigateToMetlink} from "../../navigation/LinkingConfiguration";
import {Route} from "react-native";

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
    key: string
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

    render() {
        let badgeSpacing = "";
        for (let i = this.props.name.length; i < 4; ++i) badgeSpacing += " ";

        return (
            <ListItem
                onPress={() => navigateToMetlink(this.props.code, this.props.isStop, this.props.navigation, this.props.route)}
                key={this.props.key}
                bottomDivider
            >
                <Badge status={(this.props.isStop) ? "primary" : "warning"} value={this.props.code}/>
                <ListItem.Content>
                    <ListItem.Title>{badgeSpacing}{this.props.name}</ListItem.Title>
                    {this.props.timeRemaining &&
                    <ListItem.Subtitle>{badgeSpacing}{this.props.timeRemaining}</ListItem.Subtitle>}
                </ListItem.Content>
                {this.props.isLive && <Badge status={"success"} value={"live"}/>}
                <Icon
                    name={(this.props.isFavourite) ? "star" : "star-outline"}
                    type={"material-community"}
                    onPress={() => this.props.toggleFavourite()}
                />
            </ListItem>
        );
    }
}

export default MetlinkListItem;