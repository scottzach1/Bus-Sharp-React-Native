import React, {FC} from "react";
import {Button, Icon} from "react-native-elements";

interface Props {
    type: "login" | "signup" | "logout",
    submit: () => void,
}

const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

const AccountActionButton: FC<Props> = (props) => {

    return (
        <Button
            title={" " + capitalizeFirstLetter(props.type)}
            icon={
                <Icon
                    name={(props.type === "logout") ? "logout" : "login"}
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