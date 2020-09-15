import React, {FC} from "react";
import {View} from "../common/Themed";
import {Card} from "react-native-elements";

interface Props {
    errorMessage: string | null,
}

const ErrorCard: FC<Props> = (props) => {
    return (
        <View>
            {props.errorMessage &&
            <Card containerStyle={{backgroundColor: "red"}}>
                <Card.Title style={{color: "white"}}>
                    {props.errorMessage}
                </Card.Title>
            </Card>}
        </View>
    );
}

export default ErrorCard;