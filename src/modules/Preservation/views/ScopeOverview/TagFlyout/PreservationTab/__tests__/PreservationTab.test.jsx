import { render } from '@testing-library/react';
import React from 'react';

import PreservationTab from '../PreservationTab';

const tagDetails = {
    id: 1,
    tagNo: 'tag-no',
    description: 'tag-description',
    status: 'tag-status',
    journeyTitle: 'journey-title',
    mode: 'journey-mode',
    responsibleName: 'responsible-name',
    commPkgNo: 'commpkg-no',
    mcPkgNo: 'mcpkg-no',
    purchaseOrderNo: 'po-no',
    areaCode: 'area-code'
};

jest.mock('../../../../../context/PreservationContext', () => ({
    usePreservationContext: jest.fn(() => {
        return {
            apiClient: {
                getTagRequirements: jest.fn()
            }
        };
    })
}));

describe('Module: <PreservationTab />', () => {

    it('Should render tag details', () => {
        const { getByText } = render(<PreservationTab tagId={100} tagDetails={tagDetails} />);

        expect(getByText('tag-description')).toBeInTheDocument();
        expect(getByText('journey-title')).toBeInTheDocument();
        expect(getByText('journey-mode')).toBeInTheDocument();
        expect(getByText('responsible-name')).toBeInTheDocument();
        expect(getByText('commpkg-no')).toBeInTheDocument();
        expect(getByText('mcpkg-no')).toBeInTheDocument();
        expect(getByText('po-no')).toBeInTheDocument();
        expect(getByText('area-code')).toBeInTheDocument();
    });
});