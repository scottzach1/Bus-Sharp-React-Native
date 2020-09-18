import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";

interface Props {
    arrivalTime: string,
}

const ScheduleCatchItem: FC<Props> = (props) => {
    return (
        <ListItem>
            <Icon name={'bus'} type={'material-community'}/>
            <ListItem.Content>
                <ListItem.Title>
                    Catch
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Title>{props.arrivalTime}</ListItem.Title>
        </ListItem>
    );
}

export default ScheduleCatchItem;
