import React, {FC} from "react";
import {Icon, Input} from "react-native-elements";

interface Props {
    setPassword: (email: string) => void,
    confirmation?: boolean
}

const PasswordInput: FC<Props> = (props) => {
    const label = "Password" + ((props.confirmation) ? " Confirmation" : "");

    return (
        <Input
            label={label}
            placeholder={'Password123'}
            leftIcon={
                <Icon name={'lock'} type={'material-community'} color={"grey"}/>
            }
            secureTextEntry={true}
            onChangeText={(text) => props.setPassword(text)}
        />
    )
}

export default PasswordInput;