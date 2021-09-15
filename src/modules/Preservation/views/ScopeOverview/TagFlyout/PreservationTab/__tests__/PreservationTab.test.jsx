import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import PreservationTab from '../PreservationTab';
import { act } from 'react-dom/test-utils';

const tagDetails = {
    id: 1,
    tagNo: 'tag-no',
    description: 'tag-description',
    status: 'tag-status',
    journey: {title: 'journey-title'},
    mode: {title:'journey-mode'},
    responsible: {code: 'responsible-name'},
    commPkgNo: 'commpkg-no',
    mcPkgNo: 'mcpkg-no',
    purchaseOrderNo: 'po-no',
    areaCode: 'area-code',
    remark: 'remark text',
    storageArea: 'SA123'
};

jest.mock('../../../../../context/PreservationContext', () => ({
    usePreservationContext: jest.fn(() => {
        return {
            apiClient: {
                getTagRequirements: () => Promise.resolve(null)
            }
        };
    })
}));

const mockSetDirtyStateFor = jest.fn();
const mockUnsetDirtyStateFor = jest.fn();

jest.mock('@procosys/core/DirtyContext', () => ({
    useDirtyContext: () => {
        return {
            setDirtyStateFor: mockSetDirtyStateFor,
            unsetDirtyStateFor: mockUnsetDirtyStateFor
        };
    }
}));

describe('<PreservationTab />', () => {

    it('Should render tag details', async () => {
        await act(async () => {
            const { getByText, getByTestId } = render(<PreservationTab tagId={100} tagDetails={tagDetails} />);

            expect(getByText('tag-description')).toBeInTheDocument();
            expect(getByText('journey-title')).toBeInTheDocument();
            expect(getByText('journey-mode')).toBeInTheDocument();
            expect(getByText('responsible-name')).toBeInTheDocument();
            expect(getByText('commpkg-no')).toBeInTheDocument();
            expect(getByText('mcpkg-no')).toBeInTheDocument();
            expect(getByText('po-no')).toBeInTheDocument();
            expect(getByText('area-code')).toBeInTheDocument();
            expect(getByTestId('remarkReadOnly')).toHaveTextContent('remark text');
            expect(getByTestId('storageAreaReadOnly')).toHaveTextContent('SA123');
        });
    });

    it('Should render spinner when given no requirements', async () => {
        await act(async () => {
            const { getByTitle } = render(<PreservationTab tagId={100} tagDetails={tagDetails} />);

            expect(getByTitle('Loading')).toBeInTheDocument();
        });
    });

    it('Should not render  remark and storage area text fields when read only', async () => {
        await act(async () => {
            const { queryByLabelText } = render(<PreservationTab tagId={100} tagDetails={tagDetails} />);
            expect(queryByLabelText('Remark', {exact:  false})).toBeNull();
            expect(queryByLabelText('Storage area', {exact:  false})).toBeNull();
        });
    });

    it('Should have two edit icons on render', async () => {
        await act(async () => {
            const { getByTestId } = render(<PreservationTab tagId={100} tagDetails={tagDetails} />);

            expect(getByTestId('remarkEditIcon')).toBeInTheDocument();
            expect(getByTestId('storageAreaEditIcon')).toBeInTheDocument();
        });
    });

    it('Should be able to edit text fields', async () => {
        await act(async () => {
            const { getByTestId } = render(<PreservationTab tagId={100} tagDetails={tagDetails} />);

            fireEvent.click(getByTestId('remarkEditIcon'));
            await waitFor(() => expect(document.getElementById('remark').disabled).not.toBeTruthy());
            expect(getByTestId('remarkClearIcon')).toBeInTheDocument();
            expect(getByTestId('remarkCheckIcon')).toBeInTheDocument();

            fireEvent.click(getByTestId('storageAreaEditIcon'));
            await waitFor(() => expect(document.getElementById('storageArea').disabled).not.toBeTruthy());
            expect(getByTestId('storageAreaClearIcon')).toBeInTheDocument();
            expect(getByTestId('storageAreaCheckIcon')).toBeInTheDocument();
        });
    });

    it.todo('Should render as readonly');
    it.todo('Should render as editable');
    it.todo('Should render requirements');
});
