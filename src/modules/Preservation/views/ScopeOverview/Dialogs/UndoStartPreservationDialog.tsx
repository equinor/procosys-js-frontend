import React from 'react';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import DialogTable from '../DialogTable';
import { PreservedTag } from '../types';
import { MainContainer, TableContainer } from '../Dialogs.style';
import { columns } from './SharedCode/TableColumns';

interface UndoStartPreservationDialogProps {
    unstartableTags: PreservedTag[];
    nonUnstartableTags: PreservedTag[];
}

const UndoStartPreservationDialog = ({
    unstartableTags,
    nonUnstartableTags,
}: UndoStartPreservationDialogProps): JSX.Element => {
    // TODO: figure out why this doesn't open, and why the button in more options is fucked
    return (
        <MainContainer>
            {nonUnstartableTags.length > 0 && (
                <TableContainer isHalfSize={unstartableTags.length > 0}>
                    <Typography variant="meta">
                        Cannot undo start preservation for
                        {nonUnstartableTags.length} tag(s). Tags aren&apos;t
                        already started, or are voided.
                    </Typography>
                    <DialogTable
                        tags={nonUnstartableTags}
                        columns={columns}
                        toolbarText="tag(s) will not be changed"
                        toolbarColor={
                            tokens.colors.interactive.danger__text.rgba
                        }
                    />
                </TableContainer>
            )}
            {unstartableTags.length > 0 && (
                <TableContainer isHalfSize={nonUnstartableTags.length > 0}>
                    <DialogTable
                        tags={unstartableTags}
                        columns={columns}
                        toolbarText="tag(s) will no longer be started"
                        toolbarColor={
                            tokens.colors.interactive.primary__resting.rgba
                        }
                    />
                </TableContainer>
            )}
        </MainContainer>
    );
};

export default UndoStartPreservationDialog;
