import { Button, Typography } from '@equinor/eds-core-react';
import { CommPkgRow, McScope } from '@procosys/modules/InvitationForPunchOut/types';
import { Container, Divider, Header, SelectComponent } from './SelectScope.style';
import McPkgTable, { multipleDisciplines } from './McPkgTable';
import React, { useEffect, useRef, useState } from 'react';

import CommPkgTable from './CommPkgTable';
import EdsIcon from '@procosys/components/EdsIcon';
import SelectedScope from './SelectedScope';

interface SelectScopeProps {
    type: string;
    selectedCommPkgScope: CommPkgRow[];
    setSelectedCommPkgScope: (selectedCommPkgScope: CommPkgRow[]) => void;
    selectedMcPkgScope: McScope;
    setSelectedMcPkgScope: (selectedMckgScope: McScope) => void;
    commPkgNo: string | null;
    projectName: string;
}

const SelectScope = ({
    type,
    selectedCommPkgScope,
    setSelectedCommPkgScope,
    selectedMcPkgScope,
    setSelectedMcPkgScope,
    commPkgNo,
    projectName
}: SelectScopeProps): JSX.Element => {
    const [currentCommPkg, setCurrentCommPkg] = useState<string | null>(null);
    const commPkgRef = useRef<any>();
    const mcPkgRef = useRef<any>();
    const [commPkgFilter, setCommPkgFilter] = useState<string>('');

    useEffect(() => {
        if (commPkgNo) {
            setCurrentCommPkg(commPkgNo);
        }
    }, []);

    const handleRemoveMcPkg = (mcPkgNo: string): void => {
        if (mcPkgRef.current) {
            mcPkgRef.current.removeSelectedMcPkg(mcPkgNo);
        } else {
            const selectedIndex = selectedMcPkgScope.selected.findIndex(mcPkg => mcPkg.mcPkgNo === mcPkgNo);
            if (selectedIndex > -1) {
                // remove from selected mcPkgs
                const newSelected = [...selectedMcPkgScope.selected.slice(0, selectedIndex), ...selectedMcPkgScope.selected.slice(selectedIndex + 1)];
                const newSelectedMcPkgScope = { commPkgNoParent: newSelected.length > 0 ? selectedMcPkgScope.commPkgNoParent : null, multipleDisciplines: multipleDisciplines(newSelected), selected: newSelected };
                setSelectedMcPkgScope(newSelectedMcPkgScope);
            }
        }
    };

    const handleRemoveCommPkg = (commPkgNo: string): void => {
        if (commPkgRef.current) {
            commPkgRef.current.removeSelectedCommPkg(commPkgNo);
        } else {
            const selectedIndex = selectedCommPkgScope.findIndex(commPkg => commPkg.commPkgNo === commPkgNo);
            if (selectedIndex > -1) {
                // remove from selected commPkgs
                const newSelectedCommPkgScope = [...selectedCommPkgScope.slice(0, selectedIndex), ...selectedCommPkgScope.slice(selectedIndex + 1)];
                setSelectedCommPkgScope(newSelectedCommPkgScope);
            }
        }
    };

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
                            <EdsIcon name='arrow_back' />
                        </Button>
                    }
                    <Typography variant='h2'>
                        {currentCommPkg == null ? (type === 'DP' ? 'Click on the arrow next to a comm pkg to open MC scope' : 'Select commissioning packages') : 'Select MC packages in comm pkg ' + currentCommPkg}
                    </Typography>
                </Header>
                {(currentCommPkg == null && commPkgNo == null) &&
                    <div>
                        <CommPkgTable
                            ref={commPkgRef}
                            selectedCommPkgScope={selectedCommPkgScope}
                            setSelectedCommPkgScope={setSelectedCommPkgScope}
                            selectedMcPkgScope={selectedMcPkgScope.selected}
                            setCurrentCommPkg={setCurrentCommPkg}
                            type={type}
                            projectName={projectName}
                            filter={commPkgFilter}
                            setFilter={setCommPkgFilter}
                        />
                    </div>
                }
                {currentCommPkg &&
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
                removeCommPkg={(commPkgNo: string): void => handleRemoveCommPkg(commPkgNo)}
                selectedMcPkgs={selectedMcPkgScope.selected}
                removeMcPkg={(mcPkgNo: string): void => handleRemoveMcPkg(mcPkgNo)}
                multipleDisciplines={selectedMcPkgScope.multipleDisciplines}
            />
        </Container>
    );
};

export default SelectScope;
