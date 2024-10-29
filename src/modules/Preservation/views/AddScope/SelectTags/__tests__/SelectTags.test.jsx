import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import SelectTags from '../SelectTags';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../../../context/PreservationContext', () => ({
    usePreservationContext: jest.fn(() => {
        return {
            project: {
                id: 1,
                name: 'test',
                description: 'project',
            },
        };
    }),
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
    useDirtyContext: () => ({
        setDirtyStateFor: mockSetDirtyStateFor,
        unsetDirtyStateFor: mockUnsetDirtyStateFor,
    }),
}));

const tableData = [
    {
        tagNo: 'tagno-test',
        description: 'description-test',
        purchaseOrderTitle: 'pono-test',
        commPkgNo: 'commpkg-test',
        mcPkgNo: 'mcpkgno-test',
        isPreserved: false,
    },
];

describe('Module: <SelectTags />', () => {
    it('Should render Next button disabled when no rows are selected', () => {
        const { getByText } = render(
            <MemoryRouter>
                <SelectTags
                    selectedTags={[]}
                    scopeTableData={[]}
                    setSelectedTags={() => void 0}
                    setSelectedTableRows={() => void 0}
                />
            </MemoryRouter>
        );
        expect(getByText('Next').closest('button')).toHaveProperty(
            'disabled',
            true
        );
    });

    it('Should render Next button enabled when rows are selected', () => {
        const selectedTags = [{ tagNo: 'test' }];

        const { getByText } = render(
            <MemoryRouter>
                <SelectTags
                    selectedTags={selectedTags}
                    scopeTableData={tableData}
                    setSelectedTags={() => void 0}
                    setSelectedTableRows={() => void 0}
                />
            </MemoryRouter>
        );

        expect(getByText('Next').closest('button')).toHaveProperty(
            'disabled',
            false
        );
    });

    it('Should render Tag info in table', () => {
        const { getByText } = render(
            <MemoryRouter>
                <SelectTags
                    selectedTags={[]}
                    scopeTableData={tableData}
                    setSelectedTags={() => void 0}
                    setSelectedTableRows={() => void 0}
                />
            </MemoryRouter>
        );

        expect(getByText('tagno-test')).toBeInTheDocument();
        expect(getByText('description-test')).toBeInTheDocument();
        expect(getByText('pono-test')).toBeInTheDocument();
        expect(getByText('commpkg-test')).toBeInTheDocument();
        expect(getByText('mcpkgno-test')).toBeInTheDocument();
    });

    it('Should update selected tags when clicking checkbox in table', () => {
        const selectedTags = [];
        let i = 0;

        const setSelectedTags = () => {
            if (i === 0) {
                i++;
                return;
            }
            selectedTags.push({ tagNo: 'test' });
        };

        const { container } = render(
            <MemoryRouter>
                <SelectTags
                    selectedTags={selectedTags}
                    scopeTableData={tableData}
                    setSelectedTags={setSelectedTags}
                    setSelectedTableRows={() => 1}
                />
            </MemoryRouter>
        );

        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        fireEvent.click(checkboxes[1]); // first checkbox after "select all"
        expect(selectedTags.length).toBe(1);
    });

    it('Should not render search field when add-scope-method is autoscope', () => {
        const { queryByText } = render(
            <MemoryRouter>
                <SelectTags
                    selectedTags={[]}
                    scopeTableData={tableData}
                    addScopeMethod="AddTagsAutoscope"
                    setSelectedTags={() => void 0}
                    setSelectedTableRows={() => void 0}
                />
            </MemoryRouter>
        );
        expect(
            queryByText(
                'Type the start of a tag number and press enter to load tags. Note: Minimum two characters are required.'
            )
        ).not.toBeInTheDocument();
    });

    it('Should render search field when add-scope-method is manually', () => {
        const { queryByText } = render(
            <MemoryRouter>
                <SelectTags
                    selectedTags={[]}
                    scopeTableData={tableData}
                    addScopeMethod="AddTagsManually"
                    setSelectedTags={() => void 0}
                    setSelectedTableRows={() => void 0}
                />
            </MemoryRouter>
        );
        expect(
            queryByText(
                'Type the start of a tag number and press enter to load tags. Note: Minimum two characters are required.'
            )
        ).toBeInTheDocument();
    });
});
