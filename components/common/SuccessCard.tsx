import React, {FC} from "react";
import {Card, Icon} from "react-native-elements";
import {View} from "react-native";

interface Props {
    successMessage: string | null,
    clearMessage: () => void,
}

const SuccessCard: FC<Props> = (props) => {
    return (
        <View>
            {props.successMessage &&
            <Card containerStyle={{backgroundColor: "green"}}>
                <Card.Title style={{color: "white"}}>
                    {props.successMessage}
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

export default SuccessCard;