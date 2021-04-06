import React from 'react';
import RescheduleDialog from '../RescheduleDialog';
import { fireEvent, render, waitFor } from '@testing-library/react';

const reschedulableTags = [
    {
        tagNo: 'tagNo1',
        readyToBeRescheduled: true,
        isVoided: false,
        description: 'Tag description 1',
        status: 'Active',
        requirements: [{id: 1, requirementTypeCode: 'Grease'}],
    }
];

const nonReschedulableTags = [
    {
        tagNo: 'tagNo2',
        readyToBeRescheduled: false,
        isVoided: false,
        description: 'Tag description 2',
        status: 'Active',
        requirements: [{id: 1, requirementTypeCode: 'Grease'}],
    }
];

jest.mock('../../../context/PreservationContext', () => ({
    usePreservationContext: jest.fn(() => {
        return {
            apiClient: {
                reschedule: () => Promise.resolve(),
            },
        };
    })
}));

describe('<RescheduleDialog />', () => {
    it('Should only display non-reschedulable tags when no reschedulable tags are selected', async () => {
        const { queryByText } = render(<RescheduleDialog  tags={nonReschedulableTags} open={true} onClose={()=>{}} />);
        expect(queryByText('tagNo2')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will not be rescheduled')).toBeInTheDocument();
        expect(queryByText('will be rescheduled')).not.toBeInTheDocument();
    });  

    it('Should display all tags when transferable and nontransferable tags are selected', async () => {
        const { queryByText } = render(<RescheduleDialog  tags={nonReschedulableTags.concat(reschedulableTags)} open={true} onClose={()=>{}} />);
        expect(queryByText('tagNo1')).toBeInTheDocument();
        expect(queryByText('tagNo2')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will not be rescheduled')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will be rescheduled')).toBeInTheDocument();
    });

    it('Should render only with reschedulable tag when no non reschedulable tags are selected', async () => {
        const { queryByText } = render(<RescheduleDialog  tags={reschedulableTags} open={true} onClose={()=>{}} />);
        expect(queryByText('tagNo1')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will be rescheduled')).toBeInTheDocument();
        expect(queryByText('will not be rescheduled')).not.toBeInTheDocument();
    });

    it('Should render nothing if open is false', async () => {
        const {queryByText} = render(<RescheduleDialog tags={reschedulableTags} open={false} onClose={()=>{}} />);
        expect(queryByText('Reschedule preservation')).not.toBeInTheDocument();        
    });

    it('Reschedule button is disabled if input is not given', async () => {
        const {getByText} = render(<RescheduleDialog tags={reschedulableTags} open={true} onClose={()=>{}} />);
        expect(getByText('Reschedule').closest('button').disabled).toBeTruthy();        
    });  
    
    it('Should enable Reschedule button only if every field has a value and the time field has a valid value', async () => {
        const onCloseSpy = jest.fn();
        const { getByText, getByTitle, getByTestId } = render(<RescheduleDialog tags={reschedulableTags} open={true} onClose={onCloseSpy} />);
     
        //Set time to a valid value
        const noOfWeeksField = getByTestId('No. of weeks');
        fireEvent.change(noOfWeeksField, {target : {value : '5'}});
                
        //Set direction
        getByTitle('direction').click();
        expect(getByText('Later')).toBeInTheDocument();
        getByText('Later').click();
        
        //Set comment
        const commentField = getByTestId('comment');
        fireEvent.change(commentField, {target : {value : 'test comment'}});

        //Verify button
        await waitFor(() => expect(getByText('Reschedule').closest('button')).toHaveProperty('disabled', false));

        //Set time to a non-valid value
        fireEvent.change(noOfWeeksField, {target : {value : '-1'}});

        //Verify button is disabled
        await waitFor(() => expect(getByText('Reschedule').closest('button')).toHaveProperty('disabled', true));

        //Set time to a valid number again
        fireEvent.change(noOfWeeksField, {target : {value : '1'}});

        //Verify button
        await waitFor(() => expect(getByText('Reschedule').closest('button')).toHaveProperty('disabled', false));
    });

    it('Should call onClose function when the enabled Reschedule button is clicked', async () => {
        const onCloseSpy = jest.fn();
        const { getByText, getByTitle, getByTestId } = render(<RescheduleDialog tags={reschedulableTags} open={true} onClose={onCloseSpy} />);
     
        //Set time to a valid value
        const noOfWeeksField = getByTestId('No. of weeks');
        fireEvent.change(noOfWeeksField, {target : {value : '5'}});
                
        //Set direction
        getByTitle('direction').click();
        expect(getByText('Later')).toBeInTheDocument();
        getByText('Later').click();
        
        //Set comment
        const commentField = getByTestId('comment');
        fireEvent.change(commentField, {target : {value : 'test comment'}});

        //Verify button and call to onClose
        await waitFor(() => expect(getByText('Reschedule').closest('button')).toHaveProperty('disabled', false));
        getByText('Reschedule').closest('button').click();
        await waitFor( () => expect(onCloseSpy).toBeCalledTimes(1));
    });

    it('Cancel button will fire the onClose function', async () => {
        const onCloseSpy = jest.fn();
        const {getByText} = render(<RescheduleDialog tags={reschedulableTags} open={true} onClose={onCloseSpy} />);
        getByText('Cancel').closest('button').click();
        await waitFor( () => expect(onCloseSpy).toBeCalledTimes(1));
    });  

});
