import { fireEvent, render } from '@testing-library/react';

import OptionsDropdown from '../index';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../assets/theme';

const renderWithTheme = (Component) => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};

const items = [<h1 key="1">Item 1</h1>, <h2 key="2">Item 2</h2>];

describe('<Dropdown />', () => {
    it('Renders with no default value', async () => {
        const { getByText } = renderWithTheme(
            <OptionsDropdown text="Heading" />
        );
        expect(getByText('Heading')).toBeInTheDocument();
    });

    it('Renders with no supplied select items', async () => {
        const { getByText } = renderWithTheme(
            <OptionsDropdown text="Heading" />
        );
        getByText('Heading').click();
    });

    it('Should be disabled', () => {
        const { queryByText, getByText } = renderWithTheme(
            <OptionsDropdown text="Heading" disabled />
        );
        getByText('Heading').click();

        expect(queryByText('No items found')).toBeNull();
    });

    it('Should contain all items given by options', () => {
        const { queryAllByText, getByText } = renderWithTheme(
            <OptionsDropdown text="Heading">{items}</OptionsDropdown>
        );
        getByText('Heading').click();
        expect(queryAllByText('Item', { exact: false }).length).toBe(2);
    });

    it('Should hide dropdown when clicking outside of element', () => {
        const { getByText, queryByText } = render(
            <div>
                <div>ClickMe</div>
                <OptionsDropdown text="Heading">{items}</OptionsDropdown>
            </div>
        );

        getByText('Heading').click();
        fireEvent.mouseDown(getByText('ClickMe'));

        expect(queryByText('Item 1')).toBeNull();
    });

    it('Should not hide dropdown when selecting option', () => {
        const { getByText, queryByText } = renderWithTheme(
            <OptionsDropdown text="Heading">{items}</OptionsDropdown>
        );

        getByText('Heading').click();
        getByText('Item 1').click();
        expect(queryByText('Item 1')).toBeInTheDocument();
    });
});
