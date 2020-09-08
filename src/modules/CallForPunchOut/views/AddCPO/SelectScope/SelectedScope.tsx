import React from 'react';
import { Button, Typography, Accordion } from '@equinor/eds-core-react';
import { SelectedScopeContainer, AccordionContent } from './SelectedScope.style';
import { CommPkgRow } from '@procosys/modules/CallForPunchOut/types';
import EdsIcon from '@procosys/components/EdsIcon';

const {AccordionItem, AccordionHeader, AccordionPanel} = Accordion;

interface SelectedScopeProps {
    selectedCommPkgs?: CommPkgRow[];
    removeCommPkg: (commPkgNo: string) => void;
}

const SelectedScope = ({
    selectedCommPkgs = [],
    removeCommPkg
}: SelectedScopeProps): JSX.Element => {

    const createSection = (commPkg: CommPkgRow): JSX.Element => {
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
                                {commPkg.commPkgStatus}
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

    return (
        <SelectedScopeContainer>
            <Typography variant='h2'>Selected scope</Typography>
            <Typography variant='body_long'>
                {selectedCommPkgs.length} packages(s) selected
            </Typography>
            { selectedCommPkgs.length > 0 &&
            <Accordion>
                { selectedCommPkgs.map(commPkg => createSection(commPkg)) }
            </Accordion>
            }

        </SelectedScopeContainer>
    );
};

export default SelectedScope;
