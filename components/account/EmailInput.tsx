import React, {FC} from "react";
import {Icon, Input} from "react-native-elements";

interface Props {
    setEmail: (email: string) => void,
}

const EmailInput: FC<Props> = (props) => {
    return (
        <Input
            label={"Your Email Address"}
            placeholder={'email@address.com'}
            leftIcon={
                <Icon name={'email'} type={'material-community'} color={"grey"}/>
            }
            onChangeText={(text) => props.setEmail(text)}
        />
    );
}

export default EmailInput;