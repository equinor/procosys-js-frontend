import React from 'react';
import { Button, Typography, Accordion } from '@equinor/eds-core-react';
import { SelectedScopeContainer, AccordionContent } from './SelectedScope.style';
import { CommPkgRow, McPkgRow } from '@procosys/modules/CallForPunchOut/types';
import EdsIcon from '@procosys/components/EdsIcon';

const {AccordionItem, AccordionHeader, AccordionPanel} = Accordion;

interface SelectedScopeProps {
    selectedCommPkgs?: CommPkgRow[];
    selectedMcPkgs?: McPkgRow[];
    removeCommPkg: (commPkgNo: string) => void;
    removeMcPkg: (mcPkgNo: string) => void;
}

const SelectedScope = ({
    selectedCommPkgs = [],
    removeCommPkg,
    selectedMcPkgs = [],
    removeMcPkg
}: SelectedScopeProps): JSX.Element => {

    const createSectionForCommPkg = (commPkg: CommPkgRow): JSX.Element => {
        return (
            <AccordionItem key={commPkg.commPkgNo}>
                <AccordionHeader>
                    {commPkg.commPkgNo}
                    <Button  variant="ghost_icon" onClick={(): void => removeCommPkg(commPkg.commPkgNo)}>
                        <EdsIcon name="delete_to_trash"></EdsIcon>
                    </Button>
                </AccordionHeader>
                <AccordionPanel>
                    <AccordionContent>
                        <div>
                            <Typography variant='caption'>
                                Comm pkg description
                            </Typography>
                            <Typography variant='body_long'>
                                {commPkg.description}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant='caption'>
                                Comm pkg status
                            </Typography>
                            <Typography variant='body_long'>
                                {commPkg.status}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant='caption'>
                                MDP accepted date
                            </Typography>
                            <Typography variant='body_long'>
                                {commPkg.mdpAccepted ? commPkg.mdpAccepted : '-' }
                            </Typography>
                        </div>
                    </AccordionContent>
                </AccordionPanel>
            </AccordionItem >
        );
    };

    const createSectionForMcPkg = (mcPkg: McPkgRow): JSX.Element => {
        return (
            <AccordionItem key={mcPkg.mcPkgNo}>
                <AccordionHeader>
                    {mcPkg.mcPkgNo}
                    <Button  variant="ghost_icon" onClick={(): void => removeMcPkg(mcPkg.mcPkgNo)}>
                        <EdsIcon name="delete_to_trash"></EdsIcon>
                    </Button>
                </AccordionHeader>
                <AccordionPanel>
                    <AccordionContent>
                        <div>
                            <Typography variant='caption'>
                                Mc pkg description
                            </Typography>
                            <Typography variant='body_long'>
                                {mcPkg.description}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant='caption'>
                                M-01 date
                            </Typography>
                            <Typography variant='body_long'>
                                {mcPkg.m01 ? mcPkg.m01 : '-' }
                            </Typography>
                        </div>
                        <div>
                            <Typography variant='caption'>
                                M-02 date
                            </Typography>
                            <Typography variant='body_long'>
                                {mcPkg.m02 ? mcPkg.m02 : '-' }
                            </Typography>
                        </div>
                    </AccordionContent>
                </AccordionPanel>
            </AccordionItem >
        );
    };

    return (
        <SelectedScopeContainer>
            <Typography variant='h2'>Selected scope</Typography>
            <Typography variant='body_long'>
                {selectedCommPkgs.length} packages(s) selected
            </Typography>
            { selectedCommPkgs.length > 0 &&
                <Accordion>
                    { selectedCommPkgs.map(commPkg => createSectionForCommPkg(commPkg)) }
                </Accordion>
            }
            { selectedMcPkgs.length > 0 &&
                <Accordion>
                    { selectedMcPkgs.map(mcPkg => createSectionForMcPkg(mcPkg)) }
                </Accordion>
            }
        </SelectedScopeContainer>
    );
};

export default SelectedScope;
