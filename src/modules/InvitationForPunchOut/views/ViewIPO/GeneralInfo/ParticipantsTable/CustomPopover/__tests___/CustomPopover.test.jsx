// // TODO: un-comment when react & react-dom can be updated
// import { act, fireEvent, render } from '@testing-library/react';

// import CustomPopover from '../CustomPopover';
// import { OutlookResponseType } from '../../../../enums';
// import React from 'react';
// import { ThemeProvider } from 'styled-components';
// import theme from '../../../../../../../../assets/theme';

// const renderWithTheme = (Component) => {
//     return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
// };

// const participants = [
//     {
//         organization: 'Constr',
//         sortKey: 1,
//         canSign: true,
//         externalEmail: null,
//         person: null,
//         functionalRole: {
//             id: 1,
//             code: 'one',
//             email: 'funcitonalRole@asd.com',
//             persons: [
//                 {
//                     id: 1,
//                     firstName: 'First',
//                     lastName: 'ASdsklandasnd',
//                     azureOid: 'azure1',
//                     email: 'asdadasd@dwwdwd.com',
//                     rowVersion: '123123',
//                     required: true,
//                     response: OutlookResponseType.ATTENDING,
//                 },
//                 {
//                     id: 2,
//                     firstName: 'Second',
//                     lastName: 'ASdsklandasnd',
//                     azureOid: 'azure2',
//                     email: 'asdadasd2@dwwdwd.com',
//                     rowVersion: '1231234',
//                     required: true,
//                     response: OutlookResponseType.NONE,
//                 },
//             ],
//             response: OutlookResponseType.TENTATIVE,
//             rowVersion: '123o875',
//         },
//         note: '',
//         attended: true,
//         rowVersion: '123123',
//     },
// ];
//
describe('<CustomPopover />', () => {
    it.todo('fix tests when react is upgradeable');
    //     it('Should open the popover on click', async () => {
    //         const { getByTestId, getAllByRole } = await renderWithTheme(
    //             <CustomPopover participant={participants[0]} />
    //         );
    //         await act(async () => {
    //             const button = getByTestId('popover-anchor-ref');
    //             fireEvent.click(button);
    //         });
    //         const buttons = getAllByRole('button');
    //         expect(buttons).toHaveLength(2);
    //     });
    //     it('Should render every person and the correct responses for the correct people', async () => {
    //         const { getByTestId } = renderWithTheme(
    //             <CustomPopover participant={participants[0]} />
    //         );
    //         await act(async () => {
    //             const button = getByTestId('popover-anchor-ref');
    //             fireEvent.click(button);
    //         });
    //         participants[0].functionalRole.persons.forEach((person) => {
    //             const response = getByTestId(person.id.toString() + 'row', {
    //                 exact: false,
    //             });
    //             expect(response).toHaveTextContent(person.firstName);
    //             expect(response).toHaveTextContent(person.response);
    //         });
    //     });
});
