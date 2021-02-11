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
    it.todo('Should open the popover on click', () => {
        //should this be here or in the parent??
    });
    it.todo('Should render every person in the functional role in the popover', () => {
        const { queryAllByText } = renderWithTheme(<CustomPopover 
            participant = { participants[0] }
            onChange={()=>{}}
            activePopover = {1}
        />);
        const persons = queryAllByText();
        expect(persons).toBeInTheDocument();
    });
    it.todo('Should render the correct responses', () => {

    });
});