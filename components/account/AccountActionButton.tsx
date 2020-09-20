import React, {FC} from "react";
import {Button, Icon} from "react-native-elements";

interface Props {
    type: "login" | "signup" | "logout" | "reset",
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
 * This component is responsible for containing a Button to hide the account actions.
 *
 * This component is an attempt to keep the UI consistent across all buttons within the Account pages. The account mode o
 * can be specified within the property`type` within the `Props` interface.
 *
 * @param props - `Props` interface defined above.
 */
const AccountActionButton: FC<Props> = (props) => {

    /* Determine icon to put within the button based off type. */
    let iconName: string;

    switch (props.type) {
        case "logout":
            iconName = "logout";
            break;
        case "login":
            iconName = "login";
            break;
        case "reset":
            iconName = "lock-reset";
            break
        case "signup":
            iconName = "login";
            break;
        default:
            iconName = "unknown";
    }

    // Capitalize prop name to put as prop label.
    const text = (props.type !== "reset") ? capitalizeFirstLetter(props.type) : "Reset Password";

    // Return styled label.
    return (
        <Button
            title={` ${text}`}
            icon={
                <Icon
                    name={iconName}
                    type={"material-community"}
                    color={"white"}
                    size={18}
                />
            }
            onPress={() => props.onPress()}
        />
    );
}

export default AccountActionButton;
