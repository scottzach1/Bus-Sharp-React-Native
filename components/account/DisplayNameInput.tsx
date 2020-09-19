import React, {FC} from "react";
import {Icon, Input} from "react-native-elements";

interface Props {
    setEmail: (email: string) => void,
}

const DisplayNameInput: FC<Props> = (props) => {
    return (
        <Input
            label={"Your Display Name"}
            placeholder={'John Wick'}
            leftIcon={
                <Icon name={'email'} type={'material-community'} color={"grey"}/>
            }
            onChangeText={(text) => props.setEmail(text)}
        />
    );
}

export default DisplayNameInput;