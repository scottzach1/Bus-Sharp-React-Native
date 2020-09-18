import React, {FC} from "react";
import {Button, Icon} from "react-native-elements";

interface Props {
    onPress: () => void,
}

const ScheduleButton: FC<Props> = (props) => {
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
