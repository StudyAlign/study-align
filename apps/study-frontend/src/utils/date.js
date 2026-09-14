import {studyStates} from "../redux/reducers/studySlice";

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

const days = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
]

export const getDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const dayName = days[date.getDay()]
    const monthName = months[date.getMonth()]
    const year = date.getFullYear()
    // Study start/end are date-only; don't render a (meaningless) 0:0 time.
    return `${dayName}, ${day}. ${monthName} ${year}`
}

export function isStudyActive(study) {
    if (study && study.startDate && study.endDate && study.state === studyStates.running) {
        const currentDate = new Date().getTime();
        const studyStartDate = new Date(study.startDate).getTime();
        const studyEndDate = new Date(study.endDate).getTime();
        console.log(currentDate, studyStartDate, studyEndDate);
        return currentDate >= studyStartDate && currentDate <= studyEndDate;
    }
    return false;
}
