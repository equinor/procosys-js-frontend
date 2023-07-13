import { Accordion, Button, Typography } from '@equinor/eds-core-react';
import {
    AccordionContent,
    SelectedScopeContainer,
    TextContainer,
} from './SelectedScope.style';
import {
    CommPkgRow,
    McPkgRow,
} from '@procosys/modules/InvitationForPunchOut/types';

import EdsIcon from '@procosys/components/EdsIcon';
import React from 'react';

const multipleDisciplinesWarning = (
    <div>
        <EdsIcon name="warning_outlined" size={16} />
        <Typography>Scope contains multiple disciplines</Typography>
    </div>
);

interface SelectedScopeProps {
    selectedCommPkgs: CommPkgRow[];
    selectedMcPkgs: McPkgRow[];
    removeCommPkg: (commPkgNo: string) => void;
    removeMcPkg: (mcPkgNo: string) => void;
    multipleDisciplines: boolean;
    isDisabled?: boolean;
}

const SelectedScope = ({
    selectedCommPkgs = [],
    removeCommPkg,
    selectedMcPkgs = [],
    removeMcPkg,
    multipleDisciplines,
    isDisabled,
}: SelectedScopeProps): JSX.Element => {
    const numberOfPackagesSelected = (): number => {
        if (selectedMcPkgs.length > 0) {
            return selectedMcPkgs.length;
        } else if (selectedCommPkgs.length > 0) {
            return selectedCommPkgs.length;
        }
        return 0;
    };

    const createSectionForCommPkg = (commPkg: CommPkgRow): JSX.Element => {
        return (
            <Accordion.Item key={commPkg.commPkgNo}>
                <Accordion.Header>
                    {commPkg.commPkgNo}
                    {isDisabled ? (
                        <></>
                    ) : (
                        <Button
                            variant="ghost_icon"
                            onClick={(): void =>
                                removeCommPkg(commPkg.commPkgNo)
                            }
                        >
                            <EdsIcon name="delete_to_trash"></EdsIcon>
                        </Button>
                    )}
                </Accordion.Header>
                <Accordion.Panel>
                    <AccordionContent>
                        <div>
                            <Typography variant="caption">
                                Comm pkg description
                            </Typography>
                            <Typography variant="body_long">
                                {commPkg.description}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="caption">
                                Comm pkg status
                            </Typography>
                            <Typography variant="body_long">
                                {commPkg.status}
                            </Typography>
                        </div>
                    </AccordionContent>
                </Accordion.Panel>
            </Accordion.Item>
        );
    };

    const createSectionForMcPkg = (mcPkg: McPkgRow): JSX.Element => {
        return (
            <Accordion.Item key={mcPkg.mcPkgNo}>
                <Accordion.Header>
                    {mcPkg.mcPkgNo}
                    {!isDisabled && (
                        <Button
                            variant="ghost_icon"
                            onClick={(): void => removeMcPkg(mcPkg.mcPkgNo)}
                        >
                            <EdsIcon name="delete_to_trash"></EdsIcon>
                        </Button>
                    )}
                </Accordion.Header>
                <Accordion.Panel>
                    <AccordionContent>
                        <div>
                            <Typography variant="caption">
                                Mc pkg description
                            </Typography>
                            <Typography variant="body_long">
                                {mcPkg.description}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="caption">Status</Typography>
                            <Typography variant="body_long">
                                {mcPkg.status}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="caption">M-01 date</Typography>
                            <Typography variant="body_long">
                                {mcPkg.m01 ? mcPkg.m01 : '-'}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="caption">M-02 date</Typography>
                            <Typography variant="body_long">
                                {mcPkg.m02 ? mcPkg.m02 : '-'}
                            </Typography>
                        </div>
                    </AccordionContent>
                </Accordion.Panel>
            </Accordion.Item>
        );
    };

    return (
        <SelectedScopeContainer>
            <Typography variant="h2">Selected scope</Typography>
            <TextContainer>
                <Typography variant="body_long">
                    {numberOfPackagesSelected()} package(s) selected
                </Typography>
                {multipleDisciplines && multipleDisciplinesWarning}
            </TextContainer>

            {selectedCommPkgs.length > 0 && (
                <Accordion>
                    {selectedCommPkgs.map((commPkg) =>
                        createSectionForCommPkg(commPkg)
                    )}
                </Accordion>
            )}
            {selectedMcPkgs.length > 0 && (
                <Accordion>
                    {selectedMcPkgs.map((mcPkg) =>
                        createSectionForMcPkg(mcPkg)
                    )}
                </Accordion>
            )}
        </SelectedScopeContainer>
    );
};

export default SelectedScope;
