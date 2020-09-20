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

/**
 * This component represents the journey card within the schedule screen. Within this component there are three major
 * entries, the schedule leave, walk and catch entries.
 *
 * @param props - `Props` interface defined above.
 */
const ScheduleJourney: FC<Props> = (props) => {
    /**
     * Formats the date as a string to be viewed within the leave and arrival components.
     * @param date - to format.
     */
    const formatDate = (date: Date) => {
        return format(date, 'p');
    }

    /**
     * Subtracts the walk time from the arrival time and formats a string to be rendered by the leave component.
     */
    const getLeaveTime = () => {
        // Subtract the walk time.
        const leaveTime = sub(props.arrivalTime, {
            minutes: props.walkTime,
        });
        // Format as string.
        return formatDate(leaveTime);
    }

    // Returns a view containing the schedule leave, walk and catch items.
    return (
        <View>
            <ScheduleLeaveItem leaveTime={getLeaveTime()}/>
            <ScheduleWalkItem walkTime={props.walkTime} setWalkTime={(n) => props.setWalkTime(n)}/>
            <ScheduleCatchItem arrivalTime={formatDate(props.arrivalTime)}/>
        </View>
    );
}

export default ScheduleJourney;
