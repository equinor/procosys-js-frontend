import React from 'react';
import SelectScope from '../SelectScope';
import { render } from '@testing-library/react';


jest.mock('react-virtualized-auto-sizer', () => {
    return (props) => {
        const renderCallback = props.children;

        return renderCallback({
            width: 1200,
            height: 900
        });
    };
});

describe('<SelectScope />', () => {

    it('Renders with title for MDP', async () => {
        var propFunc = jest.fn();
        const { getByText } = render(<SelectScope selectedMcPkgScope={propFunc}/>);
        expect(getByText('Select commissioning packages')).toBeInTheDocument();
    });

    it('Renders with title for DP', async () => {
        var propFunc = jest.fn();
        const { getByText } = render(<SelectScope type="DP" selectedMcPkgScope={propFunc}/>);
        expect(getByText('Click on the arrow next to a comm pkg to open MC scope')).toBeInTheDocument();
    });

});
