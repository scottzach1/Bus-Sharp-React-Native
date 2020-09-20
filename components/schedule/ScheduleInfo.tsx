import React, {FC} from "react";
import {Card} from "react-native-elements";
import {Text, View} from "../styles/Themed";

interface Props {
    stopCode: string | null,
    stopName: string | null,
    serviceCode: string | null,
    serviceName: string | null,
    setError: (error: string) => void,
}

/**
 * This component is displays a card with the information about the intersecting stop and service.
 * Within this component we observe both the stop and service name and codes.
 *
 * NOTE: This component must be rendered within a `react-native-elements` Card!
 *
 * @param props - `Props` interface defined above.
 */
const ScheduleInfo: FC<Props> = (props) => {
    // Returns a view containing both the service and stop names and codes.
    return (
        <View>
            <Card.Title>
                {`${props.serviceCode} - ${props.serviceName}`}
            </Card.Title>
            <Text style={{fontSize: 15}}>
                {`From ${props.stopName} (${props.stopCode})`}
            </Text>
        </View>
    );
}

export default ScheduleInfo;
