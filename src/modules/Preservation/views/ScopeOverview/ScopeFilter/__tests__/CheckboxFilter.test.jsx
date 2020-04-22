
/*
const filterValues: CheckboxFilterValue[] =
    [
        {
            id: '1',
            title: 'Donald Duck',
        },
        {
            id: '2',
            title: 'Onkel Skrue',
        },
        {
            id: '3',
            title: 'Bestemor Duck',
        }
    ];
*/

jest.mock('../../../../../context/PreservationContext', () => ({
    usePreservationContext: jest.fn(() => {
        return {
            apiClient: {
                getTagRequirements: () => Promise.resolve(null)
            }
        };
    })
}));

