import { addDays, addHours, addMinutes, set } from 'date-fns';

import { Attachment } from '../../types';
import { IpoApiError } from '../../http/InvitationForPunchOutApiClient';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';

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

export const getAttachmentDownloadLink = (
    attachment: Attachment
): string | undefined => {
    if (attachment.downloadUri) {
        return attachment.downloadUri;
    }
    if (
        attachment.file !== undefined &&
        typeof window.URL.createObjectURL !== 'undefined'
    ) {
        return window.URL.createObjectURL(attachment.file);
    }

    return undefined;
};

export const handleApiError = (error: any, customMessage?: string): void => {
    if (!(error instanceof IpoApiError)) {
        console.error(error);
        showSnackbarNotification(
            error.message || customMessage || 'Unknown error'
        );
    } else {
        console.error(error.message, error.data);
        showSnackbarNotification(error.message);
    }
};
