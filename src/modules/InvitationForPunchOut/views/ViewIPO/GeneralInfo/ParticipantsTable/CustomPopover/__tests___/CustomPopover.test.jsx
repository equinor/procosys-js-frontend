import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import CustomPopover from '../index';
import { OutlookResponseType } from '../../../../enums';
import theme from '../../../../../../../../assets/theme';

const renderWithTheme = (Component) => {
    return render(
        <ThemeProvider theme={theme}>{Component}</ThemeProvider>
    );
};

const participants = [
    {
        organization: 'Constr',
        sortKey: 1,
        canSign: true,
        externalEmail: null,
        person: null,
        functionalRole: {
            id: 1,
            code: 'one',
            email: 'funcitonalRole@asd.com',
            persons: [
                {
                    person: {
                        id: 1,
                        firstName: 'First',
                        lastName: 'ASdsklandasnd',
                        azureOid: 'azure1',
                        email: 'asdadasd@dwwdwd.com',
                        rowVersion: '123123',
                    },
                    required: true,
                    response: OutlookResponseType.ATTENDING,
        
                },
                {
                    person: {
                        id: 2,
                        firstName: 'Second',
                        lastName: 'ASdsklandasnd',
                        azureOid: 'azure2',
                        email: 'asdadasd2@dwwdwd.com',
                        rowVersion: '1231234',
                    },
                    required: true,
                    response: OutlookResponseType.NONE,
        
                },
            ],
            response: OutlookResponseType.TENTATIVE,
            rowVersion: '123o875'
        },
        note: '',
        attended: true,
    }
];

describe('<CustomPopover />', () => {
    it('Should open the popover on click', () => {
        const { getByRole, getAllByRole } = renderWithTheme(<CustomPopover 
            participant = { participants[0] }
        />);
        const button = getByRole('button');
        fireEvent.click(button);
        const buttons = getAllByRole('button');
        expect(buttons).toHaveLength(2);
    });
    it('Should close the popover on click', () => {
        const { getByRole, getAllByRole } = renderWithTheme(<CustomPopover 
            participant = { participants[0] }
        />);
        const button = getByRole('button');
        fireEvent.click(button);
        fireEvent.click(button);
        const buttons = getAllByRole('button');
        expect(buttons).toHaveLength(1);
    });
    it('Should render every person and the correct responses for the correct people', () => {
        const { getByTestId, getByRole } = renderWithTheme(<CustomPopover 
            participant = { participants[0] }
        />);
        const button = getByRole('button');
        fireEvent.click(button);
        participants[0].functionalRole.persons.forEach((person) => {
            const response = getByTestId(person.person.id.toString() + 'row', { exact: false });
            expect(response).toHaveTextContent(person.person.firstName);
            expect(response).toHaveTextContent(person.response);
        });
    });
});
