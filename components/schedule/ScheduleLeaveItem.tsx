import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";

interface Props {
    leaveTime: string;
}

/**
 * Represents the leave entry within the ScheduleJourney view.
 *
 * @param props - `Props` interface defined above.
 */
const ScheduleLeaveItem: FC<Props> = (props) => {
    // Returns a styled list item.
    return (
        <ListItem>
            <Icon name={'home'} type={'material-community'}/>
            <ListItem.Content>
                <ListItem.Title>
                    Leave
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Title>{props.leaveTime}</ListItem.Title>
        </ListItem>
    );
}

export default ScheduleLeaveItem;
