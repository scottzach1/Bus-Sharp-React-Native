import React, {FC} from "react";
import {Icon, Input} from "react-native-elements";

interface Props {
    setEmail: (email: string) => void,
}

/**
 * This component is responsible for styling the input where the user enters their email address on authentication.
 *
 * @param props - `Props` interface defined above.
 */
const EmailInput: FC<Props> = (props) => {
    // Render styled input.
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
