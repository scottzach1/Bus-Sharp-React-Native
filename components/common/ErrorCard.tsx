import React, {FC} from "react";
import {Card, Icon} from "react-native-elements";
import {View} from "react-native";

interface Props {
    errorMessage: string | null,
    clearMessage: () => void,
}

/**
 * This component is responsible for providing a standard design where we notify the user of any errors.
 *
 * This component will only render if the error message is not null.
 * The `clearMessage` prop is called when the dismiss icon is pressed within the card.
 *
 * @param props - `Props` interface defined above.
 */
const ErrorCard: FC<Props> = (props) => {
    // Return view wrapping a conditionally present styled card.
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
