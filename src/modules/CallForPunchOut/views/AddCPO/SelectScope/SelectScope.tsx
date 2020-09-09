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
    const [currentCommPkg, setCurrentCommPkg] = useState<string | null>(null);
    const [selectedMcScopeParent, setSelectedMcScopeParent] = useState<string | null>(null);
    const [dpCommPkg, setDpCommPkg] = useState<CommPkgRow | null>(null);

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

    useEffect(() => {
        setFilter('');
    }, [currentCommPkg]);

    return (     
        <Container>
            <SelectComponent>
                <Header>
                    {currentCommPkg != null &&
                        <Button 
                            id='backButton'
                            onClick={(): void => setCurrentCommPkg(null)}
                            variant="ghost_icon" 
                        >
                            <EdsIcon name='arrow_back'/>
                        </Button> 
                    }
                    <Typography variant='h2'>{currentCommPkg == null ? 'Select commissioning packages' : 'Select MC pakcages in comm pkg' + currentCommPkg }</Typography>
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
                
                { currentCommPkg == null &&
                    <CommPkgTable 
                        selectedCommPkgScope={selectedCommPkgScope}
                        setSelectedCommPkgScope={setSelectedCommPkgScope}
                        setCurrentCommPkg={setCurrentCommPkg}
                        type={type}
                    />
                }
                { (currentCommPkg != null && type=='DP') &&
                    <McPkgTable 
                        selectedMcPkgScope={selectedMcPkgScope}
                        setSelectedMcPkgScope={setSelectedMcPkgScope}
                        selectedMcScopeParent={selectedMcScopeParent}
                        setSelectedMcScopeParent={setSelectedMcScopeParent}
                        currentCommPkg={currentCommPkg}
                        enabled={selectedCommPkgScope.length == 0 || currentCommPkg == selectedCommPkgScope[0].commPkgNo}
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
