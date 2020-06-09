import React from 'react';
import CreateAreaTag from '../CreateAreaTag';
import { render, act, waitFor } from '@testing-library/react';

const mockDisciplines = [
    {
        code: 'Discipline code 1',
        description: 'Discipline description 1',
    },
    {
        code: 'Discipline code 2',
        description: 'Discipline description 2',
    },
];

const mockAreas = [
    {
        code: 'area code 1',
        description: 'area description 1',
    },
    {
        code: 'area code 2',
        description: 'area description 2',
    },
];

const mockValidTagNo = {
    tagNo: '#PRE-E',
    exists: false,
};

const spacesInTagNoMessage = 'The suffix cannot containt spaces.';


jest.mock('../../../../context/PreservationContext',() => ({
    usePreservationContext: () => {
        return {
            project: {
                id: 1,
                name: 'test',
                description: 'project'
            },
            apiClient: {
                getAreas: () => Promise.resolve(mockAreas),
                getDisciplines: () => Promise.resolve(mockDisciplines),
                checkAreaTagNo: () => Promise.resolve(mockValidTagNo)
            }
        };
    }
}));

jest.mock('react-router-dom', () => ({
    useHistory: () => {}
}));

describe('<CreateAreaTag />', () => {

    /** Because of API calls using effect hooks, we need to wrap everything in act */
    it('Next button should be disabled intially.', async () => {
        await act(async () => {
            const { getByText } = render(<CreateAreaTag />);
            expect(getByText('Next')).toHaveProperty('disabled', true);
        });
    });

    it('Renders with correct fields', async () => {
        /** Because of API calls using effect hooks, we need to wrap everything in act */
        await act(async () => {
            const { queryByText } = render(<CreateAreaTag />);

            expect(queryByText('Area')).toBeInTheDocument();
            expect(queryByText('Area type')).toBeInTheDocument();
            expect(queryByText('Discipline')).toBeInTheDocument();
            expect(queryByText(/Tag number/)).toBeInTheDocument();
            expect(queryByText('Description')).toBeInTheDocument();
        });
    });

    it('Displays error message when suffix contains space', async () => {
        await act(async () => {
            const { queryByText } = render(<CreateAreaTag suffix="1 2" />);
            await waitFor(() => expect(queryByText(spacesInTagNoMessage)).toBeInTheDocument());
        });
    });

    it('\'Next\' button disabled when not all mandatory fields are passed', async () => {
        await act(async () => {
            const { getByText } = render(<CreateAreaTag areaType='PreArea' discipline='testDiscipline' suffix='12'/>);
            expect(getByText('Next')).toHaveProperty('disabled', true);
        });
    });

    it('\'Next\' button enabled when all mandatory fields are passed', async () => {
        await act(async () => {
            /** For testing purposes this is considered a valid tagNo */
            var propFunc = jest.fn();
            const { getByText } = render(<CreateAreaTag areaType='PreArea' discipline='E' description='description text' setSelectedTags={propFunc} />);
            await waitFor(() => expect(getByText('Next')).toHaveProperty('disabled', false));
        });
    });

    it.todo('Initial \'Area\' is automatically selected in dropdown');
    it.todo('Initial \'Area Type\' is automatically selected in dropdown');
    it.todo('Initial \'Discipline\' is automatically selected in dropdown');
    it.todo('Initial \'Tag suffix\' is automatically set on render');
    it.todo('Initial \'Description\' is automatically set on render');

});
