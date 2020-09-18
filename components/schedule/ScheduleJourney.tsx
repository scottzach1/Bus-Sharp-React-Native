import React, {FC} from "react";
import {View} from "../styles/Themed";
import {format, sub} from "date-fns";
import ScheduleLeaveItem from "./ScheduleLeaveItem";
import ScheduleWalkItem from "./ScheduleWalkItem";
import ScheduleCatchItem from "./ScheduleCatchItem";

interface Props {
    arrivalTime: Date,
    walkTime: number,
    setWalkTime: (walkTime: number) => void,
}

const ScheduleJourney: FC<Props> = (props) => {

    const formatDate = (date: Date) => {
        return format(date, 'p');
    }

    const getLeaveTime = () => {
        const leaveTime = sub(props.arrivalTime, {
            minutes: props.walkTime,
        });
        return formatDate(leaveTime);
    }

    return (
        <View>
            <ScheduleLeaveItem leaveTime={getLeaveTime()}/>
            <ScheduleWalkItem walkTime={props.walkTime} setWalkTime={(n) => props.setWalkTime(n)}/>
            <ScheduleCatchItem arrivalTime={formatDate(props.arrivalTime)}/>
        </View>
    );
}

export default ScheduleJourney;
