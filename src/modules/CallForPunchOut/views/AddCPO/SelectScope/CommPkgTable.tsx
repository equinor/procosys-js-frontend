import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import Table from '@procosys/components/Table';
import { tokens } from '@equinor/eds-tokens';
import { Canceler } from '@procosys/http/HttpClient';
import { CommPkgRow, McPkgRow } from '@procosys/modules/CallForPunchOut/types';
import SelectedScope from './SelectedScope';
import { Tooltip } from '@material-ui/core';
import EdsIcon from '@procosys/components/EdsIcon';
import {Container} from './CommPkgTable.style';


interface CommPkgTableProps {
    selectedCommPkgScope: CommPkgRow[];
    setSelectedCommPkgScope: (selectedCommPkgScope: CommPkgRow[]) => void;
    mcPkgParent: string | null,
    setMcPkgParent: (commPkgNo: string | null) => void;
    type: string;
}

const KEYCODE_ENTER = 13;

const today = new Date();
const date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();

const dummyData: CommPkgRow[] = [
    {
        commPkgNo: 'Comm pkg 1',
        description: 'Description 1',
        status: 'PB',
        mdpAccepted: date
    },
    {
        commPkgNo: 'Comm pkg 2',
        description: 'Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.',
        status: 'OK',
        mdpAccepted: date
    },
    {
        commPkgNo: 'test',
        description: 'Description 3',
        status: 'PA',
        mdpAccepted: date
    }
];

const dummyDataMc: McPkgRow[] = [
    {
        mcPkgNo: 'Mc pkg 1',
        description: 'Description 1',
        m01: date,
        m02: date
    },
    {
        mcPkgNo: 'Mc pkg 3',
        description: 'Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.',
        m01: date,
        m02: date
    },
    {
        mcPkgNo: 'Mc pkg 3',
        description: 'Description 3',
        m01: date,
        m02: date
    }
];

const CommPkgTable = ({
    selectedCommPkgScope,
    setSelectedCommPkgScope,
    mcPkgParent,
    setMcPkgParent,
    type
}: CommPkgTableProps): JSX.Element => {
    const [availableCommPkgs, setAvailableCommPkgs] = useState<CommPkgRow[]>([]);
    const [filteredCommPkgs, setFilteredCommPkgs] = useState<CommPkgRow[]>([]);
    const [availableMcPkgs, setAvailableMcPkgs] = useState<McPkgRow[]>([]);
    const [filteredMckgs, setFilteredMcPkgs] = useState<McPkgRow[]>(dummyDataMc);
    const [filter, setFilter] = useState<string>('');

    let requestCanceler: Canceler;
    useEffect(() => {
        (async (): Promise<void> => {
            const allCommPkgs = dummyData; //TODO: API call for commpkgs
            setAvailableCommPkgs(allCommPkgs);
            setFilteredCommPkgs(allCommPkgs);
        })();
        return (): void => requestCanceler && requestCanceler();
    },[]);

    useEffect(() => {
        if (filter.length <= 0) {
            setFilteredCommPkgs(dummyData);
            return;
        }
        setFilteredCommPkgs(availableCommPkgs.filter((c: CommPkgRow) => {
            return c.commPkgNo.toLowerCase().indexOf(filter.toLowerCase()) > -1;
        }));
    }, [filter]);

    const removeAllSelectedCommPkgsInScope = (): void => {
        const commPkgNos: string[] = [];
        availableCommPkgs.forEach(c => {
            commPkgNos.push(c.commPkgNo);
        });
        const newSelectedCommPkgs = selectedCommPkgScope.filter(item => !commPkgNos.includes(item.commPkgNo));
        setSelectedCommPkgScope(newSelectedCommPkgs);
    };

    const addAllCommPkgsInScope = (rowData: CommPkgRow[]): void => {
        //if (type != 'DP') {
        const rowsToAdd = rowData.filter(row => !selectedCommPkgScope.some(commPkg => commPkg.commPkgNo === row.commPkgNo));
        setSelectedCommPkgScope([...selectedCommPkgScope, ...rowsToAdd]);
        //}
    };

    const removeSelectedCommPkg = (commPkgNo: string): void => {
        const selectedIndex = selectedCommPkgScope.findIndex(commPkg => commPkg.commPkgNo === commPkgNo);
        const tableDataIndex = availableCommPkgs.findIndex(commPkg => commPkg.commPkgNo === commPkgNo);
        if (selectedIndex > -1) {
            // remove from selected commPkgs
            const copy = [...selectedCommPkgScope.slice(0, selectedIndex), ...selectedCommPkgScope.slice(selectedIndex + 1)];
            setSelectedCommPkgScope(copy);

            // remove checked state from table data (needed to reflect change when navigating to "previous" step)
            const copyAvailableCommPkgs = [...availableCommPkgs];
            if (tableDataIndex > -1) {
                const commPkgToUncheck = copyAvailableCommPkgs[tableDataIndex];
                if (commPkgToUncheck.tableData) {
                    commPkgToUncheck.tableData.checked = false;
                    setAvailableCommPkgs(copyAvailableCommPkgs);
                }
            }
        }
    };


    useEffect(() => {
        const test = { navn: 'Elisabeth', barn: { navn: 'Christer'}};
        const copy = {...test, barn: {...test.barn}};

    },[]);

    const handleSingleCommPkg = (row: CommPkgRow): void => {
        if (row.tableData && !row.tableData.checked) {
            removeSelectedCommPkg(row.commPkgNo);
        } else {
            setSelectedCommPkgScope([...selectedCommPkgScope, row]);
        }
    };

    const rowSelectionChanged = (rowData: CommPkgRow[], row: CommPkgRow): void => {
        if (rowData.length == 0 && availableCommPkgs.length > 0) {
            removeAllSelectedCommPkgsInScope();
        } else if (rowData.length > 0 && rowData[0].tableData && !row) {
            addAllCommPkgsInScope(rowData);
        } else if (rowData.length > 0) {
            handleSingleCommPkg(row);
        }
    };

    const getDescriptionColumn = (commPkg: CommPkgRow): JSX.Element => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
                <Tooltip title={commPkg.description} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <div className='controlOverflow'>{commPkg.description}</div>
                </Tooltip>
            </div>
        );
    };

    const getMcPkgs = (commPkgNo: string): void => {
        setMcPkgParent(commPkgNo);
    };

    const getToMcPkgsColumn = (commPkg: CommPkgRow): JSX.Element => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', color: 'inherit', justifyContent: 'flex-end' }}>
                <Button variant="ghost_icon" onClick={(): void => getMcPkgs(commPkg.commPkgNo)}> 
                    <EdsIcon name='chevron_right'/>
                </Button>
            </div>
        );
    };

    const tableColumns = [
        { title: 'Comm pkg', field: 'commPkgNo' },
        { title: 'Description', render: getDescriptionColumn, cellStyle: { minWidth: '500px', maxWidth: '800px' } },
        { title: 'Comm status', field: 'status' },
        { title: 'MDP accepted', field: 'mdpAccepted' },
        { title: '', render: getToMcPkgsColumn, width: '50px' }
    ];

    return (     
        <Container disableSelectAll={type == 'DP'}>
            <Table
                columns={tableColumns}
                data={filteredCommPkgs}
                options={{
                    toolbar: false,
                    showTitle: false,
                    search: false,
                    draggable: false,
                    pageSize: 10,
                    emptyRowsWhenPaging: false,
                    pageSizeOptions: [10, 50, 100],
                    padding: 'dense',
                    headerStyle: {
                        backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba,
                    },
                    selection: true,
                    selectionProps: (data: CommPkgRow): any => ({
                        disabled: type == 'DP' && selectedCommPkgScope.length > 0 && selectedCommPkgScope[0].commPkgNo != data.commPkgNo,
                        disableRipple: true,
                    }),
                    rowStyle: (data): any => ({
                        backgroundColor: data.tableData.checked && '#e6faec'
                    })
                }}
                style={{
                    boxShadow: 'none'
                }}
                onSelectionChange={(rowData, row): void => {
                    rowSelectionChanged(rowData, row);
                }}
            />
        </Container>
    );
};

export default CommPkgTable;
