import { act, render, waitFor } from '@testing-library/react';

import CreateDummyTag from '../CreateDummyTag';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const mockDisciplines = [
    {
        code: 'DC1',
        description: 'Discipline description 1',
    },
    {
        code: 'DC2',
        description: 'Discipline description 2',
    },
];

const mockAreas = [
    {
        code: 'AC1',
        description: 'area description 1',
    },
    {
        code: 'AC2',
        description: 'area description 2',
    },
];

const mockPOs = [
    {
        title: '01',
        description: 'po description 1',
    },
];

const mockValidTagNo = {
    tagNo: '#PRE-E',
    exists: false,
};

const mockTagDetails = {
    tagId: 1,
    tagNo: '#PRE-E-Test',
    description: 'pre area test tag',
    areaCode: 'AC1',
    tagType: 'PreArea',
    disciplineCode: 'DC1',
};

const spacesInTagNoMessage = 'The suffix cannot containt spaces.';

jest.mock('../../../../context/PreservationContext', () => ({
    usePreservationContext: () => {
        return {
            project: {
                id: 1,
                name: 'test',
                description: 'project',
            },
            apiClient: {
                checkAreaTagNo: () => Promise.resolve(mockValidTagNo),
                getTagDetails: () => Promise.resolve(mockTagDetails),
            },
            libraryApiClient: {
                getAreas: () => Promise.resolve(mockAreas),
                getDisciplines: () => Promise.resolve(mockDisciplines),
            },
        };
    },
}));

jest.mock('../../../../../../core/ProcosysContext', () => ({
    useProcosysContext: () => {
        return {
            procosysApiClient: {
                getPurchaseOrders: () => Promise.resolve(mockPOs),
            },
        };
    },
}));

jest.mock('react-router-dom', () => {
    const actualReactRouterDom = jest.requireActual('react-router-dom');

    return {
        ...actualReactRouterDom,
        useNavigate: jest.fn(),
        useLocation: jest.fn(() => ({
            pathname: '/some-path',
        })),
        NavLink: ({ to, className, children }) => {
            const React = require('react');
            return React.createElement(
                'a',
                {
                    href: to,
                    className:
                        typeof className === 'function'
                            ? className({ isActive: true })
                            : className,
                },
                children
            );
        },
    };
});

const mockSetDirtyStateFor = jest.fn();
const mockUnsetDirtyStateFor = jest.fn();

jest.mock('@procosys/core/DirtyContext', () => ({
    useDirtyContext: () => {
        return {
            setDirtyStateFor: mockSetDirtyStateFor,
            unsetDirtyStateFor: mockUnsetDirtyStateFor,
        };
    },
}));

describe('<CreateDummyTag />', () => {
    /** Because of API calls using effect hooks, we need to wrap everything in act */
    it('Next button should be disabled intially.', async () => {
        await act(async () => {
            var propFunc = jest.fn();
            const { getByText } = render(
                <MemoryRouter>
                    <CreateDummyTag
                        setSelectedTags={propFunc}
                        setArea={propFunc}
                        setPurchaseOrder={propFunc}
                    />
                </MemoryRouter>
            );
            expect(getByText('Next').closest('button')).toHaveProperty(
                'disabled',
                true
            );
        });
    });

    it('Renders with correct fields', async () => {
        /** Because of API calls using effect hooks, we need to wrap everything in act */
        await act(async () => {
            var propFunc = jest.fn();
            const { queryByText } = render(
                <MemoryRouter>
                    <CreateDummyTag
                        setSelectedTags={propFunc}
                        setArea={propFunc}
                        setPurchaseOrder={propFunc}
                    />
                </MemoryRouter>
            );

            expect(queryByText('Dummy type')).toBeInTheDocument();
            expect(queryByText('Discipline')).toBeInTheDocument();
            expect(queryByText(/Tag number/)).toBeInTheDocument();
            expect(queryByText('Description')).toBeInTheDocument();
        });
    });

    it('Displays error message when suffix contains space', async () => {
        await act(async () => {
            var propFunc = jest.fn();
            const { queryByText } = render(
                <MemoryRouter>
                    <CreateDummyTag
                        suffix="1 2"
                        setSelectedTags={propFunc}
                        setArea={propFunc}
                        setPurchaseOrder={propFunc}
                    />
                </MemoryRouter>
            );
            await waitFor(() =>
                expect(queryByText(spacesInTagNoMessage)).toBeInTheDocument()
            );
        });
    });

    it('"Next" button disabled when not all mandatory fields are passed', async () => {
        await act(async () => {
            var propFunc = jest.fn();
            const { getByText } = render(
                <MemoryRouter>
                    <CreateDummyTag
                        areaType={{ title: 'Normal', value: 'PreArea' }}
                        discipline="testDiscipline"
                        suffix="12"
                        setSelectedTags={propFunc}
                        setArea={propFunc}
                        setPurchaseOrder={propFunc}
                    />
                </MemoryRouter>
            );
            expect(getByText('Next').closest('button')).toHaveProperty(
                'disabled',
                true
            );
        });
    });

    it('"Next" button disabled when not all mandatory fields are passed for PO tag', async () => {
        await act(async () => {
            var propFunc = jest.fn();
            const { getByText } = render(
                <MemoryRouter>
                    <CreateDummyTag
                        areaType={{ title: 'Supplier', value: 'PoArea' }}
                        discipline="testDiscipline"
                        description="test description"
                        suffix="12"
                        setSelectedTags={propFunc}
                        setArea={propFunc}
                        setPurchaseOrder={propFunc}
                    />
                </MemoryRouter>
            );
            expect(getByText('Next').closest('button')).toHaveProperty(
                'disabled',
                true
            );
        });
    });

    it('"Next" button enabled when all mandatory fields are passed', async () => {
        await act(async () => {
            /** For testing purposes this is considered a valid tagNo */
            var propFunc = jest.fn();
            const { getByText } = render(
                <MemoryRouter>
                    <CreateDummyTag
                        areaType={{ title: 'Normal', value: 'PreArea' }}
                        discipline="E"
                        description="description text"
                        setSelectedTags={propFunc}
                        setArea={propFunc}
                        setPurchaseOrder={propFunc}
                    />
                </MemoryRouter>
            );

            await waitFor(() =>
                expect(getByText('Next').closest('button')).toHaveProperty(
                    'disabled',
                    false
                )
            );
        });
    });

    it('"Next" button enabled when all mandatory fields are passed for PO tag', async () => {
        await act(async () => {
            /** For testing purposes this is considered a valid tagNo */
            var propFunc = jest.fn();
            const { getByText } = render(
                <MemoryRouter>
                    <CreateDummyTag
                        areaType={{ title: 'Supplier', value: 'PoArea' }}
                        discipline="E"
                        description="description text"
                        purchaseOrder="po"
                        setSelectedTags={propFunc}
                        setArea={propFunc}
                        setPurchaseOrder={propFunc}
                    />
                </MemoryRouter>
            );
            await waitFor(() =>
                expect(getByText('Next').closest('button')).toHaveProperty(
                    'disabled',
                    false
                )
            );
        });
    });

    it('Should display area dropdown if areaType is Normal or Site', async () => {
        await act(async () => {
            var propFunc = jest.fn();
            const { getByText } = render(
                <MemoryRouter>
                    <CreateDummyTag
                        areaType={{ title: 'Normal', value: 'PreArea' }}
                        discipline="E"
                        description="description text"
                        setSelectedTags={propFunc}
                        setArea={propFunc}
                        setPurchaseOrder={propFunc}
                    />
                </MemoryRouter>
            );
            await waitFor(() => expect(getByText('Area')).toBeInTheDocument());
        });
    });

    it('Sould display PO/CO dropdown if areaType is Supplier', async () => {
        await act(async () => {
            var propFunc = jest.fn();
            const { getByText } = render(
                <MemoryRouter>
                    <CreateDummyTag
                        areaType={{ title: 'Supplier', value: 'PoArea' }}
                        discipline="E"
                        description="description text"
                        setSelectedTags={propFunc}
                        setArea={propFunc}
                        setPurchaseOrder={propFunc}
                    />
                </MemoryRouter>
            );
            await waitFor(() =>
                expect(getByText('PO/Calloff')).toBeInTheDocument()
            );
        });
    });

    it('Should display screen for duplication of dummy tag, and duplicate button should be disabled if not mandatory fields are filled in.', async () => {
        await act(async () => {
            var propFunc = jest.fn();
            const { getByText } = render(
                <MemoryRouter>
                    <CreateDummyTag
                        duplicateTagId={1}
                        areaType={{ text: 'Area (#PRE)', value: 'PreArea' }}
                        discipline={{
                            code: 'DC1',
                            description: 'Discipline description 1',
                        }}
                        area={{
                            code: 'AC1',
                            description: 'area description 1',
                        }}
                        setDescription={propFunc}
                        setSelectedTags={propFunc}
                        setArea={propFunc}
                        setPurchaseOrder={propFunc}
                        setDiscipline={propFunc}
                        setAreaType={propFunc}
                    />
                </MemoryRouter>
            );

            expect(getByText('Duplicate dummy tag')).toBeInTheDocument();
            await waitFor(() =>
                expect(getByText('Area (#PRE)')).toBeInTheDocument()
            );
            await waitFor(() =>
                expect(
                    getByText('Discipline description 1')
                ).toBeInTheDocument()
            );
            await waitFor(() =>
                expect(getByText('area description 1')).toBeInTheDocument()
            );
            expect(getByText('Duplicate').closest('button')).toHaveAttribute(
                'disabled'
            );
        });
    });

    it('Should display screen for duplication of dummy tag, and Duplicate should be enabled if all mandatory fields are filled in.', async () => {
        await act(async () => {
            var propFunc = jest.fn();
            const { queryByText, getByTestId } = render(
                <MemoryRouter>
                    <CreateDummyTag
                        duplicateTagId={1}
                        areaType={{ text: 'Area (#PRE)', value: 'PreArea' }}
                        discipline={{
                            code: 'DC1',
                            description: 'Discipline description 1',
                        }}
                        area={{
                            code: 'AC1',
                            description: 'area description 1',
                        }}
                        setDescription={propFunc}
                        setSelectedTags={propFunc}
                        setArea={propFunc}
                        setPurchaseOrder={propFunc}
                        setDiscipline={propFunc}
                        setAreaType={propFunc}
                        suffix="suffixtest"
                        description="description test"
                    />
                </MemoryRouter>
            );

            await waitFor(() =>
                expect(getByTestId('suffix').value).toBe('suffixtest')
            );
            await waitFor(() =>
                expect(queryByText('description test')).toBeInTheDocument()
            );
            await waitFor(() =>
                expect(
                    queryByText('Duplicate').closest('button')
                ).not.toHaveAttribute('disabled')
            );
        });
    });
});
