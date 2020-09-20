import React, {FC} from "react";
import {Icon, Input} from "react-native-elements";

interface Props {
    setEmail: (email: string) => void,
}

/**
 * This component is responsible for styling the input where the user enters their display name on signup.
 *
 * @param props - `Props` interface defined above.
 */
const DisplayNameInput: FC<Props> = (props) => {
    // Render styled input.
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
