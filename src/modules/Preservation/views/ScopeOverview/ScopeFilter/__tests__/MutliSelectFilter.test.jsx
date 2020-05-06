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

describe('<MultiSelectFilter />', () => {
    it('Should render correct items', () => {
        const {getByText} = render(<MultiSelectFilter items={filterValues} label="Header" />);
        getByText('Header').click();
        getByText('Select').click();
        expect(getByText('Donald Duck')).toBeInTheDocument();
        expect(getByText('Onkel Skrue')).toBeInTheDocument();
        expect(getByText('Bestemor Duck')).toBeInTheDocument();
    });

    it('Should trigger onChange when item is selected', () => {
        const spyFunc = jest.fn();
        const {getByText} = render(<MultiSelectFilter items={filterValues} onChange={spyFunc} label="Header" />);
        getByText('Header').click();
        getByText('Select').click();
        getByText(filterValues[1].title).click();
        expect(spyFunc).toHaveBeenCalledTimes(1);
        expect(spyFunc).toHaveBeenLastCalledWith([filterValues[1]]);
    });

    it('Should trigger onChange with multiple items', () => {
        const spyFunc = jest.fn();
        const {getByText} = render(<MultiSelectFilter items={filterValues} onChange={spyFunc} label="Header" />);
        getByText('Header').click();
        getByText('Select').click();
        getByText(filterValues[0].title).click();
        getByText('Select').click();
        getByText(filterValues[1].title).click();
        expect(spyFunc).toHaveBeenCalledTimes(2);
        expect(spyFunc).toHaveBeenLastCalledWith([filterValues[0],filterValues[1]]);
    });

    it('Should display all selected items', () => {
        const spyFunc = jest.fn();
        const {getByText} = render(<MultiSelectFilter items={filterValues} onChange={spyFunc} label="Header"  />);
        getByText('Header').click();
        getByText('Select').click();
        getByText(filterValues[1].title).click();
        expect(getByText(filterValues[1].title)).toBeInTheDocument();
    });

    it('Should trigger onChange when item gets deselected', () => {
        const spyFunc = jest.fn();
        const {getByText} = render(<MultiSelectFilter items={filterValues} onChange={spyFunc} label="Header"  />);
        getByText('Header').click();
        getByText('Select').click();
        getByText(filterValues[1].title).click();
        getByText(filterValues[1].title).click();
        expect(spyFunc).toHaveBeenCalledTimes(2);
        expect(spyFunc).toHaveBeenLastCalledWith([]);
    });
});
