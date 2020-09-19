import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";
import {Text, TextInput} from "../styles/Themed";

interface Props {
    walkTime: number | string,
    setWalkTime: (v: number) => void,
}

const ScheduleWalkItem: FC<Props> = (props) => {

    const handleTimeInput = (s: string) => {
        const time = parseInt(s);
        if (!isNaN(time) && time >= 0)
            props.setWalkTime(time);
    }

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
