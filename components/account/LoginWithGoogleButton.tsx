import React, {FC} from "react";
import {Button, Icon} from "react-native-elements";

interface Props {
    type: "login" | "signup",
    onPress: () => void,
}

/**
 * Helper: Capitalizes the first letter of a string.
 *
 * @param text to capitalize first letter.
 */
const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * This component is responsible for containing a styled button for logging in with Google.
 *
 * This component is an attempt to keep the UI consistent across all buttons within the Account authentication pages.
 * The context of the component can be specified within the property`type` within the `Props` interface.
 *
 * @param props - `Props` interface defined above.
 */
const LoginWithGoogleButton: FC<Props> = (props) => {
    // Return styled button.
    return (
        <Button
            title={` ${capitalizeFirstLetter(props.type)} with Google`}
            icon={
                <Icon name={"google"} type={"font-awesome"} color={"white"} size={18}/>
            }
            onPress={() => props.onPress()}
            buttonStyle={{backgroundColor: "red"}}
        />
    );
}

export default LoginWithGoogleButton;
