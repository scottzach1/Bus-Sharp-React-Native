import React, {FC} from "react";
import {Button, Icon} from "react-native-elements";

interface Props {
    onPress: () => void,
}

/**
 * This component styles the schedule button within the schedule screen.
 *
 * @param props - `Props` interface defined above.
 */
const ScheduleButton: FC<Props> = (props) => {
    // Returns a styled button.
    return (
        <Button
            title={' Schedule'}
            icon={
                <Icon
                    name={'timer'}
                    type={'material-community'}
                    color={'white'}
                />
            }
            onPress={() => props.onPress()}
        />
    );
}

export default ScheduleButton;
