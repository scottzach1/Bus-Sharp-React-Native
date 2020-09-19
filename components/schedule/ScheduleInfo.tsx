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

const ScheduleInfo: FC<Props> = (props) => {
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
