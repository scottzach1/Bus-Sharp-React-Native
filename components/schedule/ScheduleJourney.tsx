import React, {FC} from "react";
import {View} from "../styles/Themed";
import {format, sub} from "date-fns";
import LeaveItem from "./LeaveItem";
import WalkItem from "./WalkItem";
import ScheduleCatchItem from "./ScheduleCatchItem";

interface Props {
    arrivalTime: Date,
    walkTime: number,
    setWalkTime: (walkTime: number) => void,
}

const ScheduleJourney: FC<Props> = (props) => {

    const currentTime = new Date();

    const formatDate = (date: Date) => {
        return format(date, 'p');
    }

    const getLeaveTime = () => {
        const leaveTime = sub(currentTime, {
            minutes: props.walkTime,
        });
        return formatDate(leaveTime);
    }

    return (
        <View>
            <LeaveItem leaveTime={getLeaveTime()}/>
            <WalkItem walkTime={props.walkTime} setWalkTime={(n) => props.setWalkTime(n)}/>
            <ScheduleCatchItem arrivalTime={formatDate(currentTime)}/>
        </View>
    );
}

export default ScheduleJourney;