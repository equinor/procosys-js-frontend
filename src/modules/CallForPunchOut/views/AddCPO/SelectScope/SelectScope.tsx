import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { Container, Header, InnerContainer, Search, ButtonsContainer, TopContainer } from './SelectScope.style';
import Table from '@procosys/components/Table';
import { tokens } from '@equinor/eds-tokens';
import { Canceler } from '@procosys/http/HttpClient';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { CommPkgRow } from '@procosys/modules/CallForPunchOut/types';

interface SelectScopeProps {
    //projectId: number;
    //fromMain: boolean;
    selectedScope: CommPkgRow[];
    setSelectedScope: (selectedScope: CommPkgRow[]) => void;
}

const KEYCODE_ENTER = 13;

const tableColumns = [
    { title: 'Comm pkg', field: 'commPkgNo' },
    { title: 'Description', field: 'description' },
    { title: 'Comm status', field: 'commPkgStatus' },
    { title: 'MDP accepted', field: 'mdpAccepted' }
];

const dummyData: CommPkgRow[] = [
    {
        commPkgNo: 'Comm pkg 1',
        description: 'Description 1',
        commPkgStatus: 'PB',
        mdpAccepted: true
    },
    {
        commPkgNo: 'Comm pkg 2',
        description: 'Description 2',
        commPkgStatus: 'OK',
        mdpAccepted: false
    },
    {
        commPkgNo: 'test',
        description: 'Description 3',
        commPkgStatus: 'PA',
        mdpAccepted: false
    }
];

const SelectScope = ({
    //projectId,
    //fromMain,
    selectedScope,
    setSelectedScope
}: SelectScopeProps): JSX.Element => {
    const [isValidForm] = useState<boolean>(false);
    const [availableCommPkgs, setAvailableCommPkgs] = useState<CommPkgRow[]>([]);
    const [filteredCommPkgs, setFilteredCommPkgs] = useState<CommPkgRow[]>([]);
    const [filter, setFilter] = useState<string>('');

    let requestCanceler: Canceler;
    useEffect(() => {
        (async (): Promise<void> => {
            const allCommPkgs = dummyData; //TODO: API call for commpkgs
            console.log(allCommPkgs);
            setAvailableCommPkgs(allCommPkgs);
            setFilteredCommPkgs(allCommPkgs);
        })();
        return (): void => requestCanceler && requestCanceler();
    },[]);

    useEffect(() => {
        console.log(1);
        if (filter.length <= 0) {
            setFilteredCommPkgs(dummyData);
            return;
        }
        console.log(2);

        setFilteredCommPkgs(availableCommPkgs.filter((c: CommPkgRow) => {
            return c.commPkgNo.toLowerCase().indexOf(filter.toLowerCase()) > -1;
        }));
    }, [filter]);

    useEffect(() => {
        console.log(filteredCommPkgs);

    }, [filteredCommPkgs]);

    const removeAllSelectedCommPkgsInScope = (): void => {
        const commPkgNos: string[] = [];
        availableCommPkgs.forEach(c => {
            commPkgNos.push(c.commPkgNo);
        });
        const newSelectedCommPkgs = selectedScope.filter(item => !commPkgNos.includes(item.commPkgNo));
        setSelectedScope(newSelectedCommPkgs);
    };

    const addAllCommPkgsInScope = (rowData: CommPkgRow[]): void => {
        const rowsToAdd = rowData.filter(row => !selectedScope.some(commPkg => commPkg.commPkgNo === row.commPkgNo));
        setSelectedScope([...selectedScope, ...rowsToAdd]);
    };

    const removeSelectedCommPkg = (commPkgNo: string): void => {
        const selectedIndex = selectedScope.findIndex(commPkg => commPkg.commPkgNo === commPkgNo);
        const tableDataIndex = availableCommPkgs.findIndex(commPkg => commPkg.commPkgNo === commPkgNo);
        if (selectedIndex > -1) {
            // remove from selected commPkgs
            const copy = [...selectedScope.slice(0, selectedIndex), ...selectedScope.slice(selectedIndex + 1)];
            setSelectedScope(copy);

            // remove checked state from table data (needed to reflect change when navigating to "previous" step)
            const copyAvailableCommPkgs = [...availableCommPkgs];
            if (tableDataIndex > -1) {
                const commPkgToUncheck = copyAvailableCommPkgs[tableDataIndex];
                if (commPkgToUncheck.tableData) {
                    commPkgToUncheck.tableData.checked = false;
                    setAvailableCommPkgs(copyAvailableCommPkgs);
                }
            }

            showSnackbarNotification(`Comm pkg ${commPkgNo} has been removed from selection`, 5000);
        }
    };

    const handleSingleCommPkg = (row: CommPkgRow): void => {
        if (row.tableData && !row.tableData.checked) {
            removeSelectedCommPkg(row.commPkgNo);
        } else {
            setSelectedScope([...selectedScope, row]);
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

    return (     
        <Container>
            <Header>
                <Typography variant='h2'>Select commissioning packages</Typography>
                <ButtonsContainer>
                    <Button variant='outlined'>Previous</Button>
                    <Button disabled={!isValidForm}>Next</Button>
                </ButtonsContainer>
            </Header>

            <TopContainer>
                <InnerContainer>
                    <Search>
                        <TextField
                            id="search"
                            placeholder="Search comm pkg no"
                            onKeyDown={(e: any): void => {
                                e.keyCode === KEYCODE_ENTER && setFilter(e.currentTarget.value);
                            }}
                            onInput={(e: any): void => {
                                setFilter(e.currentTarget.value);
                            }}
                        />
                    </Search>
                </InnerContainer>
                
            </TopContainer>
            {/* {props.isLoading &&
                <LoadingContainer>
                    <Loading title="Loading" />
                </LoadingContainer>} */}
            {
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
                        selectionProps: (): any => ({
                            disableRipple: true
                        })
                    }}
                    style={{
                        boxShadow: 'none'
                    }}
                    onSelectionChange={(rowData, row): void => {
                        rowSelectionChanged(rowData, row);
                    }}
                />
            }
        </Container >
    );
};

export default SelectScope;
