import { getEndTime, getNextHalfHourTimeString } from '../utils';

describe('Create IPO utilities', () => {
    it('Function getEndTime should return date an hour later when given date with time earlier than 23:00', async () => {
        const date = new Date(2020, 11, 24, 11);
        const expectedDate = new Date(2020, 11, 24, 12);
        const endDate = getEndTime(date);
        expect(endDate.toString()).toBe(expectedDate.toString());
    });

    it('Function getEndTime should return date with time 23:59 for date with time later than 22:58', async () => {
        const date = new Date(2020, 11, 24, 23, 15);
        const expectedDate = new Date(2020, 11, 24, 23, 59);
        const endDate = getEndTime(date);
        expect(endDate.toString()).toBe(expectedDate.toString());
    });

    it('Function getEndTime should return date with time 23:59 for date with time 22:59', async () => {
        const date = new Date(2020, 11, 24, 22, 59);
        const expectedDate = new Date(2020, 11, 24, 23, 59);
        const endDate = getEndTime(date);
        expect(endDate.toString()).toBe(expectedDate.toString());
    });

    it('Function getNextHalfHourTimeString should return next half hour when minutes < 30', async () => {
        const date = new Date(2020, 11, 24, 11, 11);
        const expectedDate = new Date(2020, 11, 24, 11, 30);
        const endDate = getNextHalfHourTimeString(date);
        expect(endDate.toString()).toBe(expectedDate.toString());
    });

    it('Function getNextHalfHourTimeString should return next half hour when minutes = 0', async () => {
        const date = new Date(2020, 11, 24, 11, 0);
        const expectedDate = new Date(2020, 11, 24, 11, 30);
        const endDate = getNextHalfHourTimeString(date);
        expect(endDate.toString()).toBe(expectedDate.toString());
    });

    it('Function getNextHalfHourTimeString should return next half hour when minutes > 30', async () => {
        const date = new Date(2020, 11, 24, 11, 40);
        const expectedDate = new Date(2020, 11, 24, 12, 0);
        const endDate = getNextHalfHourTimeString(date);
        expect(endDate.toString()).toBe(expectedDate.toString());
    });

    it('Function getNextHalfHourTimeString should return next half hour when minutes = 30', async () => {
        const date = new Date(2020, 11, 24, 11, 30);
        const expectedDate = new Date(2020, 11, 24, 12, 0);
        const endDate = getNextHalfHourTimeString(date);
        expect(endDate.toString()).toBe(expectedDate.toString());
    });

    it('Function getNextHalfHourTimeString should return next day hour 07:00 when hours >= 20', async () => {
        const date = new Date(2020, 11, 24, 20, 30);
        const expectedDate = new Date(2020, 11, 25, 7, 0);
        const endDate = getNextHalfHourTimeString(date);
        expect(endDate.toString()).toBe(expectedDate.toString());
    });
});
