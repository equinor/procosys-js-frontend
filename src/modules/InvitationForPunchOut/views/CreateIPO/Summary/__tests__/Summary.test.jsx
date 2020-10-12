import { render } from '@testing-library/react';
import React from 'react';
import Summary from '../Summary';

const generalInfo = {
    projectId: 50,
    projectName: 'OSEBERG_C',
    poType: { text: 'DP (Discipline Punch)', value: 'DP' },
    title: 'test title',
    description: 'decription is looooong and we need to add some info here okay. A description describing the PO, with general info, scope, attachments, participants, and a lot more! Maybe we will add even more as we go, we will find out.',
    startDate: '2020-09-01',
    endDate: '2020-09-02',
    startTime: '10:30',
    endTime: '11:30',
    location: 'the usual spot'
};

const mockMcPkgs = [
    {
        mcPkgNo: 'Mc pkg 1',
        description: 'Description 1',
        status: 'OK',
        tableData: {
            checked: true,
        }
    },
    {
        mcPkgNo: 'Mc pkg 2',
        description: 'Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.',
        status: 'OK',
        tableData: {
            checked: true,
        }
    }
];

const participants = [
    {
        organization: 'Contractor',
        externalEmail: null,
        person: null,
        role: null
    },
    {
        organization: 'Construction company',
        externalEmail: null,
        person: null,
        role: null
    }
];

describe('Module: <Summary />', () => {
    
    it('Should render Next button disabled', () => {
        const { getByText } = render(<Summary generalInfo={generalInfo} mcPkgScope={mockMcPkgs} commPkgScope={[]} participants={participants} attachments={[]} />);
        expect(getByText('Next').closest('button')).toHaveProperty('disabled', true);
    });

    it('Should render Previous button enabled', () => {
        const { getByText } = render(<Summary generalInfo={generalInfo} mcPkgScope={mockMcPkgs} commPkgScope={[]} participants={participants} attachments={[]}/>);
        expect(getByText('Previous').closest('button')).toHaveProperty('disabled', false);
    });

    it('Should render headers', () => {
        const { getByText } = render(<Summary generalInfo={generalInfo} mcPkgScope={mockMcPkgs} commPkgScope={[]} participants={participants} attachments={[]}/>);
        expect(getByText('General info')).toBeInTheDocument();
        expect(getByText('Date and time for punch round')).toBeInTheDocument();
        expect(getByText('Reports added')).toBeInTheDocument();
        expect(getByText('Selected scope')).toBeInTheDocument();
        expect(getByText('Participants')).toBeInTheDocument();
    });

    it('Should render general info', () => {
        const { getByText } = render(<Summary generalInfo={generalInfo} mcPkgScope={mockMcPkgs} commPkgScope={[]} participants={participants} attachments={[]} />);
        expect(getByText(generalInfo.projectName)).toBeInTheDocument();
        expect(getByText(generalInfo.poType.text)).toBeInTheDocument();
        expect(getByText(generalInfo.title)).toBeInTheDocument();
        expect(getByText(generalInfo.description)).toBeInTheDocument();
        expect(getByText(generalInfo.startDate)).toBeInTheDocument();
        expect(getByText(generalInfo.startTime)).toBeInTheDocument();
        expect(getByText(generalInfo.endDate)).toBeInTheDocument();
        expect(getByText(generalInfo.endTime)).toBeInTheDocument();
        expect(getByText(generalInfo.location)).toBeInTheDocument();
    });

    it('Should render scope', () => {
        const { getByText } = render(<Summary generalInfo={generalInfo} mcPkgScope={mockMcPkgs} commPkgScope={[]} participants={participants} attachments={[]} />);
        expect(getByText(mockMcPkgs[0].mcPkgNo)).toBeInTheDocument();
        expect(getByText(mockMcPkgs[1].mcPkgNo)).toBeInTheDocument();
        expect(getByText(mockMcPkgs[0].description)).toBeInTheDocument();
        expect(getByText(mockMcPkgs[1].description)).toBeInTheDocument();
    });

});
