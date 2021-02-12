import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import CustomPopover from '../index';
//import { OrganizationsEnum } from '../../../../../enums';
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
    //TODO: change names to something better
    it('Should be open when activePopover is the same as the functional\'s id', () => {
        const { getAllByRole } = renderWithTheme(<CustomPopover 
            participant = { participants[0] }
            onChange={()=>{}}
            activePopover = {participants[0].functionalRole.id.toString()}
        />);
        const buttons = getAllByRole('button');
        expect(buttons).toHaveLength(2);
    });
    it.todo('Should not be open when activePopover is not the same as the functional\'s id');
    it('Should render every person in the functional role in the popover', () => {
        const { getByText } = renderWithTheme(<CustomPopover 
            participant = { participants[0] }
            onChange={()=>{}}
            activePopover = {participants[0].functionalRole.id.toString()}
        />);
        participants[0].functionalRole.persons.forEach((person) => {
            const response = getByText(person.person.firstName + ' ' + person.person.lastName, { exact: false });
            expect(response).toBeValid();
        });
    });
    it('Should render the correct responses for the correct people', () => {
        const { getByTestId } = renderWithTheme(<CustomPopover 
            participant = { participants[0] }
            onChange={()=>{}}
            activePopover = {participants[0].functionalRole.id.toString()}
        />);
        participants[0].functionalRole.persons.forEach((person) => {
            const response = getByTestId(person.person.id.toString(), { exact: false });
            expect(response).toHaveTextContent(person.person.firstName);
            expect(response).toHaveTextContent(person.response);
        });
    });
});