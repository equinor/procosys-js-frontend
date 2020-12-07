import OutlookInfo, { OutlookStatusType } from '../index';

import { OutlookResponseType } from '../../utils';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import theme from '../../../../../../assets/theme';

export const participants = [
    {
        sortKey: 0,
        person: {
            person: {
                firstName: 'Adwa Addw',
                lastName: 'dwa Akndw',
                email: 'kjhasd@lkjasd.com',
                company: 'EQUI',
            },
            response: OutlookResponseType.ATTENDING
        },
    },
    {
        sortKey: 1,
        person: {
            person: {
                firstName: 'Akjooo',
                lastName: 'Okasdf',
                email: 'lkajsdkjas@equinor.com',
                company: 'EQUI',
            },
            response: OutlookResponseType.TENTATIVE
        },
    },
    {
        sortKey: 2,
        person: {
            person: {
                firstName: 'Pkjabw',
                lastName: 'Odwalk',
                email: 'lkjawc@equinor.com',
                company: 'EQUI',
            },
            response: OutlookResponseType.TENTATIVE
        },
    },
    {
        sortKey: 3,
        person: {
            person: {
                firstName: 'Prea',
                lastName: 'Trea',
                email: 'jcklwaclakjj@equinor.com',
                company: 'EQUI',
            },
            response: OutlookResponseType.NONE
        },
    },
    {
        sortKey: 4,
        person: {
            person: {
                firstName: 'Nuyre',
                lastName: 'ui Ak',
                email: 'wwwwwwww@equinor.com',
                company: 'EQUI',
            },
            response: OutlookResponseType.DECLINED
        },
    },
    {
        sortKey: 5,
        person: {
            person: {
                firstName: 'Ttytya',
                lastName: 'as Aiousv',
                email: 'clclclcwajjk@equinor.com',
                company: 'EQUI',
            },
            response: OutlookResponseType.DECLINED
        },
    },
    {
        sortKey: 6,
        functionalRole: {
            code: 'asdasd',
            email: 'sadoiens@weweew.com',
            response: OutlookResponseType.ATTENDING
        }
    }
];

export const organizer = 'Organizer Name';




const renderWithTheme = (Component) => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};

const close = jest.fn(() => { });


describe('<OutlookInfo />', () => {
    it('Renders with supplied dummy data', async () => {
        const { queryByText } = renderWithTheme(<OutlookInfo close={ () => { return; } } participants={participants} organizer={organizer} status={OutlookStatusType.OK} />);

        expect(queryByText('Ok')).toBeInTheDocument();
        expect(queryByText('Organizer Name')).toBeInTheDocument();
    });

    it('Should trigger close when X is clicked', () => {
        const { getByTitle } = renderWithTheme(<OutlookInfo close={ close } participants={participants} organizer={organizer} status={OutlookStatusType.OK} />);
        getByTitle('Close').click();
        expect(close).toHaveBeenCalledTimes(1);
    });

    it('Renders attending participants under correct container', () => {
        const { getByTestId } = renderWithTheme(<OutlookInfo close={ close } participants={participants} organizer={organizer} status={OutlookStatusType.OK} />);
        const container = getByTestId('attending');
        expect(container.children.length).toBe(3);
    });

    it('Renders tentative participants under correct container', () => {
        const { getByTestId } = renderWithTheme(<OutlookInfo close={ close } participants={participants} organizer={organizer} status={OutlookStatusType.OK} />);
        const container = getByTestId('tentative');
        expect(container.children.length).toBe(3);
    });

    it('Renders not responding participants under correct container', () => {
        const { getByTestId } = renderWithTheme(<OutlookInfo close={ close } participants={participants} organizer={organizer} status={OutlookStatusType.OK} />);
        const container = getByTestId('not_responded');
        expect(container.children.length).toBe(2);
    });
    
    it('Renders declined participants under correct container', () => {
        const { getByTestId } = renderWithTheme(<OutlookInfo close={ close } participants={participants} organizer={organizer} status={OutlookStatusType.OK} />);
        const container = getByTestId('declined');
        expect(container.children.length).toBe(3);
    });
});
