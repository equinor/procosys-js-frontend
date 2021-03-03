
// THE COMMENTED FUNCTIONS HAVE BEEN USED BY PRESERVATION
// KEEP FOR CONVENIENCE UNTIL EDS DATETIME STRATEGY IS IN PLACE

/**
 * Return formatted date (dd.mm.yyyy). Empty string is returned if date is null.
 * @param date 
 */
// export const getFormattedDate = (date: Date | null): string => {
//     if (date === null) {
//         return '';
//     }
//     const newDate = new Date(date);
//     const d = newDate.getDate();
//     const m = newDate.getMonth() + 1;
//     const y = newDate.getFullYear();
//     return '' + (d <= 9 ? '0' + d : d) + '.' + (m <= 9 ? '0' + m : m) + '.' + y;
// };

/**
 * Return formatted date and time (dd.mm.yyyy hh:mi). Empty string is returned if date is null.
 * @param date 
 */
// export const getFormattedDateAndTime = (date: Date | null): string => {
//     if (date === null) {
//         return '';
//     }
//     const newDate = new Date(date);
//     const d = newDate.getDate();
//     const m = newDate.getMonth() + 1;
//     const y = newDate.getFullYear();
//     const h = newDate.getHours();
//     const min = newDate.getMinutes();
//     return '' + (d <= 9 ? '0' + d : d) + '.' + (m <= 9 ? '0' + m : m) + '.' + y + ' ' + (h <= 9 ? '0' + h : h) + ':' + (min <= 9 ? '0' + min : min);
// };

export const getFormattedDateAndTime = (date: Date | string | undefined): string => {
    if (!date) {
        return '';
    }
    const newDate = new Date(date);
    return newDate.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

export const getFormattedDate = (date: Date | string | undefined): string => {
    if (!date) {
        return '';
    }
    const newDate = new Date(date);
    return newDate.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export const getFormattedTime = (date: Date | string | null): string => {
    if (!date) {
        return '';
    }
    const newDate = new Date(date);
    return newDate.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
};
