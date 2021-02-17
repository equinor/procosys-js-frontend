import React, { useState } from 'react';
import { Popover, Button} from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import EdsIcon from '@procosys/components/EdsIcon';

import { Participant } from '../../../types';
import { CustomTable, FloatingPopover, TableRow, TableCell, TableCellRight} from './style';

const { PopoverAnchor, PopoverTitle, PopoverContent } = Popover;

interface CustomPopoverProps {
    participant: Participant;
}

const CustomPopover = ( {participant} : CustomPopoverProps ): JSX.Element =>{
    const [isActive, setIsActive] = useState(false);

    const togglePopover = (): void =>{
        setIsActive(!isActive);
    };

    return(
        <FloatingPopover onClose={ togglePopover } open={isActive} placement="right">
            <PopoverAnchor id={ participant.sortKey.toString() + 'test' }>
                <Button 
                    variant='ghost_icon'
                    onClick={ togglePopover }
                >
                    <EdsIcon
                        name="info_circle"
                        color={tokens.colors.interactive.primary__resting.rgba}
                    />
                </Button>
            </PopoverAnchor>
            <PopoverTitle >
                { participant.functionalRole.code }
            </PopoverTitle>
            <PopoverContent>
                <CustomTable>
                    {
                        participant.functionalRole.persons.map((person)=>{
                            return(
                                <TableRow key={ person.person.id } data-testid={ person.person.id.toString() + 'row' }>
                                    <TableCell> { person.person.firstName } { person.person.lastName } </TableCell>
                                    <TableCellRight> { person.response } </TableCellRight>
                                </TableRow>
                            );
                        })
                    }
                </CustomTable>
            </PopoverContent>
        </FloatingPopover>
    );
};

export default CustomPopover;