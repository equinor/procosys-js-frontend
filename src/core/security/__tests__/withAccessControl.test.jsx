import { render } from '@testing-library/react';
import React from 'react';
import withAccessControl from '../withAccessControl';

jest.mock('../../../core/PlantContext',() => ({
    useCurrentPlant: () => {
        return {
            permissions: ['IPO/READ']
        };
    }
}));

jest.mock('../../ProcosysSettings',() => ({
    featureIsEnabled: () => {
        return false;
    }
}));

class TestComponent extends React.Component {  
    render () {    
        return (      
            <p>
                Test
            </p>    
        );  
    }
}
describe('<WithAccessControl />', () => {

    it('Renders component when no permissions required or feature flags', async () => {
        const Component = withAccessControl(TestComponent);
        const {getByText} = render(<Component />);
        expect(getByText('Test')).toBeInTheDocument();
    });

    it('Renders with when sufficient permissions', async () => {
        const Component = withAccessControl(TestComponent, ['IPO/READ']);
        const {getByText} = render(<Component />);
        expect(getByText('Test')).toBeInTheDocument();
    });

    it('Renders with error when insufficient permissions', async () => {
        const Component = withAccessControl(TestComponent, ['PRESERVATION/SUPERPERMISSION']);
        const {getByText, queryByText} = render(<Component />);
        expect(queryByText('Test')).not.toBeInTheDocument();
        expect(getByText('Access restricted')).toBeInTheDocument();
    });

    it('Renders with error when feature flag enabled', async () => {
        const Component = withAccessControl(TestComponent, [], ['IPO']);
        const {getByText, queryByText} = render(<Component />);
        expect(queryByText('Test')).not.toBeInTheDocument();
        expect(getByText('Feature disabled')).toBeInTheDocument();
    });

    it('Renders with feature flag error when feature flag enabled and insufficient privileges', async () => {
        const Component = withAccessControl(TestComponent, ['PRESERVATION/SUPERPERMISSION'], ['IPO']);
        const {getByText, queryByText} = render(<Component />);
        expect(queryByText('Test')).not.toBeInTheDocument();
        expect(getByText('Feature disabled')).toBeInTheDocument();
    });
});
