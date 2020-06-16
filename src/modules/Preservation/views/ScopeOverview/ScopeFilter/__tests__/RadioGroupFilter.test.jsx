import { render } from '@testing-library/react';
import React from 'react';
import RadioGroupFilter from '../RadioGroupFilter';

const testEdsIcon = 'edit';

describe('<RadioGroupFilter />', () => {
    it('Should render with given properties', () => {
        const options = [{title: 'Hello', value: 'world'}];

        const {getByTestId, getByLabelText} = render(<RadioGroupFilter options={options} icon={testEdsIcon} />);
        getByTestId('RadioGroupHeader').click();
        expect(getByLabelText(options[0].title)).toBeInTheDocument();
    });

    it('Should render with value selected', () => {
        const options = [{title: 'Hello', value: 'world'}];

        const {getByTestId, getByLabelText} = render(<RadioGroupFilter options={options} value={options[0].value} icon={testEdsIcon} />);
        getByTestId('RadioGroupHeader').click();
        expect(getByLabelText(options[0].title)).toHaveAttribute('checked');
    });

    it('Should render with default option selected', () => {
        const options = [{title: 'Hello', value: 'world', default: true}];

        const {getByTestId, getByLabelText} = render(<RadioGroupFilter options={options} icon={testEdsIcon} />);
        getByTestId('RadioGroupHeader').click();
        expect(getByLabelText(options[0].title)).toHaveAttribute('checked');
    });

    it('Should trigger onChange when changed', () => {
        const options = [{title: 'Hello', value: 'world'}];
        const spyFunction = jest.fn();

        const {getByTestId, getByLabelText} = render(<RadioGroupFilter options={options} onChange={spyFunction} value={null} icon={testEdsIcon} />);
        getByTestId('RadioGroupHeader').click();
        getByLabelText(options[0].title).click();
        expect(spyFunction).toHaveBeenCalledTimes(1);
        expect(spyFunction).toHaveBeenCalledWith(options[0].value);
    });

    it('Value should change on prop change', () => {
        const options = [{title: 'Hello', value: 'world'}, {title: 'Fu', value: 'Bar'}];
        const spyFunction = jest.fn();

        const {getByTestId, getByLabelText, rerender} = render(<RadioGroupFilter options={options} value={options[0].value} onChange={spyFunction} icon={testEdsIcon} />);
        rerender(<RadioGroupFilter options={options} value={options[1].value} icon={testEdsIcon}/>);
        getByTestId('RadioGroupHeader').click();
        expect(getByLabelText(options[1].title)).toHaveAttribute('checked');
    });

    it('Input should have name property set based on label', () => {
        const options = [{title: 'Hello', value: 'world'}, {title: 'Fu', value: 'Bar'}];
        const spyFunction = jest.fn();

        const {getByTestId, getByLabelText} = render(<RadioGroupFilter options={options} value={options[0].value} onChange={spyFunction} label="My input" icon={testEdsIcon} />);
        getByTestId('RadioGroupHeader').click();
        expect(getByLabelText(options[0].title).name).toEqual('my_input');
    });

    it('Input should have name property set to random value when given empty label', () => {
        const options = [{title: 'Hello', value: 'world'}, {title: 'Fu', value: 'Bar'}];
        const spyFunction = jest.fn();

        const {getByTestId, getByLabelText} = render(<RadioGroupFilter options={options} value={options[0].value} onChange={spyFunction} icon={testEdsIcon} />);
        getByTestId('RadioGroupHeader').click();
        expect(getByLabelText(options[0].title).name.indexOf('RadioGroup_')).not.toEqual(-1);
    });

});
