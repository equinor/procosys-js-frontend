import React from 'react';
import SearchIPO from '../../SearchIPO';
import { render } from '@testing-library/react';

const mockIPOs = { maxAvailable: 3, ipos: [
    {id: 0, title: 'IPO-11', status: 'Planned', type: 'MDP', mcPkgs: [{mcPkgNo: '1001-D03'}, {mcPkgNo: '25221-D01'}, {mcPkgNo: '32133-A03'}, {mcPkgNo: '32133-A03'}], sent: (new Date()).toUTCString(), contractorRep: 'asdasd asd ', constructionRep: 'dawdada dwa adw '},
    {id: 1, title: 'IPO-13', status: 'Completed', type: 'DP', mcPkgs: [{mcPkgNo: '2001-D03'}], sent: (new Date(2012, 11,11,11,11)).toUTCString(), contractorRep: 'asdasd asd ', constructionRep: 'dawdada dwa adw '},
    {id: 2, title: 'IPO-13', status: 'Canceled', type: 'DP', mcPkgs: [{mcPkgNo: '2001-D03'}], sent: (new Date(2012, 11,11,11,11)).toUTCString(), contractorRep: 'asdasd asd ', constructionRep: 'dawdada dwa adw '}
] };



jest.mock('../../../context/InvitationForPunchOutContext', () => ({
    useInvitationForPunchOutContext: () => {
        return {
            apiClient: {
                getIPOs: () => Promise.resolve(mockIPOs)
            }
        };
    }
}));

describe('<SearchIPO />', () => {
    it('Should render with header', async () => {
        async () => {
            const { getByText } = render(
                <SearchIPO />
            );          
            expect(getByText('Invitation for punch-out')).toBeInTheDocument();
        };        
    });
});
