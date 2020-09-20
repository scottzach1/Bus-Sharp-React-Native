import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";

interface Props {
    arrivalTime: string,
}

/**
 * Represents the catch entry within the ScheduleJourney view.
 *
 * @param props - `Props` interface defined above.
 */
const ScheduleCatchItem: FC<Props> = (props) => {
    // Returns a styled list item.
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
