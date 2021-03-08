import ProcosysTable from '../ProcosysTable';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import theme from '../../../assets/theme';



const tags = {
    'maxAvailable': 10195,
    'tags': [
        {
            'actionStatus': null,
            'areaCode': 'M50',
            'calloffNo': null,
            'commPkgNo': null,
            'description': 'XXXX-ML-11-0396-CA2-00-A',
            'disciplineCode': 'P',
            'id': 164232,
            'isNew': false,
            'isVoided': false,
            'mcPkgNo': null,
            'mode': 'FABRICATION',
            'nextMode': 'SUPPLIER',
            'nextResponsibleCode': 'ACPF',
            'purchaseOrderNo': null,
            'readyToBePreserved': false,
            'readyToBeStarted': false,
            'readyToBeTransferred': true,
            'readyToBeCompleted': false,
            'readyToBeRescheduled': true,
            'readyToBeDuplicated': false,
            'requirements': [
                {
                    'id': 820284,
                    'requirementTypeCode': 'Rotation',
                    'requirementTypeIcon': 'Rotate',
                    'nextDueTimeUtc': '2020-07-20T13:21:29.2879943Z',
                    'nextDueAsYearAndWeek': '2020w30',
                    'nextDueWeeks': -32,
                    'readyToBePreserved': false
                }
            ],
            'responsibleCode': 'ABB',
            'responsibleDescription': 'ABB scope oppgradering av kontrollrom',
            'status': 'Active',
            'storageArea': '',
            'tagFunctionCode': 'ML',
            'tagNo': '0000-ML-11-0396-CA2-00-A',
            'tagType': 'Standard',
            'rowVersion': 'AAAAAAAD7uo='
        },
        {
            'actionStatus': null,
            'areaCode': 'C00',
            'calloffNo': null,
            'commPkgNo': null,
            'description': 'wevgwqevev',
            'disciplineCode': 'E',
            'id': 164255,
            'isNew': false,
            'isVoided': false,
            'mcPkgNo': null,
            'mode': 'SUPPLIER',
            'nextMode': 'COMMISSIONING',
            'nextResponsibleCode': 'KMF',
            'purchaseOrderNo': null,
            'readyToBePreserved': false,
            'readyToBeStarted': true,
            'readyToBeTransferred': false,
            'readyToBeCompleted': false,
            'readyToBeRescheduled': false,
            'readyToBeDuplicated': true,
            'requirements': [
                {
                    'id': 820311,
                    'requirementTypeCode': 'Area',
                    'requirementTypeIcon': 'Area',
                    'nextDueTimeUtc': null,
                    'nextDueAsYearAndWeek': null,
                    'nextDueWeeks': null,
                    'readyToBePreserved': false
                }
            ],
            'responsibleCode': 'ACPF',
            'responsibleDescription': 'Fabrication Site Project work by Alcatel',
            'status': 'Not started',
            'storageArea': 'qwef',
            'tagFunctionCode': null,
            'tagNo': '#PRE-E-C00-QWEFEV',
            'tagType': 'PreArea',
            'rowVersion': 'AAAAAAAD7wI='
        },
        {
            'actionStatus': 'HasOverdue',
            'areaCode': 'AA700',
            'calloffNo': null,
            'commPkgNo': null,
            'description': 'wefasdf',
            'disciplineCode': 'E',
            'id': 164210,
            'isNew': false,
            'isVoided': false,
            'mcPkgNo': null,
            'mode': 'FABRICATION',
            'nextMode': 'testasdf',
            'nextResponsibleCode': 'ACEPF',
            'purchaseOrderNo': null,
            'readyToBePreserved': false,
            'readyToBeStarted': true,
            'readyToBeTransferred': false,
            'readyToBeCompleted': false,
            'readyToBeRescheduled': false,
            'readyToBeDuplicated': true,
            'requirements': [
                {
                    'id': 820243,
                    'requirementTypeCode': 'Area',
                    'requirementTypeIcon': 'Area',
                    'nextDueTimeUtc': null,
                    'nextDueAsYearAndWeek': null,
                    'nextDueWeeks': null,
                    'readyToBePreserved': false
                }
            ],
            'responsibleCode': 'ABBPI',
            'responsibleDescription': 'On-/Offshore Project work by ABB Technology',
            'status': 'Not started',
            'storageArea': 'wefs',
            'tagFunctionCode': null,
            'tagNo': '#PRE-E-AA700-SDF',
            'tagType': 'PreArea',
            'rowVersion': 'AAAAAAAD7tQ='
        },
        {
            'actionStatus': null,
            'areaCode': 'A00',
            'calloffNo': null,
            'commPkgNo': null,
            'description': 'wef',
            'disciplineCode': 'E',
            'id': 164271,
            'isNew': false,
            'isVoided': false,
            'mcPkgNo': null,
            'mode': 'SUPPLIER',
            'nextMode': null,
            'nextResponsibleCode': null,
            'purchaseOrderNo': null,
            'readyToBePreserved': false,
            'readyToBeStarted': true,
            'readyToBeTransferred': false,
            'readyToBeCompleted': false,
            'readyToBeRescheduled': false,
            'readyToBeDuplicated': true,
            'requirements': [
                {
                    'id': 820331,
                    'requirementTypeCode': 'Area',
                    'requirementTypeIcon': 'Area',
                    'nextDueTimeUtc': null,
                    'nextDueAsYearAndWeek': null,
                    'nextDueWeeks': null,
                    'readyToBePreserved': false
                }
            ],
            'responsibleCode': 'ACPF',
            'responsibleDescription': 'Fabrication Site Project work by Alcatel',
            'status': 'Not started',
            'storageArea': 'wef',
            'tagFunctionCode': null,
            'tagNo': '#SITE-E-A00-WEF',
            'tagType': 'SiteArea',
            'rowVersion': 'AAAAAAAD7xE='
        },
        {
            'actionStatus': null,
            'areaCode': 'AA700',
            'calloffNo': null,
            'commPkgNo': null,
            'description': 'wef',
            'disciplineCode': 'E',
            'id': 164225,
            'isNew': false,
            'isVoided': false,
            'mcPkgNo': null,
            'mode': 'FABRICATION',
            'nextMode': null,
            'nextResponsibleCode': null,
            'purchaseOrderNo': null,
            'readyToBePreserved': false,
            'readyToBeStarted': true,
            'readyToBeTransferred': false,
            'readyToBeCompleted': false,
            'readyToBeRescheduled': false,
            'readyToBeDuplicated': true,
            'requirements': [
                {
                    'id': 820270,
                    'requirementTypeCode': 'Area',
                    'requirementTypeIcon': 'Area',
                    'nextDueTimeUtc': null,
                    'nextDueAsYearAndWeek': null,
                    'nextDueWeeks': null,
                    'readyToBePreserved': false
                },
                {
                    'id': 820271,
                    'requirementTypeCode': 'Rotation',
                    'requirementTypeIcon': 'Rotate',
                    'nextDueTimeUtc': null,
                    'nextDueAsYearAndWeek': null,
                    'nextDueWeeks': null,
                    'readyToBePreserved': false
                }
            ],
            'responsibleCode': 'ACPF',
            'responsibleDescription': 'Fabrication Site Project work by Alcatel',
            'status': 'Not started',
            'storageArea': 'wef',
            'tagFunctionCode': null,
            'tagNo': '#PRE-E-AA700-SDFSDF',
            'tagType': 'PreArea',
            'rowVersion': 'AAAAAAAD7uM='
        },
        {
            'actionStatus': 'HasOverdue',
            'areaCode': 'M30',
            'calloffNo': null,
            'commPkgNo': '1101-C06',
            'description': 'Thermo element winding 2R V',
            'disciplineCode': 'I',
            'id': 164257,
            'isNew': false,
            'isVoided': false,
            'mcPkgNo': '1101-I352',
            'mode': 'COMMISSIONING',
            'nextMode': 'FABRICATION',
            'nextResponsibleCode': 'ACPF',
            'purchaseOrderNo': '10408',
            'readyToBePreserved': false,
            'readyToBeStarted': true,
            'readyToBeTransferred': false,
            'readyToBeCompleted': false,
            'readyToBeRescheduled': false,
            'readyToBeDuplicated': false,
            'requirements': [
                {
                    'id': 820313,
                    'requirementTypeCode': 'Area',
                    'requirementTypeIcon': 'Area',
                    'nextDueTimeUtc': null,
                    'nextDueAsYearAndWeek': null,
                    'nextDueWeeks': null,
                    'readyToBePreserved': false
                }
            ],
            'responsibleCode': 'KMF',
            'responsibleDescription': 'Kværner Mosjøen (Sandnessjøen) Fabr.',
            'status': 'Not started',
            'storageArea': 'remark',
            'tagFunctionCode': 'TE',
            'tagNo': 'TE  -11-0365A',
            'tagType': 'Standard',
            'rowVersion': 'AAAAAAAD7wQ='
        },
        {
            'actionStatus': null,
            'areaCode': 'C01',
            'calloffNo': null,
            'commPkgNo': null,
            'description': 'testwef',
            'disciplineCode': 'E',
            'id': 164272,
            'isNew': false,
            'isVoided': false,
            'mcPkgNo': null,
            'mode': 'FABRICATION',
            'nextMode': null,
            'nextResponsibleCode': null,
            'purchaseOrderNo': null,
            'readyToBePreserved': false,
            'readyToBeStarted': true,
            'readyToBeTransferred': false,
            'readyToBeCompleted': false,
            'readyToBeRescheduled': false,
            'readyToBeDuplicated': true,
            'requirements': [
                {
                    'id': 820332,
                    'requirementTypeCode': 'Area',
                    'requirementTypeIcon': 'Area',
                    'nextDueTimeUtc': null,
                    'nextDueAsYearAndWeek': null,
                    'nextDueWeeks': null,
                    'readyToBePreserved': false
                }
            ],
            'responsibleCode': 'ACPF',
            'responsibleDescription': 'Fabrication Site Project work by Alcatel',
            'status': 'Not started',
            'storageArea': null,
            'tagFunctionCode': null,
            'tagNo': '#PRE-E-C01-WEF',
            'tagType': 'PreArea',
            'rowVersion': 'AAAAAAAD7xI='
        },
        {
            'actionStatus': null,
            'areaCode': 'A00',
            'calloffNo': null,
            'commPkgNo': null,
            'description': 'testweefqwef',
            'disciplineCode': 'E',
            'id': 164270,
            'isNew': false,
            'isVoided': false,
            'mcPkgNo': null,
            'mode': 'COMMISSIONING',
            'nextMode': 'FABRICATION',
            'nextResponsibleCode': 'ACPF',
            'purchaseOrderNo': null,
            'readyToBePreserved': false,
            'readyToBeStarted': true,
            'readyToBeTransferred': false,
            'readyToBeCompleted': false,
            'readyToBeRescheduled': false,
            'readyToBeDuplicated': true,
            'requirements': [
                {
                    'id': 820330,
                    'requirementTypeCode': 'Area',
                    'requirementTypeIcon': 'Area',
                    'nextDueTimeUtc': null,
                    'nextDueAsYearAndWeek': null,
                    'nextDueWeeks': null,
                    'readyToBePreserved': false
                }
            ],
            'responsibleCode': 'KMF',
            'responsibleDescription': 'Kværner Mosjøen (Sandnessjøen) Fabr.',
            'status': 'Not started',
            'storageArea': null,
            'tagFunctionCode': null,
            'tagNo': '#PRE-E-A00-WEF',
            'tagType': 'PreArea',
            'rowVersion': 'AAAAAAAD7xA='
        },
        {
            'actionStatus': null,
            'areaCode': 'A00',
            'calloffNo': null,
            'commPkgNo': null,
            'description': 'testing',
            'disciplineCode': 'E',
            'id': 164279,
            'isNew': false,
            'isVoided': false,
            'mcPkgNo': null,
            'mode': 'SUPPLIER',
            'nextMode': 'COMMISSIONING',
            'nextResponsibleCode': 'KMF',
            'purchaseOrderNo': null,
            'readyToBePreserved': false,
            'readyToBeStarted': true,
            'readyToBeTransferred': false,
            'readyToBeCompleted': false,
            'readyToBeRescheduled': false,
            'readyToBeDuplicated': true,
            'requirements': [
                {
                    'id': 820339,
                    'requirementTypeCode': 'IR Test',
                    'requirementTypeIcon': 'Electrical',
                    'nextDueTimeUtc': null,
                    'nextDueAsYearAndWeek': null,
                    'nextDueWeeks': null,
                    'readyToBePreserved': false
                }
            ],
            'responsibleCode': 'ACPF',
            'responsibleDescription': 'Fabrication Site Project work by Alcatel',
            'status': 'Not started',
            'storageArea': null,
            'tagFunctionCode': null,
            'tagNo': '#PRE-E-A00-AB',
            'tagType': 'PreArea',
            'rowVersion': 'AAAAAAAD7xk='
        },
        {
            'actionStatus': null,
            'areaCode': 'A00',
            'calloffNo': null,
            'commPkgNo': null,
            'description': 'testasdfqwef',
            'disciplineCode': 'E',
            'id': 164267,
            'isNew': false,
            'isVoided': false,
            'mcPkgNo': null,
            'mode': 'SUPPLIER',
            'nextMode': 'COMMISSIONING',
            'nextResponsibleCode': 'KMF',
            'purchaseOrderNo': null,
            'readyToBePreserved': false,
            'readyToBeStarted': true,
            'readyToBeTransferred': false,
            'readyToBeCompleted': false,
            'readyToBeRescheduled': false,
            'readyToBeDuplicated': true,
            'requirements': [
                {
                    'id': 820327,
                    'requirementTypeCode': 'IR Test',
                    'requirementTypeIcon': 'Electrical',
                    'nextDueTimeUtc': null,
                    'nextDueAsYearAndWeek': null,
                    'nextDueWeeks': null,
                    'readyToBePreserved': false
                }
            ],
            'responsibleCode': 'ACPF',
            'responsibleDescription': 'Fabrication Site Project work by Alcatel',
            'status': 'Not started',
            'storageArea': null,
            'tagFunctionCode': null,
            'tagNo': '#PRE-E-A00-QWEF',
            'tagType': 'PreArea',
            'rowVersion': 'AAAAAAAD7w0='
        }
    ]
};

const columns = [
    {
        Header: 'Tag nr',
        accessor: 'tagNo',
        id: 'tagNo',
        width: 180,
        maxWidth: 400,
        minWidth: 150
    },
    {
        Header: 'Description',
        accessor: 'description',
        width: 250,
        maxWidth: 400,
        minWidth: 150
    },
    {
        Header: 'Resp',
        accessor: 'responsibleCode'
    },
    {
        Header: 'Disc',
        accessor: 'disciplineCode'
    },
    {
        Header: 'Status',
        accessor: 'actionStatus'
    }
];


const maxRows = 10;

const renderWithTheme = (Component) => {
    return render(
        <ThemeProvider theme={theme}>{Component}</ThemeProvider>
    );
};

jest.mock('react-virtualized-auto-sizer', () => {
    return (props) => {
        const renderCallback = props.children;

        return renderCallback({
            width: 1200,
            height: 900
        });
    };
});


describe('<ProcosysTable />', () => {
    it('Render test', async () => {
        const { queryAllByRole, queryAllByText } = renderWithTheme(

            <ProcosysTable
                setPageSize={() => { }}
                onSort={() => { }}
                onSelectedChange={() => { }}
                pageIndex={0}
                pageSize={10}
                columns={columns}
                maxRowCount={maxRows}
                data={tags.tags}
                fetchData={() => { }}
                loading={false}
                pageCount={1} />
        );

        expect(queryAllByText('ACPF').length).toBe(6);
        expect(queryAllByRole('row').length).toBe(11); // data + header
        expect(queryAllByText('0000-ML-11-0396-CA2-00-A').length).toBe(1);
    });
});
