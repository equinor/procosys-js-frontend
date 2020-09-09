import React, { useEffect, useState, useRef } from 'react';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { Container, Header, Search, ButtonsContainer, TopContainer, SelectComponent, Divider } from './SelectScope.style';
import { CommPkgRow, McScope } from '@procosys/modules/CallForPunchOut/types';
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
    isValid
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
                
                { currentCommPkg == null &&
                    <CommPkgTable 
                        ref={commPkgRef}
                        selectedCommPkgScope={selectedCommPkgScope}
                        setSelectedCommPkgScope={setSelectedCommPkgScope}
                        setCurrentCommPkg={setCurrentCommPkg}
                        type={type}
                        filter={filter}
                    />
                }
                { (currentCommPkg != null && type=='DP') &&
                    <McPkgTable 
                        selectedMcPkgScope={selectedMcPkgScope}
                        setSelectedMcPkgScope={setSelectedMcPkgScope}
                        enabled={selectedCommPkgScope.length == 0 || currentCommPkg == selectedMcPkgScope.commPkgNoParent}
                        filter={filter}
                    />
                }
            </SelectComponent>
            <Divider />
            <SelectedScope 
                selectedCommPkgs={selectedCommPkgScope} 
                removeCommPkg={(commPkgNo: string): void => commPkgRef.current.removeSelectedCommPkg(commPkgNo)}
                selectedMcPkgs={selectedMcPkgScope.selected} 
                removeMcPkg={(mcPkgNo: string): void => mcPkgRef.current.removeSelectedCommPkg(mcPkgNo)}
                multipleDisciplines={selectedMcPkgScope.multipleDisciplines}
            />
        </Container>
    );
};

export default SelectScope;
