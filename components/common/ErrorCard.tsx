import React, {FC} from "react";
import {Card, Icon} from "react-native-elements";
import {View} from "react-native";

interface Props {
    errorMessage: string | null,
    clearMessage: () => void,
}

const ErrorCard: FC<Props> = (props) => {
    return (
        <View>
            {props.errorMessage &&
            <Card containerStyle={{backgroundColor: "red"}}>
                <Card.Title style={{color: "white"}}>
                    {props.errorMessage}
                </Card.Title>
                <Icon
                    name={"close"}
                    type={"material-community"}
                    color={"white"}
                    onPress={() => props.clearMessage()}
                />
            </Card>}
        </View>
    );
}

export default ErrorCard;