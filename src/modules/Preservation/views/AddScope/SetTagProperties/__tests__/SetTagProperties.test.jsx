import React from 'react';
import SetTagProperties from '../SetTagProperties';
import { render } from '@testing-library/react';

const journeys = [
    {
        title: 'Journey 1',
        id: 1,
        isVoided: false,
        steps: [
            {
                id: 1,
                isVoided: false,
                mode: {
                    id: 1,
                    title: 'FABRICATION-1',
                },
                responsible: {
                    id: 1,
                    name: 'RESP-2',
                },
            },
        ],
    },
    {
        title: 'Journey 2',
        id: 2,
        isVoided: false,
        steps: [
            {
                id: 2,
                isVoided: false,
                mode: {
                    id: 2,
                    title: 'FABRICATION-1',
                },
                responsible: {
                    id: 2,
                    name: 'RESP-2',
                },
            },
        ],
    },
];

const requirementTypes = [
    {
        id: 1,
        code: 'ROTATION',
        title: 'Rotate something',
        isVoided: false,
        sortKey: 10,
        requirementDefinitions: [
            {
                id: 1,
                title: 'DEF-1',
                isVoided: false,
                needsUserInput: false,
                fields: [
                    {
                        id: 1,
                        label: 'Messurement',
                        isVoided: false,
                        fieldType: 'input',
                        unit: 'mOHM',
                        showPrevious: false,
                    },
                ],
            },
        ],
    },
    {
        id: 1,
        code: 'HEATING',
        title: 'Heating',
        isVoided: false,
        sortKey: 20,
        requirementDefinitions: [
            {
                id: 2,
                title: 'DEF-2',
                isVoided: false,
                needsUserInput: false,
                fields: [
                    {
                        id: 2,
                        label: 'Messurement',
                        isVoided: false,
                        fieldType: 'input',
                        unit: 'F',
                        showPrevious: false,
                    },
                ],
            },
        ],
    },
];

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

describe('Module: <SetTagProperties />', () => {
    it('Should render with input fields', () => {
        render(
            <SetTagProperties
                journeys={journeys}
                requirementTypes={requirementTypes}
            />
        );
        expect(document.getElementById('Remark')).toBeInTheDocument();
        expect(document.getElementById('StorageArea')).toBeInTheDocument();
    });

    it('Should render Add To Scope button disabled when form is invalid', () => {
        const { getByText } = render(
            <SetTagProperties
                journeys={journeys}
                requirementTypes={requirementTypes}
            />
        );
        expect(getByText('Add to scope').closest('button')).toHaveProperty(
            'disabled',
            true
        );
    });

    it('Should render no requirement by default', () => {
        const { queryAllByText, getByText } = render(
            <SetTagProperties
                journeys={journeys}
                requirementTypes={requirementTypes}
                addScopeMethod="AddTagsManually"
            />
        );
        expect(
            getByText('Requirements for all selected tags')
        ).toBeInTheDocument();
        getByText('Add requirement').click();
        const components = queryAllByText('Requirement');
        expect(components.length).toBe(1);
    });

    it('Should render requirement input when clicking on button', () => {
        const { queryAllByText, getByText } = render(
            <SetTagProperties
                journeys={journeys}
                requirementTypes={requirementTypes}
                addScopeMethod="AddTagsManually"
            />
        );
        getByText('Add requirement').click();
        const components = queryAllByText('Requirement');
        expect(components.length).toBe(1);
    });

    it('Should remove requirement input when clicking on delete', () => {
        const { getByText, getByTitle, queryAllByText } = render(
            <SetTagProperties
                journeys={journeys}
                requirementTypes={requirementTypes}
                addScopeMethod="AddTagsManually"
            />
        );
        getByText('Add requirement').click();
        getByTitle('Delete').click();
        const components = queryAllByText('Requirement');
        expect(components.length).toBe(0);
    });

    it('Should render a text instead of requirements, when add-scope-method is autoscope', () => {
        const { getByText } = render(
            <SetTagProperties
                journeys={journeys}
                requirementTypes={requirementTypes}
                addScopeMethod="AddTagsAutoscope"
            />
        );
        expect(
            getByText(
                'Requirements are automatically added for each tag function. Changes to requirements can be done after adding to scope.'
            )
        ).toBeInTheDocument();
    });

    it('Should render requirements, when add-scope-method is create dummy tag', () => {
        const { getByText } = render(
            <SetTagProperties
                journeys={journeys}
                requirementTypes={requirementTypes}
                addScopeMethod="AddScopeMethod.CreateDummyTag"
            />
        );
        expect(
            getByText('Requirements for all selected tags')
        ).toBeInTheDocument();
    });
});
