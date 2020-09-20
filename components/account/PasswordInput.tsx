import React, {FC} from "react";
import {Icon, Input} from "react-native-elements";

interface Props {
    setPassword: (email: string) => void,
    confirmation?: boolean
}

/**
 * This component is responsible for styling the input where the user enters their password for authentication.
 *
 * This component has two different modes that can be set via the optional `confirmation` property within the Props
 * interface. This is purely aesthetic and only changes the label above the input.
 *
 * @param props - `Props` interface defined above.
 */
const PasswordInput: FC<Props> = (props) => {
    const label = "Password" + ((props.confirmation) ? " Confirmation" : "");

    // Return styled input.
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
