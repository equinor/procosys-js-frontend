export const getFormatDate = (date: Date): string => {
    if (date === null) {
        return '';
    }
    const newDate = new Date(date);
    const d = newDate.getDate();
    const m = newDate.getMonth() + 1;
    const y = newDate.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
};

export const getFormatTime = (date: Date): string => {
    if (date === null) {
        return '';
    }
    const newDate = new Date(date);
    const h = newDate.getHours();
    const min = newDate.getMinutes();
    return '' + (h <= 9 ? '0' + h : h) + ':' + (min <= 9 ? '0' + min : min);
};
