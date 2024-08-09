import { Button, Typography } from '@equinor/eds-core-react';
import {
    CommPkgRow,
    McScope,
} from '@procosys/modules/InvitationForPunchOut/types';
import {
    Container,
    Divider,
    Header,
    SelectComponent,
} from './SelectScope.style';
import McPkgTable, { multipleDisciplines } from './McPkgTable';
import React, { useEffect, useRef, useState } from 'react';

import CommPkgTable from './CommPkgTable';
import EdsIcon from '@procosys/components/EdsIcon';
import SelectedScope from './SelectedScope';

interface SelectScopeProps {
    type: string;
    selectedCommPkgScope: CommPkgRow[];
    setSelectedCommPkgScope: React.Dispatch<React.SetStateAction<CommPkgRow[]>>;
    selectedMcPkgScope: McScope;
    setSelectedMcPkgScope: React.Dispatch<React.SetStateAction<McScope>>;
    commPkgNo: string | null;
    projectName: string;
    isDisabled?: boolean;
}

const SelectScope = ({
    type,
    selectedCommPkgScope,
    setSelectedCommPkgScope,
    selectedMcPkgScope,
    setSelectedMcPkgScope,
    commPkgNo,
    projectName,
    isDisabled,
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
            const selectedIndex = selectedMcPkgScope.selected.findIndex(
                (mcPkg) => mcPkg.mcPkgNo === mcPkgNo
            );
            if (selectedIndex > -1) {
                // remove from selected mcPkgs
                const newSelected = [
                    ...selectedMcPkgScope.selected.slice(0, selectedIndex),
                    ...selectedMcPkgScope.selected.slice(selectedIndex + 1),
                ];
                const newSelectedMcPkgScope = {
                    system:
                        newSelected.length > 0
                            ? selectedMcPkgScope.system
                            : null,
                    multipleDisciplines: multipleDisciplines(newSelected),
                    selected: newSelected,
                };
                setSelectedMcPkgScope(newSelectedMcPkgScope);
            }
        }
    };

    const handleRemoveCommPkg = (commPkgNo: string): void => {
        if (commPkgRef.current) {
            commPkgRef.current.removeSelectedCommPkg(commPkgNo);
        } else {
            const selectedIndex = selectedCommPkgScope.findIndex(
                (commPkg) => commPkg.commPkgNo === commPkgNo
            );
            if (selectedIndex > -1) {
                // remove from selected commPkgs
                const newSelectedCommPkgScope = [
                    ...selectedCommPkgScope.slice(0, selectedIndex),
                    ...selectedCommPkgScope.slice(selectedIndex + 1),
                ];
                setSelectedCommPkgScope(newSelectedCommPkgScope);
            }
        }
    };

    return (
        <Container>
            {!isDisabled && (
                <>
                    <SelectComponent>
                        <Header>
                            {currentCommPkg != null && commPkgNo == null && (
                                <Button
                                    id="backButton"
                                    onClick={(): void =>
                                        setCurrentCommPkg(null)
                                    }
                                    variant="ghost_icon"
                                >
                                    <EdsIcon name="arrow_back" />
                                </Button>
                            )}
                            <Typography variant="h2">
                                {currentCommPkg == null
                                    ? type === 'DP'
                                        ? 'Click on the arrow next to a comm pkg to open MC scope'
                                        : 'Select commissioning packages'
                                    : type === 'DP'
                                      ? 'Select MC packages in comm pkg ' +
                                        currentCommPkg
                                      : 'Scope has been preselected'}
                            </Typography>
                        </Header>
                        {(currentCommPkg == null ||
                            (commPkgNo != null && type == 'MDP')) && (
                            <div>
                                <CommPkgTable
                                    ref={commPkgRef}
                                    selectedCommPkgScope={selectedCommPkgScope}
                                    setSelectedCommPkgScope={
                                        setSelectedCommPkgScope
                                    }
                                    selectedMcPkgScope={
                                        selectedMcPkgScope.selected
                                    }
                                    setCurrentCommPkg={setCurrentCommPkg}
                                    type={type}
                                    projectName={projectName}
                                    filter={commPkgFilter}
                                    setFilter={setCommPkgFilter}
                                    commPkgNo={commPkgNo}
                                />
                            </div>
                        )}
                        {currentCommPkg != null &&
                            (commPkgNo == null ||
                                (commPkgNo != null && type == 'DP')) && (
                                <McPkgTable
                                    ref={mcPkgRef}
                                    selectedMcPkgScope={selectedMcPkgScope}
                                    setSelectedMcPkgScope={
                                        setSelectedMcPkgScope
                                    }
                                    projectName={projectName}
                                    commPkgNo={currentCommPkg}
                                />
                            )}
                    </SelectComponent>
                    <Divider />
                </>
            )}
            <SelectedScope
                selectedCommPkgs={selectedCommPkgScope}
                removeCommPkg={(commPkgNo: string): void =>
                    handleRemoveCommPkg(commPkgNo)
                }
                selectedMcPkgs={selectedMcPkgScope.selected}
                removeMcPkg={(mcPkgNo: string): void =>
                    handleRemoveMcPkg(mcPkgNo)
                }
                multipleDisciplines={selectedMcPkgScope.multipleDisciplines}
                isDisabled={isDisabled}
            />
        </Container>
    );
};

export default SelectScope;
