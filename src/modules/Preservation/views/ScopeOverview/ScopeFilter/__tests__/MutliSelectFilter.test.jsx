import { render } from '@testing-library/react';
import React from 'react';
import MultiSelectFilter from '../MultiSelectFilter/MultiSelectFilter';

const filterValues =
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

const testEdsIcon = 'edit';

describe('<MultiSelectFilter />', () => {
    it('Should render correct items', () => {
        const {getByText} = render(<MultiSelectFilter items={filterValues} headerLabel="Header" inputPlaceholder="Select" icon={testEdsIcon} />);
        getByText('Header').click();
        getByText('Select').click();
        expect(getByText('Donald Duck')).toBeInTheDocument();
        expect(getByText('Onkel Skrue')).toBeInTheDocument();
        expect(getByText('Bestemor Duck')).toBeInTheDocument();
    });

    it('Should trigger onChange when item is selected', () => {
        const spyFunc = jest.fn();  
        const {getByText} = render(<MultiSelectFilter items={filterValues} onChange={spyFunc} headerLabel="Header" inputPlaceholder="Select" icon={testEdsIcon} selectedItems={[]} />);
        getByText('Header').click();
        getByText('Select').click();
        getByText(filterValues[1].title).click();
        expect(spyFunc).toHaveBeenCalledTimes(1);
        expect(spyFunc).toHaveBeenLastCalledWith([filterValues[1]]);
    });

    it('Should trigger onChange with multiple items', async () => {
        const spyFunc = jest.fn();
        const {getByText} = render(<MultiSelectFilter items={filterValues} onChange={spyFunc} headerLabel="Header" inputPlaceholder="Select" icon={testEdsIcon} selectedItems={['1']}/>);
        getByText('Header').click();
        
        getByText('Select').click();
        getByText(filterValues[1].title).click();
        expect(spyFunc).toHaveBeenCalledTimes(1);
        expect(spyFunc).toHaveBeenLastCalledWith([filterValues[0],filterValues[1]]);

    });
});
