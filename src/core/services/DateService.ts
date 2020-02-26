
/**
 * Return formatted date (dd.mm.yyyy). Empty string is returned if date is undefined.
 * @param date 
 */
export const getFormattedDate = (date?: Date): string => {
    if (date === undefined) {
        return '';
    }
    const newDate = new Date(date);
    const d = newDate.getDate();
    const m = newDate.getMonth() + 1;
    const y = newDate.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '.' + (m <= 9 ? '0' + m : m) + '.' + y;
};

/**
 * Return formatted date and time (dd.mm.yyyy hh:mi). Empty string is returned if date is undefined.
 * @param date 
 */
export const getFormattedDateAndTime = (date?: Date): string => {
    if (date === undefined) {
        return '';
    }
    const newDate = new Date(date);
    const d = newDate.getDate();
    const m = newDate.getMonth() + 1;
    const y = newDate.getFullYear();
    const h = newDate.getFullYear();
    const min = newDate.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '.' + (m <= 9 ? '0' + m : m) + '.' + y + ' ' + (h <= 9 ? '0' + h : h) + ':' + (min <= 9 ? '0' + min : min);
};

