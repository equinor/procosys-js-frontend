import { render } from '@testing-library/react';
import React from 'react';
import withAccessControl from '../withAccessControl';
import {useProcosysContext} from '@procosys/core/ProcosysContext';
// import ProCoSysClient from '@procosys/http/ProCoSysClient';

//const dummyComponent = <div>Select</div>;

jest.mock('@procosys/core/ProcosysContext');



useProcosysContext.mockImplementation(() => ({
    procosysApiClient: {
        getAllPlantsForUserAsync: () => Promise.resolve([])
    }
}));

jest.mock('../../../core/PlantContext',() => ({
    useCurrentPlant: () => {
        return {
            permissions: ['IPO/READ']
        };
    }
}));

// jest.mock('@procosys/http/ProCoSysClient', () => {
//     console.log('Getting API Mock');
//     return () => ({
//         getAllPlantsForUserAsync: () => Promise.resolve([]),
//     });
// });

class MockApp extends React.Component {  
    render () {    
        return (      
            <p>
                Hello
            </p>    
        );  
    }
}
const Tmp = withAccessControl(MockApp);
describe('<WithAccessControl />', () => {

    it('Renders component when no permissions required or feature flags', async () => {
        const {getByText} = render(<Tmp />);
        expect(getByText('Hello')).toBeInTheDocument();

    });

    // it('Renders with error when no permissions', async () => {
    //     const {getByText, debug} = render(withAccessControl(dummyComponent,  ['PRESERVATION/SUPERPERMISSION']));
    //     debug();
    //     expect(getByText('Select')).toBeInTheDocument();
    // });
});


