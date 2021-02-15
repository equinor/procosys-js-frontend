import React from 'react';
import { Popover, Button} from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import EdsIcon from '@procosys/components/EdsIcon';

import { Participant } from '../../../types';
import { CustomTable, FloatingPopover, TableRow, TableCell, TableCellRight} from './style';

const { PopoverAnchor, PopoverTitle, PopoverContent } = Popover;

interface CustomPopoverProps {
    participant: Participant;
    activePopover: string,
    onChange: (value:string) => void;
}

const CustomPopover = ( {participant, activePopover, onChange}: CustomPopoverProps ): JSX.Element =>{
    const openPopover = (event: React.SyntheticEvent): void =>{
        onChange(event.currentTarget.id);
    };

    const closePopover = ():void => {
        onChange('');
    };

    return(
        <FloatingPopover onClose={ closePopover } open={activePopover === `popover${participant.functionalRole.id.toString()}`} placement="right">
            <PopoverAnchor id={ participant.sortKey.toString() + 'test' }>
                <Button 
                    variant='ghost_icon'
                    id={`popover${participant.functionalRole.id}` } 
                    onClick={ openPopover }
                >
                    <EdsIcon
                        name="info_circle"
                        color={tokens.colors.interactive.primary__resting.rgba}
                    />
                </Button>
            </PopoverAnchor>
            <PopoverTitle id={ participant.sortKey.toString() + 'title' } >
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