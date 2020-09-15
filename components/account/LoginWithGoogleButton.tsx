import React, {FC} from "react";
import {Button, Icon} from "react-native-elements";
import {signInWithGoogle} from "../../external/Firebase";

interface Props {
    type: "login" | "signup",
}

const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

const LoginWithGoogleButton: FC<Props> = (props) => {
    return (
        <Button
            title={" " + capitalizeFirstLetter(props.type) + " with Google"}
            icon={
                <Icon name={"google"} type={"font-awesome"} color={"white"} size={18}/>
            }
            onPress={signInWithGoogle}
            buttonStyle={{backgroundColor: "red"}}
        />
    );
}

export default LoginWithGoogleButton;