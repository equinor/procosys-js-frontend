
/**
 * Return formatted date (dd.mm.yyyy). Empty string is returned if date is null.
 * @param date 
 */
export const getFormattedDate = (date: Date | null): string => {
    if (date === null) {
        return '';
    }
    const newDate = new Date(date);
    const d = newDate.getDate();
    const m = newDate.getMonth() + 1;
    const y = newDate.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '.' + (m <= 9 ? '0' + m : m) + '.' + y;
};

/**
 * Return formatted date and time (dd.mm.yyyy hh:mi). Empty string is returned if date is null.
 * @param date 
 */
export const getFormattedDateAndTime = (date: Date | null): string => {
    if (date === null) {
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


export const getLocalDateAndTime = (date: string | undefined): string => {
    if (!date) {
        return '';
    }
    return new Date(date).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

export const getLocalDate = (date: string | undefined): string => {
    if (!date) {
        return '';
    }
    return new Date(date).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
};
