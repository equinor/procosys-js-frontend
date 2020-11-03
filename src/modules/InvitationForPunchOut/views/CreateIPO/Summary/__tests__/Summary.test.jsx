import React from 'react';
import Summary from '../Summary';
import { render } from '@testing-library/react';

const generalInfo = {
    projectId: 50,
    projectName: 'OSEBERG_C',
    poType: { text: 'DP (Discipline Punch)', value: 'DP' },
    title: 'test title',
    description: 'decription is looooong and we need to add some info here okay. A description describing the PO, with general info, scope, attachments, participants, and a lot more! Maybe we will add even more as we go, we will find out.',
    startTime: new Date(2020, 11, 3, 10, 30),
    endTime: new Date(2020, 11, 3, 10, 30),
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
        organization: {
            text: 'Contractor'
        },
        externalEmail: null,
        person: null,
        role: null
    },
    {
        organization: {
            text: 'Construction company'
        },
        externalEmail: null,
        person: null,
        role: null
    }
];
    
const formatDate = (date, format) => {
    const map = {
        mm: date.getMonth() + 1,
        dd: date.getDate(),
        yyyy: date.getFullYear(),
        hours: date.getHours(),
        minutes: date.getMinutes()
    };
    return format.replace(/minutes|hours|mm|dd|yyyy/gi, matched => map[matched]);
};

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
        const { getByText, getAllByText } = render(<Summary generalInfo={generalInfo} mcPkgScope={mockMcPkgs} commPkgScope={[]} participants={participants} attachments={[]} />);
        expect(getByText(generalInfo.projectName)).toBeInTheDocument();
        expect(getByText(generalInfo.poType.text)).toBeInTheDocument();
        expect(getByText(generalInfo.title)).toBeInTheDocument();
        expect(getByText(generalInfo.description)).toBeInTheDocument();
        expect(getByText(formatDate(generalInfo.startTime, 'dd/mm/yyyy'))).toBeInTheDocument();
        expect(getAllByText(formatDate(generalInfo.startTime, 'hours:minutes')).length).toBeGreaterThan(0);
        expect(getAllByText(formatDate(generalInfo.endTime, 'hours:minutes')).length).toBeGreaterThan(0);
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
