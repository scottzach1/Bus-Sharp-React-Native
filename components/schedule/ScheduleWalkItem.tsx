import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";
import {Text, TextInput} from "../styles/Themed";

interface Props {
    walkTime: number | string,
    setWalkTime: (v: number) => void,
}

/**
 * Represents the walk entry within the ScheduleJourney view. Within this entry, the user can manually type their own
 * value for number of minutes to walk. This is updated within a parent component via the `setWalkTime(v)` callback
 * prop.
 *
 * @param props - `Props` interface defined above.
 */
const ScheduleWalkItem: FC<Props> = (props) => {

    /**
     * Handles key inputs to the walk minutes input.
     *
     * @param s - the latest string within the input.
     */
    const handleTimeInput = (s: string) => {
        const time = parseInt(s);
        // Only update above if time is valid.
        if (!isNaN(time) && time >= 0)
            props.setWalkTime(time);
    }

    // Returns a styled list item containing the walk time input.
    return (
        <ListItem>
            <Icon name={'walk'} type={'material-community'}/>
            <ListItem.Content>
                <ListItem.Title>
                    Walk
                </ListItem.Title>
            </ListItem.Content>
            <TextInput
                defaultValue={`${props.walkTime}`}
                keyboardType={"numeric"}
                onChangeText={(v) => handleTimeInput(v)}
            />
            <Text>mins</Text>
        </ListItem>
    );
}

export default ScheduleWalkItem;
