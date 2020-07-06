import React from 'react';
import CreateDummyTag from '../CreateDummyTag';
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

const mockPOs = [
    {
        title: '01',
        description: 'po description 1'
    }
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
                checkAreaTagNo: () => Promise.resolve(mockValidTagNo)
            },
            libraryApiClient: {
                getAreas: () => Promise.resolve(mockAreas),
                getDisciplines: () => Promise.resolve(mockDisciplines)
            }
        };
    }
}));

jest.mock('../../../../../../core/ProcosysContext',() => ({
    useProcosysContext: () => {
        return {
            procosysApiClient: {
                getPurchaseOrders: () => Promise.resolve(mockPOs)
            }
        };
    }
}));

jest.mock('react-router-dom', () => ({
    useHistory: () => {}
}));

describe('<CreateDummyTag />', () => {

    /** Because of API calls using effect hooks, we need to wrap everything in act */
    it('Next button should be disabled intially.', async () => {
        await act(async () => {
            var propFunc = jest.fn();
            const { getByText } = render(<CreateDummyTag  setArea={propFunc} setPurchaseOrder={propFunc}/>);
            expect(getByText('Next')).toHaveProperty('disabled', true);
        });
    });

    it('Renders with correct fields', async () => {
        /** Because of API calls using effect hooks, we need to wrap everything in act */
        await act(async () => {
            var propFunc = jest.fn();
            const { queryByText } = render(<CreateDummyTag setArea={propFunc} setPurchaseOrder={propFunc} />);

            expect(queryByText('Area type')).toBeInTheDocument();
            expect(queryByText('Discipline')).toBeInTheDocument();
            expect(queryByText(/Tag number/)).toBeInTheDocument();
            expect(queryByText('Description')).toBeInTheDocument();
        });
    });

    it('Displays error message when suffix contains space', async () => {
        await act(async () => {
            var propFunc = jest.fn();
            const { queryByText } = render(<CreateDummyTag suffix="1 2"  setArea={propFunc} setPurchaseOrder={propFunc}/>);
            await waitFor(() => expect(queryByText(spacesInTagNoMessage)).toBeInTheDocument());
        });
    });

    it('\'Next\' button disabled when not all mandatory fields are passed', async () => {
        await act(async () => {
            var propFunc = jest.fn();
            const { getByText } = render(<CreateDummyTag areaType={{title: 'Normal', value: 'PreArea'}} discipline='testDiscipline' suffix='12' setArea={propFunc} setPurchaseOrder={propFunc}/>);
            expect(getByText('Next')).toHaveProperty('disabled', true);
        });
    });

    it('\'Next\' button disabled when not all mandatory fields are passed for PO tag', async () => {
        await act(async () => {
            var propFunc = jest.fn();
            const { getByText } = render(<CreateDummyTag areaType={{title: 'Supplier', value: 'PoArea'}} discipline='testDiscipline' description='test description' suffix='12' setArea={propFunc} setPurchaseOrder={propFunc}/>);
            expect(getByText('Next')).toHaveProperty('disabled', true);
        });
    });

    it('\'Next\' button enabled when all mandatory fields are passed', async () => {
        await act(async () => {
            /** For testing purposes this is considered a valid tagNo */
            var propFunc = jest.fn();
            const { getByText } = render(<CreateDummyTag areaType={{title: 'Normal', value: 'PreArea'}} discipline='E' description='description text' setSelectedTags={propFunc} setArea={propFunc} setPurchaseOrder={propFunc}/>);
            await waitFor(() => expect(getByText('Next')).toHaveProperty('disabled', false));
        });
    });

    it('\'Next\' button enabled when all mandatory fields are passed for PO tag', async () => {
        await act(async () => {
            /** For testing purposes this is considered a valid tagNo */
            var propFunc = jest.fn();
            const { getByText } = render(<CreateDummyTag areaType={{title: 'Supplier', value: 'PoArea'}} discipline='E' description='description text' purchaseOrder='po' setSelectedTags={propFunc} setArea={propFunc} setPurchaseOrder={propFunc}/>);
            await waitFor(() => expect(getByText('Next')).toHaveProperty('disabled', false));
        });
    });

    it('Should display area dropdown if areaType is Normal or Site', async () => {
        await act(async () => {
            var propFunc = jest.fn();
            const { getByText } = render(<CreateDummyTag areaType={{title: 'Normal', value: 'PreArea'}} discipline='E' description='description text' setSelectedTags={propFunc} setArea={propFunc} setPurchaseOrder={propFunc}/>);
            await waitFor(() => expect(getByText('Area')).toBeInTheDocument());
        });
    });

    it('Sould display PO/CO dropdown if areaType is Supplier', async () => {
        await act(async () => {
            var propFunc = jest.fn();
            const { getByText } = render(<CreateDummyTag areaType={{title: 'Supplier', value: 'PoArea'}} discipline='E' description='description text' setSelectedTags={propFunc} setArea={propFunc} setPurchaseOrder={propFunc}/>);
            await waitFor(() => expect(getByText('PO/Calloff')).toBeInTheDocument());
        });
    });

    it.todo('Initial \'Area\' is automatically selected in dropdown');
    it.todo('Initial \'Area Type\' is automatically selected in dropdown');
    it.todo('Initial \'Discipline\' is automatically selected in dropdown');
    it.todo('Initial \'Tag suffix\' is automatically set on render');
    it.todo('Initial \'Description\' is automatically set on render');

});
