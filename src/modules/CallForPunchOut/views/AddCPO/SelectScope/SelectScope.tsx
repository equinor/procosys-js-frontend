import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { Container, Header, Search, ButtonsContainer, TopContainer, SelectComponent, Divider } from './SelectScope.style';
import Table from '@procosys/components/Table';
import { tokens } from '@equinor/eds-tokens';
import { Canceler } from '@procosys/http/HttpClient';
import { CommPkgRow, McPkgRow } from '@procosys/modules/CallForPunchOut/types';
import SelectedScope from './SelectedScope';
import { Tooltip } from '@material-ui/core';
import EdsIcon from '@procosys/components/EdsIcon';
import CommPkgTable from './CommPkgTable';
import McPkgTable from './McPkgTable';


interface SelectScopeProps {
    type: string;
    selectedCommPkgScope: CommPkgRow[];
    setSelectedCommPkgScope: (selectedCommPkgScope: CommPkgRow[]) => void;
    selectedMcPkgScope: McPkgRow[];
    setSelectedMcPkgScope: (selectedMckgScope: McPkgRow[]) => void;
    next: () => void;
    previous: () => void;
    isValid: boolean;
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

const SelectScope = ({
    type,
    selectedCommPkgScope,
    setSelectedCommPkgScope,
    selectedMcPkgScope,
    setSelectedMcPkgScope,
    next,
    previous,
    isValid
}: SelectScopeProps): JSX.Element => {
    const [availableCommPkgs, setAvailableCommPkgs] = useState<CommPkgRow[]>([]);
    const [filteredCommPkgs, setFilteredCommPkgs] = useState<CommPkgRow[]>([]);
    const [availableMcPkgs, setAvailableMcPkgs] = useState<McPkgRow[]>([]);
    const [filteredMckgs, setFilteredMcPkgs] = useState<McPkgRow[]>(dummyDataMc);
    const [filter, setFilter] = useState<string>('');
    const [mcPkgParent, setMcPkgParent] = useState<string | null>(null);

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

    // const removeAllSelectedCommPkgsInScope = (): void => {
    //     const commPkgNos: string[] = [];
    //     availableCommPkgs.forEach(c => {
    //         commPkgNos.push(c.commPkgNo);
    //     });
    //     const newSelectedCommPkgs = selectedCommPkgScope.filter(item => !commPkgNos.includes(item.commPkgNo));
    //     setSelectedCommPkgScope(newSelectedCommPkgs);
    // };

    // const addAllCommPkgsInScope = (rowData: CommPkgRow[]): void => {
    //     if (type != 'DP') {
    //         const rowsToAdd = rowData.filter(row => !selectedCommPkgScope.some(commPkg => commPkg.commPkgNo === row.commPkgNo));
    //         setSelectedCommPkgScope([...selectedCommPkgScope, ...rowsToAdd]);
    //     }
    // };

    // const removeSelectedCommPkg = (commPkgNo: string): void => {
    //     const selectedIndex = selectedCommPkgScope.findIndex(commPkg => commPkg.commPkgNo === commPkgNo);
    //     const tableDataIndex = availableCommPkgs.findIndex(commPkg => commPkg.commPkgNo === commPkgNo);
    //     if (selectedIndex > -1) {
    //         // remove from selected commPkgs
    //         const copy = [...selectedCommPkgScope.slice(0, selectedIndex), ...selectedCommPkgScope.slice(selectedIndex + 1)];
    //         setSelectedCommPkgScope(copy);

    //         // remove checked state from table data (needed to reflect change when navigating to "previous" step)
    //         const copyAvailableCommPkgs = [...availableCommPkgs];
    //         if (tableDataIndex > -1) {
    //             const commPkgToUncheck = copyAvailableCommPkgs[tableDataIndex];
    //             if (commPkgToUncheck.tableData) {
    //                 commPkgToUncheck.tableData.checked = false;
    //                 setAvailableCommPkgs(copyAvailableCommPkgs);
    //             }
    //         }
    //     }
    // };

    // const handleSingleCommPkg = (row: CommPkgRow): void => {
    //     if (row.tableData && !row.tableData.checked) {
    //         removeSelectedCommPkg(row.commPkgNo);
    //     } else {
    //         setSelectedCommPkgScope([...selectedCommPkgScope, row]);
    //     }
    // };

    // const rowSelectionChanged = (rowData: CommPkgRow[], row: CommPkgRow): void => {
    //     if (rowData.length == 0 && availableCommPkgs.length > 0) {
    //         removeAllSelectedCommPkgsInScope();
    //     } else if (rowData.length > 0 && rowData[0].tableData && !row) {
    //         addAllCommPkgsInScope(rowData);
    //     } else if (rowData.length > 0) {
    //         handleSingleCommPkg(row);
    //     }
    // };

    // const getDescriptionColumn = (commPkg: CommPkgRow): JSX.Element => {
    //     return (
    //         <div style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
    //             <Tooltip title={commPkg.description} arrow={true} enterDelay={200} enterNextDelay={100}>
    //                 <div className='controlOverflow'>{commPkg.description}</div>
    //             </Tooltip>
    //         </div>
    //     );
    // };

    // const getMcPkgs = (commPkgNo: string): void => {
    //     setMcPkgParent(commPkgNo);
    // };

    // const getToMcPkgsColumn = (commPkg: CommPkgRow): JSX.Element => {
    //     return (
    //         <div style={{ display: 'flex', alignItems: 'center', color: 'inherit', justifyContent: 'flex-end' }}>
    //             <Button variant="ghost_icon" onClick={(): void => getMcPkgs(commPkg.commPkgNo)}> 
    //                 <EdsIcon name='chevron_right'/>
    //             </Button>
    //         </div>
    //     );
    // };


    // const removeSelectedMcPkg = (mcPkgNo: string): void => {
    //     const selectedIndex = selectedMcPkgScope.findIndex(mcPkg => mcPkg.mcPkgNo === mcPkgNo);
    //     const tableDataIndex = availableMcPkgs.findIndex(mcPkg => mcPkg.mcPkgNo === mcPkgNo);
    //     if (selectedIndex > -1) {
    //         // remove from selected mcPkgs
    //         const copy = [...selectedMcPkgScope.slice(0, selectedIndex), ...selectedMcPkgScope.slice(selectedIndex + 1)];
    //         setSelectedMcPkgScope(copy);

    //         // remove checked state from table data (needed to reflect change when navigating to "previous" step)
    //         const copyAvailableMcPkgs = [...availableMcPkgs];
    //         if (tableDataIndex > -1) {
    //             const mckgToUncheck = copyAvailableMcPkgs[tableDataIndex];
    //             if (mckgToUncheck.tableData) {
    //                 mckgToUncheck.tableData.checked = false;
    //                 setAvailableMcPkgs(copyAvailableMcPkgs);
    //             }
    //         }
    //     }
    // };


    // const handleSingleMcPkg = (row: McPkgRow): void => {
    //     if (row.tableData && !row.tableData.checked) {
    //         removeSelectedMcPkg(row.mcPkgNo);
    //     } else {
    //         setSelectedMcPkgScope([...selectedMcPkgScope, row]);
    //     }
    // };

    // const addAllMcPkgsInScope = (rowData: McPkgRow[]): void => {
    //     const rowsToAdd = rowData.filter(row => !selectedMcPkgScope.some(mcPkg => mcPkg.mcPkgNo === row.mcPkgNo));
    //     setSelectedMcPkgScope([...selectedMcPkgScope, ...rowsToAdd]);
    // };

    // const removeAllSelectedMcPkgsInScope = (): void => {
    //     const mcPkgNos: string[] = [];
    //     availableMcPkgs.forEach(m => {
    //         mcPkgNos.push(m.mcPkgNo);
    //     });
    //     const newSelectedMcPkgs = selectedMcPkgScope.filter(item => !mcPkgNos.includes(item.mcPkgNo));
    //     setSelectedMcPkgScope(newSelectedMcPkgs);
    // };

    // const rowSelectionChangedMc = (rowData: McPkgRow[], row: McPkgRow): void => {
    //     if (rowData.length == 0 && availableMcPkgs.length > 0) {
    //         removeAllSelectedMcPkgsInScope();
    //     } else if (rowData.length > 0 && rowData[0].tableData && !row) {
    //         addAllMcPkgsInScope(rowData);
    //     } else if (rowData.length > 0) {
    //         handleSingleMcPkg(row);
    //     }
    // };


    // const tableColumns = [
    //     { title: 'Comm pkg', field: 'commPkgNo' },
    //     { title: 'Description', render: getDescriptionColumn, cellStyle: { minWidth: '500px', maxWidth: '800px' } },
    //     { title: 'Comm status', field: 'status' },
    //     { title: 'MDP accepted', field: 'mdpAccepted' },
    //     { title: '', render: getToMcPkgsColumn, width: '50px' }
    // ];

    // const mcTableColumns = [
    //     { title: 'Mc pkg', field: 'mcPkgNo' },
    //     { title: 'Description', render: getDescriptionColumn, cellStyle: { minWidth: '500px', maxWidth: '800px' } },
    //     { title: 'M-01 date', field: 'm01' },
    //     { title: 'M-02 date', field: 'm01' }
    // ];


    return (     
        <Container>
            <SelectComponent>
                <Header>
                    {mcPkgParent != null &&
                        <Button 
                            id='backButton'
                            onClick={(): void => setMcPkgParent(null)}
                            variant="ghost_icon" 
                        >
                            <EdsIcon name='arrow_back'/>
                        </Button> 
                    }
                    <Typography variant='h2'>{mcPkgParent == null ? 'Select commissioning packages' : 'Select MC pakcages in comm pkg' + mcPkgParent }</Typography>
                    <ButtonsContainer>
                        <Button 
                            variant='outlined'
                            onClick={previous}
                        >
                            Previous
                        </Button>
                        <Button
                            disabled={!isValid}
                            onClick={next}
                        >
                            Next
                        </Button>
                    </ButtonsContainer>
                </Header>
                <TopContainer>
                    <Search>
                        <TextField
                            id="search"
                            placeholder="Search"
                            onKeyDown={(e: any): void => {
                                e.keyCode === KEYCODE_ENTER && setFilter(e.currentTarget.value); //TODO: do we need to make a new API call every time we change filter?
                            }}
                            onInput={(e: any): void => {
                                setFilter(e.currentTarget.value);
                            }}
                        />
                    </Search>
                </TopContainer>
                
                { mcPkgParent == null &&
                    <CommPkgTable 
                        selectedCommPkgScope={selectedCommPkgScope}
                        setSelectedCommPkgScope={setSelectedCommPkgScope}
                        mcPkgParent={mcPkgParent}
                        setMcPkgParent={setMcPkgParent}
                        type={type}
                    />
                }
                { (mcPkgParent != null && type=='DP') &&
                    <McPkgTable 
                        selectedMcPkgScope={selectedMcPkgScope}
                        setSelectedMcPkgScope={setSelectedMcPkgScope}
                    />
                }
            </SelectComponent>
            <Divider />
            <SelectedScope 
                selectedCommPkgs={selectedCommPkgScope} 
                //removeCommPkg={removeSelectedCommPkg} 
                selectedMcPkgs={selectedMcPkgScope} 
                //removeMcPkg={removeSelectedMcPkg} 
            />
        </Container>
    );
};

export default SelectScope;
