import React, { useEffect, useState, useRef } from 'react';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { Container, Header, Search, ButtonsContainer, TopContainer, SelectComponent } from './SelectScope.style';
import { CommPkgRow, McScope } from '@procosys/modules/InvitationForPunchOut/types';
import SelectedScope from './SelectedScope';
import EdsIcon from '@procosys/components/EdsIcon';
import CommPkgTable from './CommPkgTable';
import McPkgTable from './McPkgTable';


interface SelectScopeProps {
    type: string;
    selectedCommPkgScope: CommPkgRow[];
    setSelectedCommPkgScope: (selectedCommPkgScope: CommPkgRow[]) => void;
    selectedMcPkgScope: McScope;
    setSelectedMcPkgScope: (selectedMckgScope: McScope) => void;
    next: () => void;
    previous: () => void;
    isValid: boolean;
    commPkgId: number;
    projectId: number;
}

const KEYCODE_ENTER = 13;

const SelectScope = ({
    type,
    selectedCommPkgScope,
    setSelectedCommPkgScope,
    selectedMcPkgScope,
    setSelectedMcPkgScope,
    next,
    previous,
    isValid,
    commPkgId,
    projectId
}: SelectScopeProps): JSX.Element => {
    const [filter, setFilter] = useState<string>('');
    const [currentCommPkg, setCurrentCommPkg] = useState<string | null>(null);
    const commPkgRef = useRef<any>();
    const mcPkgRef = useRef<any>();
    const filterInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFilter('');
        if (filterInputRef.current) {
            filterInputRef.current.value = '';
        }
    }, [currentCommPkg]);

    useEffect(() => {
        if(commPkgId) {
            //coming from main
        }
    }, []);

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
                            defaultValue=''
                            inputRef={filterInputRef}
                            onKeyDown={(e: any): void => {
                                e.keyCode === KEYCODE_ENTER && setFilter(e.currentTarget.value); //TODO: do we need to make a new API call every time we change filter?
                            }}
                            onInput={(e: any): void => {
                                setFilter(e.currentTarget.value);
                            }}
                        />
                    </Search>
                </TopContainer>
                
                { (currentCommPkg == null && commPkgId == null) &&
                    <CommPkgTable 
                        ref={commPkgRef}
                        selectedCommPkgScope={selectedCommPkgScope}
                        setSelectedCommPkgScope={setSelectedCommPkgScope}
                        setCurrentCommPkg={setCurrentCommPkg}
                        type={type}
                        filter={filter}
                        projectId={projectId}
                    />
                }
                { ((currentCommPkg != null && type=='DP') || commPkgId) &&
                    <McPkgTable 
                        ref={mcPkgRef}
                        selectedMcPkgScope={selectedMcPkgScope}
                        setSelectedMcPkgScope={setSelectedMcPkgScope}
                        enabled={selectedCommPkgScope.length == 0 || currentCommPkg == selectedMcPkgScope.commPkgNoParent}
                        filter={filter}
                    />
                }
            </SelectComponent>
            <SelectedScope 
                selectedCommPkgs={selectedCommPkgScope} 
                removeCommPkg={(commPkgNo: string): void => commPkgRef.current.removeSelectedCommPkg(commPkgNo)}
                selectedMcPkgs={selectedMcPkgScope.selected} 
                removeMcPkg={(mcPkgNo: string): void => mcPkgRef.current.removeSelectedMcPkg(mcPkgNo)}
                multipleDisciplines={selectedMcPkgScope.multipleDisciplines}
            />
        </Container>
    );
};

export default SelectScope;
