import { addDays, addHours, addMinutes, set } from 'date-fns';

export const getEndTime = (date: Date): Date => {
    if (date.getHours() === 23) {
        const minutes = date.getMinutes();
        return addMinutes(date, 59 - minutes);
    } else {
        return addHours(date, 1);
    }
};

export const getNextHalfHourTimeString = (date: Date): Date => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (hours < 20) {
        if (minutes < 30) {
            return set(addMinutes(date, 30 - minutes), { seconds: 0 });
        } else {
            return set(date, { hours: hours + 1, minutes: 0, seconds: 0 });
        }
    } else {
        const nextDay = addDays(date, 1);
        return set(nextDay, { hours: 7, minutes: 0 });
    }
};

export const isEmptyObject = (obj: Record<string, string>): boolean => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};
