import OutlookInfo, { OutlookStatusType } from '../index';

import React from 'react';
import { ResponseType } from '../index';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import theme from '../../../../../../assets/theme';

export const participants = [
    {
        name: 'Adwa Addw dwa Akndw',
        email: 'kjhasd@lkjasd.com',
        company: 'EQUI',
        response: ResponseType.ATTENDING
    },
    {
        name: 'Akjooo Okasdf',
        email: 'lkajsdkjas@equinor.com',
        company: 'EQUI',
        response: ResponseType.TENTATIVE
    },
    {
        name: 'Pkjabw Odwalk',
        email: 'lkjawc@equinor.com',
        company: 'EQUI',
        response: ResponseType.TENTATIVE
    },
    {
        name: 'Prea Trea',
        email: 'jcklwaclakjj@equinor.com',
        company: 'EQUI',
        response: ResponseType.NOT_RESPONDED
    },
    {
        name: 'Nuyre ui Ak',
        email: 'wwwwwwww@equinor.com',
        company: 'EQUI',
        response: ResponseType.DECLINED
    },
    {
        name: 'Ttytya as Aiousv',
        email: 'clclclcwajjk@equinor.com',
        company: 'EQUI',
        response: ResponseType.DECLINED
    },
];

export const organizer= {
    name: 'Organizer Name',
    email: 'aslkncv@equinor.com',
    company: 'ASPD'
};




const renderWithTheme = (Component) => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};


describe('<OutlookInfo />', () => {
    it('Renders with supplied dummy data', async () => {
        const { queryByText } = renderWithTheme(<OutlookInfo close={ () => { return; } } participants={participants} organizer={organizer} status={OutlookStatusType.OK} />);

        expect(queryByText('Ok')).toBeInTheDocument();
        expect(queryByText('ASPD')).toBeInTheDocument();
        expect(queryByText('Organizer Name')).toBeInTheDocument();
        expect(queryByText('Adwa Addw dwa Akndw')).toBeInTheDocument();
        expect(queryByText('aslkncv@equinor.com')).toBeInTheDocument();
    });

    it('Should trigger close when X is clicked', () => {
        const close = jest.fn(() => { });

        const { getByTitle } = renderWithTheme(<OutlookInfo close={ close } participants={participants} organizer={organizer} status={OutlookStatusType.OK} />);
        getByTitle('Close').click();
        expect(close).toHaveBeenCalledTimes(1);
    });

    it('Renders attending participants under correct container', () => {
        const { getByTestId } = renderWithTheme(<OutlookInfo close={ close } participants={participants} organizer={organizer} status={OutlookStatusType.OK} />);
        const container = getByTestId('attending');
        expect(container.children.length).toBe(2);
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
