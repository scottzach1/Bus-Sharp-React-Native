import React, {FC} from "react";
import {Button, Icon} from "react-native-elements";

interface Props {
    type: "login" | "signup" | "logout" | "reset",
    submit: () => void,
}

const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

const AccountActionButton: FC<Props> = (props) => {

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

    const text = (props.type !== "reset") ? capitalizeFirstLetter(props.type) : "Reset Password";

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
            onPress={() => props.submit()}
        />
    );
}

export default AccountActionButton;