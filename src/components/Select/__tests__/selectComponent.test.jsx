import { fireEvent, render } from '@testing-library/react';

import React from 'react';
import Select from '../index';
import { ThemeProvider } from 'styled-components';
import theme from '../../../assets/theme';

const renderWithTheme = Component => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};

const items = [
    { text: 'Hello', value: 'world' },
    { text: 'Foo', value: 'Bar' },
];

describe('<Select />', () => {
    it('Renders with no default value', async () => {
        const { getByText } = renderWithTheme(<Select>Select</Select>);
        expect(getByText('Select')).toBeInTheDocument();
    });

    it('Renders with no supplied select items', async () => {
        const { getByText } = renderWithTheme(<Select>Select</Select>);
        getByText('Select').click();
        expect(getByText('No items available')).toBeInTheDocument();
    });

    it('Should be disabled', () => {
        const { queryByText, getByText } = renderWithTheme(
            <Select disabled>Select</Select>
        );
        getByText('Select').click();

        expect(queryByText('No items available')).toBeNull();
    });

    it('Should contain all items given by options', () => {
        const { getByText } = renderWithTheme(
            <Select data={items}>Select</Select>
        );
        getByText('Select').click();
        expect(getByText(items[0].text)).toBeInTheDocument();
        expect(getByText(items[1].text)).toBeInTheDocument();
    });

    it('Should trigger onChange when new item is selected', () => {
        const eventWatcher = jest.fn(() => {});
        const { getByText } = renderWithTheme(
            <Select data={items} onChange={eventWatcher}>
                Select
            </Select>
        );
        //Activate dropdown
        const dropdownButton = getByText('Select');
        dropdownButton.click();
        // Click on item
        getByText(items[1].text).click();

        expect(eventWatcher).toHaveBeenCalledTimes(1);
        expect(eventWatcher).toHaveBeenCalledWith(1);
    });

    it('Should have default item selected', () => {
        const { getByText } = renderWithTheme(
            <Select data={items} selectedIndex={1}>
                Irrelevant
            </Select>
        );
        getByText('Irrelevant').click();

        const element = getByText(items[1].text);
        expect(element.dataset['selected']).toBe('true');
    });

    it('Hides dropdown when clicking outside of element', () => {
        const { getByText, queryByText } = render(
            <div>
                <div>ClickMe</div>
                <Select data={items}>Select</Select>
            </div>
        );

        getByText('Select').click();
        expect(queryByText(items[0].text)).toBeInTheDocument();
        fireEvent.mouseDown(getByText('ClickMe'));

        expect(queryByText(items[0].text)).toBeNull();
    });
});
