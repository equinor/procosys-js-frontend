import { render } from '@testing-library/react';
import React from 'react';

import Requirements from '../Requirements';

const tagRequirements = [
    {
        id: 1,
        intervalWeeks: 2,
        nextDueWeeks: 42,
        requirementType:{code: 'rotation', title: 'requirement-type-title'},
        requirementDefinition: {title: 'requirement-definition-title'},
        nextDueTimeUtc: '2020-01-01T12:00:00.927Z',
        nextDueAsYearAndWeek: '2020w99',
        readyToBePreserved: false,
        fields: [
            {
                id: 100,
                label: 'info-label-1',
                fieldType: 'Info',
                unit: null,
                showPrevious: false,
                currentValue: null,
                previousValue: null
            },
            {
                id: 101,
                label: 'info-label-2',
                fieldType: 'Info',
                unit: null,
                showPrevious: false,
                currentValue: null,
                previousValue: null
            },
            {
                id: 103,
                label: 'checkbox-label-1',
                fieldType: 'CheckBox',
                unit: null,
                showPrevious: false,
                currentValue: {
                    isChecked: true,
                    isNA: false,
                    value: null
                },
                previousValue: null
            },
            {
                id: 104,
                label: 'checkbox-label-2',
                fieldType: 'CheckBox',
                unit: null,
                showPrevious: false,
                currentValue: null,
                previousValue: null
            },
            {
                id: 105,
                label: 'number-label-1',
                fieldType: 'Number',
                unit: 'km/h',
                showPrevious: false,
                currentValue: {
                    isChecked: false,
                    isNA: false,
                    value: 1337
                },
                previousValue: null
            },
            {
                id: 106,
                label: 'number-label-2',
                fieldType: 'Number',
                unit: 'tbsp',
                showPrevious: true,
                currentValue: null,
                previousValue: {
                    isChecked: false,
                    isNA: false,
                    value: 9999
                }
            },
            {
                id: 107,
                label: 'number-label-3',
                fieldType: 'Number',
                unit: 'M',
                showPrevious: false,
                currentValue: {
                    isChecked: false,
                    isNA: true,
                    value: null
                },
                previousValue: null
            }             
        ]
    }
];

const mockSetDirtyStateFor = jest.fn();
const mockUnsetDirtyStateFor = jest.fn();

jest.mock('@procosys/core/DirtyContext', () => ({
    useDirtyContext: () => {
        return {
            setDirtyStateFor: mockSetDirtyStateFor,
            unsetDirtyStateFor: mockUnsetDirtyStateFor
        };
    }
}));

describe('Module: <Requirements />', () => {

    it('Should render requirement header info', () => {
        const { getByText } = render(<Requirements requirements={tagRequirements} />);

        expect(getByText('requirement-type-title')).toBeInTheDocument();
        expect(getByText('requirement-definition-title')).toBeInTheDocument();
        expect(getByText('2 weeks')).toBeInTheDocument();
        expect(getByText('2020w99')).toBeInTheDocument();
        expect(getByText('42')).toBeInTheDocument();
    });

    it('Should render requirement with info, checkbox and number field types', () => {
        const { container, getByText, getAllByText } = render(<Requirements requirements={tagRequirements} />);

        // Info fields
        expect(getByText('info-label-1')).toBeInTheDocument();
        expect(getByText('info-label-2')).toBeInTheDocument();

        // Checkbox fields
        const checkBoxes = container.querySelectorAll('input[type="checkbox"]');
        expect(checkBoxes.length).toBe(2);

        // #1 (current value: isChecked = true)
        expect(getByText('checkbox-label-1')).toBeInTheDocument();
        expect(checkBoxes[0].checked).toBe(true);
        
        // #1 (current value: null)
        expect(getByText('checkbox-label-2')).toBeInTheDocument();
        expect(checkBoxes[1].checked).toBe(false);

        // Number fields

        // #1 (has current value | no previous value)
        const numberInput1 = container.querySelector('#field105');
        const numberInputPreviousValue1 = container.querySelector('#fieldPrevious105');

        expect(getByText('number-label-1')).toBeInTheDocument();
        expect(getByText('(km/h)')).toBeInTheDocument();        
        expect(numberInput1).not.toBeNull();
        expect(numberInput1.value).toBe('1337');
        expect(numberInputPreviousValue1).toBeNull();

        // #2 (no current value | has previous value)
        const numberInput2 = container.querySelector('#field106');
        const numberInputPreviousValue2 = container.querySelector('#fieldPrevious106');

        expect(getByText('number-label-2')).toBeInTheDocument();
        expect(getAllByText('(tbsp)').length).toBe(2);
        expect(numberInput2).not.toBeNull();
        expect(numberInput2.value).toBe('');
        expect(numberInputPreviousValue2).not.toBeNull();
        expect(numberInputPreviousValue2.value).toBe('9999');

        // #3 (has current value: isNA = true | no previous value)
        const numberInput3 = container.querySelector('#field107');
        const numberInputPreviousValue3 = container.querySelector('#fieldPrevious107');

        expect(getByText('number-label-3')).toBeInTheDocument();
        expect(getByText('(M)')).toBeInTheDocument();        
        expect(numberInput3).not.toBeNull();
        expect(numberInput3.value).toBe('N/A');
        expect(numberInputPreviousValue3).toBeNull();
    });
});