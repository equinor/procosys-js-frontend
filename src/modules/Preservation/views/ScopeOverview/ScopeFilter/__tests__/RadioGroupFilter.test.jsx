import { render } from '@testing-library/react';
import React from 'react';
import RadioGroupFilter from '../RadioGroupFilter';

describe('<RadioGroupFilter />', () => {
    it('Should render with given properties', () => {
        const options = [{title: 'Hello', value: 'world'}];

        const {getByTestId, getByLabelText} = render(<RadioGroupFilter options={options} />);
        getByTestId('RadioGroupHeader').click();
        expect(getByLabelText(options[0].title)).toBeInTheDocument();
    });

    it('Should render with default value selected', () => {
        const options = [{title: 'Hello', value: 'world'}];

        const {getByTestId, getByLabelText} = render(<RadioGroupFilter options={options} value={options[0].value} />);
        getByTestId('RadioGroupHeader').click();
        expect(getByLabelText(options[0].title)).toHaveAttribute('checked');
    });

    it('Should trigger onChange when changed', () => {
        const options = [{title: 'Hello', value: 'world'}];
        const spyFunction = jest.fn();

        const {getByTestId, getByLabelText} = render(<RadioGroupFilter options={options} onChange={spyFunction} value={null} />);
        getByTestId('RadioGroupHeader').click();
        getByLabelText(options[0].title).click();
        expect(spyFunction).toHaveBeenCalledTimes(1);
        expect(spyFunction).toHaveBeenCalledWith(options[0].value);
    });

    it('Value should change on prop change', () => {
        const options = [{title: 'Hello', value: 'world'}, {title: 'Fu', value: 'Bar'}];
        const spyFunction = jest.fn();

        const {getByTestId, getByLabelText, rerender} = render(<RadioGroupFilter options={options} value={options[0].value} onChange={spyFunction} />);
        rerender(<RadioGroupFilter options={options} value={options[1].value} />);
        getByTestId('RadioGroupHeader').click();
        expect(getByLabelText(options[1].title)).toHaveAttribute('checked');
    });

    it('Input should have name property set based on label', () => {
        const options = [{title: 'Hello', value: 'world'}, {title: 'Fu', value: 'Bar'}];
        const spyFunction = jest.fn();

        const {getByTestId, getByLabelText} = render(<RadioGroupFilter options={options} value={options[0].value} onChange={spyFunction} label="My input" />);
        getByTestId('RadioGroupHeader').click();
        expect(getByLabelText(options[0].title).name).toEqual('my_input');
    });

    it('Input should have name property set to random value when given empty label', () => {
        const options = [{title: 'Hello', value: 'world'}, {title: 'Fu', value: 'Bar'}];
        const spyFunction = jest.fn();

        const {getByTestId, getByLabelText} = render(<RadioGroupFilter options={options} value={options[0].value} onChange={spyFunction} />);
        getByTestId('RadioGroupHeader').click();
        expect(getByLabelText(options[0].title).name.indexOf('RadioGroup_')).not.toEqual(-1);
    });

});
