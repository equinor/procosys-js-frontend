import React, { useEffect, useState, useRef } from 'react';
import { Button, Typography } from '@equinor/eds-core-react';
import { Container, Header, ButtonsContainer, SelectComponent, Divider } from './SelectScope.style';
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
    commPkgNo: string;
    projectId: number;
    projectName: string;
}

const SelectScope = ({
    type,
    selectedCommPkgScope,
    setSelectedCommPkgScope,
    selectedMcPkgScope,
    setSelectedMcPkgScope,
    next,
    previous,
    isValid,
    commPkgNo,
    projectId,
    projectName
}: SelectScopeProps): JSX.Element => {
    const [currentCommPkg, setCurrentCommPkg] = useState<string | null>(null);
    const commPkgRef = useRef<any>();
    const mcPkgRef = useRef<any>();

    useEffect(() => {
        if(commPkgNo) {
            setCurrentCommPkg(commPkgNo);
        }
    }, []);

    return (     
        <Container>
            <SelectComponent>
                <Header>
                    {(currentCommPkg != null && commPkgNo == null) &&
                        <Button 
                            id='backButton'
                            onClick={(): void => setCurrentCommPkg(null)}
                            variant="ghost_icon" 
                        >
                            <EdsIcon name='arrow_back'/>
                        </Button> 
                    }
                    <Typography variant='h2'>
                        {currentCommPkg == null ? 'Select commissioning packages' : 'Select MC packages in comm pkg ' + currentCommPkg }
                    </Typography>
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
                { (currentCommPkg == null && commPkgNo == null) &&
                    <div>
                        <CommPkgTable 
                            ref={commPkgRef}
                            selectedCommPkgScope={selectedCommPkgScope}
                            setSelectedCommPkgScope={setSelectedCommPkgScope}
                            setCurrentCommPkg={setCurrentCommPkg}
                            type={type}
                            projectId={projectId}
                        />
                    </div>
                }
                { currentCommPkg != null && 
                    <McPkgTable 
                        ref={mcPkgRef}
                        selectedMcPkgScope={selectedMcPkgScope}
                        setSelectedMcPkgScope={setSelectedMcPkgScope}
                        projectName={projectName}
                        commPkgNo={currentCommPkg}
                    />
                }
            </SelectComponent>
            <Divider />
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
