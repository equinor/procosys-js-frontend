import {
    getFormattedDate,
    getFormattedTime,
} from '../../../../../../core/services/DateService';

import GeneralInfo from '../GeneralInfo';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import theme from '../../../../../../assets/theme';

const mcPkgScope = {
    mcPkgNo: 'L123-432',
    description: 'An mC pkg',
    commPkgNo: 'C01-123',
};

const commPkgScope = {
    commPkgNo: 'C01-123',
    description: 'A comm pkg',
    status: 'hot',
};

const invitation = {
    projectName: 'Projectname',
    title: 'Projecttitle',
    description: 'This is a project description',
    location: 'here',
    type: 'Serious',
    rowVersion: '1231413',
    startTimeUtc: new Date(2020, 11, 6, 11, 0).toString(),
    endTimeUtc: new Date(2020, 11, 6, 13, 0).toString(),
    participants: [],
    mcPkgScope: mcPkgScope,
    commPkgScope: commPkgScope,
};

const mockSetDirtyStateFor = jest.fn((arg) => {
    return arg;
});
const mockUnsetDirtyStateFor = jest.fn((arg) => {
    return arg;
});

jest.mock('@procosys/core/DirtyContext', () => ({
    useDirtyContext: () => {
        return {
            setDirtyStateFor: mockSetDirtyStateFor,
            unsetDirtyStateFor: mockUnsetDirtyStateFor,
        };
    },
}));

const renderWithTheme = (Component) => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};

describe('<GeneralInfo />', () => {
    it('Renders with provided invitation data', async () => {
        const { queryByText } = renderWithTheme(
            <GeneralInfo invitation={invitation} />
        );

        expect(queryByText(invitation.title)).toBeInTheDocument();
        expect(queryByText(invitation.description)).toBeInTheDocument();
        expect(queryByText(invitation.location)).toBeInTheDocument();
        expect(
            queryByText(getFormattedDate(invitation.startTimeUtc))
        ).toBeInTheDocument();
        expect(
            queryByText(getFormattedTime(invitation.startTimeUtc))
        ).toBeInTheDocument();
        expect(
            queryByText(getFormattedTime(invitation.endTimeUtc))
        ).toBeInTheDocument();
    });
});
