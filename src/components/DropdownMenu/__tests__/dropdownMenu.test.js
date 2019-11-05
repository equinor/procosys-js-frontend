import DropdownMenu from './../index';
import { render } from '@testing-library/react';
import React from 'react';

describe("Initial module loading on application render", () => {

    const items = [{ text: "Hello", value: "world" }, { text: "Foo", value: "Bar" }]


    it('Renders with no default value', async () => {
        const { getByText } = render(<DropdownMenu />);
        expect(getByText('Select')).toBeInTheDocument();
    });

    it('Renders with no supplied select items', async () => {
        const { getByText } = render(<DropdownMenu />);
        getByText('Select').click();
        expect(getByText('No items available')).toBeInTheDocument();
    });

    it('Should be disabled', () => {
        const { queryByText, getByText } = render(<DropdownMenu disabled />);
        getByText('Select').click();

        expect(queryByText('No items available')).toBeNull();
    });

    it('Should contain all items given by options', () => {
        const { getByText } = render(<DropdownMenu data={items} />);
        getByText('Select').click();
        expect(getByText(items[0].text)).toBeInTheDocument();
        expect(getByText(items[1].text)).toBeInTheDocument();
    });

    it('Should trigger onChange when new item is selected', () => {
        const eventWatcher = jest.fn(() => { });
        const { getByText } = render(<DropdownMenu data={items} onChange={eventWatcher} />);
        //Activate dropdown
        const dropdownButton = getByText('Select')
        dropdownButton.click();
        // Click on item
        getByText(items[1].text).click();

        expect(eventWatcher).toHaveBeenCalledTimes(1);
        expect(eventWatcher).toHaveBeenCalledWith(items[1], undefined);
    });

    it('Should trigger onChange with already selected value in callback', () => {
        const eventWatcher = jest.fn(() => { });
        const { getByText } = render(<DropdownMenu data={items} onChange={eventWatcher} selected={items[1]} />);
        //Activate dropdown
        const dropdownButton = getByText(items[1].text)
        dropdownButton.click();
        // Click on item
        getByText(items[0].text).click();

        expect(eventWatcher).toHaveBeenCalledTimes(1);
        expect(eventWatcher).toHaveBeenCalledWith(items[0], items[1]);
    });

    it('Should have default item selected', () => {
        const { getByText } = render(<DropdownMenu data={items} selected={items[1]} />);
        expect(getByText('Foo')).toBeInTheDocument();
    })

});

