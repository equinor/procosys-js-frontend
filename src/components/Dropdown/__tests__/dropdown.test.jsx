import { fireEvent, render } from '@testing-library/react';

import Dropdown from '../index';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../assets/theme';

const renderWithTheme = (Component) => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};

const items = [
    (<h1 key="1">Item 1</h1>),
    (<h2 key="2">Item 2</h2>),
];

describe('<Dropdown />', () => {
    it('Renders with no default value', async () => {
        const { getByText } = renderWithTheme(<Dropdown text='Heading' />);
        expect(getByText('Heading')).toBeInTheDocument();
    });

    it('Renders with no supplied select items', async () => {
        const { getByText } = renderWithTheme(<Dropdown text='Heading' />);
        getByText('Heading').click();
        expect(getByText('No items available')).toBeInTheDocument();
    });

    it('Should be disabled', () => {
        const { queryByText, getByText } = renderWithTheme(<Dropdown text='Heading' disabled />);
        getByText('Heading').click();

        expect(queryByText('No items available')).toBeNull();
    });

    it('Should contain all items given by options', () => {
        const { queryAllByText, getByText } = renderWithTheme(<Dropdown text='Heading'>
            {items}
        </Dropdown>);
        getByText('Heading').click();
        expect(queryAllByText('Item', { exact: false }).length).toBe(2);
    });

    it('Hides dropdown when clicking outside of element', () => {
        const { getByText, queryByText } = render(
            <div>
                <div>ClickMe</div>
                <Dropdown text='Heading'>
                    {items}
                </Dropdown>
            </div>
        );

        getByText('Heading').click();
        fireEvent.mouseDown(getByText('ClickMe'));

        expect(queryByText('Item 1')).toBeNull();
    });

    it('Hides dropdown when selecting option', () => {
        const { getByText, queryByText } = renderWithTheme(
            <Dropdown text='Heading'>
                {items}
            </Dropdown>
        );

        getByText('Heading').click();
        getByText('Item 1').click();
        expect(queryByText('Item 1')).toBeNull();
    });

    it('Renders text input when onFilter prop is set', () => {

        const filter = jest.fn();
        const { getByText, getByPlaceholderText } = renderWithTheme(
            <Dropdown text='Heading' onFilter={filter}>
                {items}
            </Dropdown>
        );

        getByText('Heading').click();
        expect(getByPlaceholderText('Filter')).toBeInTheDocument();
    });

    it('Triggers onFilter when input is altered', () => {

        const filter = jest.fn();
        const { getByText, getByPlaceholderText } = renderWithTheme(
            <Dropdown text='Heading' onFilter={filter}>
                {items}
            </Dropdown>
        );

        getByText('Heading').click();
        const input = getByPlaceholderText('Filter');
        input.value = 'Item 1';
        fireEvent.keyUp(input);
        expect(filter).toBeCalledTimes(1);
    });

    it('Triggers onFilter with correct value', () => {

        const filter = jest.fn();
        const { getByText, getByPlaceholderText } = renderWithTheme(
            <Dropdown text='Heading' onFilter={filter}>
                {items}
            </Dropdown>
        );

        getByText('Heading').click();
        const input = getByPlaceholderText('Filter');
        input.value = 'Item 1';
        fireEvent.keyUp(input);
        expect(filter).toBeCalledWith('Item 1');
    });

    it('Resets onFilter when closing dropdown', () => {

        const filter = jest.fn();
        const { getByText, getByPlaceholderText } = renderWithTheme(
            <Dropdown text='Heading' onFilter={filter}>
                {items}
            </Dropdown>
        );

        getByText('Heading').click();
        const input = getByPlaceholderText('Filter');
        input.value = 'Item 1';
        fireEvent.keyUp(input);
        getByText('Item 1').click();
        expect(filter).toBeCalledWith('');
    });

    it('Renders with autofocus on filter input', () => {

        const filter = jest.fn();
        const { getByText, getByPlaceholderText } = renderWithTheme(
            <Dropdown text='Heading' onFilter={filter}>
                {items}
            </Dropdown>
        );

        getByText('Heading').click();
        const input = getByPlaceholderText('Filter');
        expect(input).toBe(document.activeElement);
    });
});
