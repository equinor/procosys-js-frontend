import React from 'react';
import CreateAreaTag from '../CreateAreaTag';
import { render, act, waitForElement } from '@testing-library/react';

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
                getDisciplines: () => Promise.resolve(mockDisciplines)
            }
        };
    }
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

    it.todo('Initial \'Area\' is automatically selected in dropdown');
    it.todo('Initial \'Area Type\' is automatically selected in dropdown');
    it.todo('Initial \'Discipline\' is automatically selected in dropdown');
    it.todo('Initial \'Tag suffix\' is automatically set on render');
    it.todo('Initial \'Description\' is automatically set on render');

    it('Displays no icon when properties are not set', async () => {

        await act(async () => {
            render(<CreateAreaTag />);
            expect(document.querySelector('#tagNumberIcon')).not.toBeInTheDocument();
        });

    });

    it('Displays \'Valid\' Icon when properties are set', async () => {
        await act(async () => {
            const {debug} = render(<CreateAreaTag area={mockAreas[0]} discipline={mockDisciplines[0]} areaType={{ text: 'Normal', value: 'PreArea' }} suffix="12" />);
            await waitForElement(() => document.querySelector('#tagNumberIcon'));
            debug();
        });
        //expect(document.querySelector('#tagNumberIcon')).toBeInTheDocument();

    });

    // it('Renders with no icon', async () => {
    //     await act(async () => {
    //         const { queryByTestId} = render(<CreateAreaTag />);
    //         expect(queryByTestId('Suffix')).toBeNull();
    //     });
    // });

    // it('Displays warning icon when suffix contains space', async () => {
    //     const setSuffix = jest.fn();
    //     await act(async () => {
    //         const { getByLabelText } = render(<CreateAreaTag setSuffix={setSuffix} />);
    //         const inputNode = getByLabelText('Tag number suffix (space not allowed)');
    //         inputNode.value = '1 2';
    //         await act(async () => {
    //             fireEvent.change(inputNode);
    //             expect(setSuffix).toBeCalledTimes(1);//(inputNode.value).toEqual('1 2');
    //         });

    //         //debug();
    //     });
    //     // const tmp = document.getElementById('tagNumberIcon');
    //     // expect(tmp).not.toBeNull();
    // });

    // it('Displays check icon when valid tag no', async () => {
    //     const { debug, getByLabelText, getByText, queryAllByText} = render(<CreateAreaTag />);
    //     await act(async () => {
    //         getByLabelText('Area type').click();
    //         expect(queryAllByText('', { exact: false }).length).toBe(2);
    //     });
    //     debug();
    //     //expect(document.getElementById('test')).toBeNull;

    // });

});
