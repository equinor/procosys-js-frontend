import {
    CustomTable,
    FloatingPopover,
    TableCell,
    TableCellRight,
    TableRow,
} from './style';
import React, { useRef, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';
import { Participant } from '../../../types';
import { Popover } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import { Icon } from '@equinor/eds-core-react';

interface CustomPopoverProps {
    participant: Participant;
}

const CustomPopover = ({ participant }: CustomPopoverProps): JSX.Element => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    const togglePopover = (): void => {
        setIsActive(!isActive);
    };

    return (
        <>
            <Button
                ref={anchorRef}
                variant="ghost_icon"
                onClick={togglePopover}
                data-testid={'popover-anchor-ref'}
                id={participant.sortKey.toString() + 'test'}
            >
                <EdsIcon
                    name="info_circle"
                    color={tokens.colors.interactive.primary__resting.rgba}
                />
            </Button>
            <FloatingPopover
                onClose={togglePopover}
                open={isActive}
                placement="right-end"
                anchorEl={anchorRef.current}
            >
                <Popover.Header>
                    <Popover.Title>
                        {participant.functionalRole.code}
                    </Popover.Title>
                    <Button
                        style={{ height: '32px', width: '32px' }}
                        variant="ghost_icon"
                        aria-label="Close popover"
                        onClick={togglePopover}
                    >
                        <EdsIcon
                            name="close"
                            size={24}
                            color={
                                tokens.colors.interactive.primary__resting.rgba
                            }
                        />
                    </Button>
                </Popover.Header>
                <Popover.Content>
                    <CustomTable>
                        {participant.functionalRole.persons.map((person) => {
                            return (
                                <TableRow
                                    key={person.id}
                                    data-testid={person.id.toString() + 'row'}
                                >
                                    <TableCell>
                                        {person.firstName} {person.lastName}
                                    </TableCell>
                                    <TableCellRight>
                                        {person.response}
                                    </TableCellRight>
                                </TableRow>
                            );
                        })}
                    </CustomTable>
                </Popover.Content>
            </FloatingPopover>
        </>
    );
};

export default CustomPopover;
