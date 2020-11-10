import { Button, Typography } from '@equinor/eds-core-react';
import { CommPkgRow, McScope } from '@procosys/modules/InvitationForPunchOut/types';
import { Container, Divider, Header, SelectComponent } from './SelectScope.style';
import React, { useEffect, useRef, useState } from 'react';

import CommPkgTable from './CommPkgTable';
import EdsIcon from '@procosys/components/EdsIcon';
import McPkgTable from './McPkgTable';
import SelectedScope from './SelectedScope';

interface SelectScopeProps {
    type: string;
    selectedCommPkgScope: CommPkgRow[];
    setSelectedCommPkgScope: (selectedCommPkgScope: CommPkgRow[]) => void;
    selectedMcPkgScope: McScope;
    setSelectedMcPkgScope: (selectedMckgScope: McScope) => void;
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
                        {currentCommPkg == null ? (type === 'DP' ? 'Click on the arrow next to a comm pkg to open MC scope': 'Select commissioning packages') : 'Select MC packages in comm pkg ' + currentCommPkg }
                    </Typography>
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
