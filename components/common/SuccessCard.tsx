import React, {FC} from "react";
import {Card, Icon} from "react-native-elements";
import {View} from "react-native";

interface Props {
    successMessage: string | null,
    clearMessage: () => void,
}

/**
 * This component is responsible for providing a standard design where we notify the user of any success.
 *
 * The `clearMessage` prop is called when the dismiss icon is pressed within the card.
 *
 * @param props - `Props` interface defined above.
 */
const SuccessCard: FC<Props> = (props) => {
    // Return view wrapping a conditionally present styled card.
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
