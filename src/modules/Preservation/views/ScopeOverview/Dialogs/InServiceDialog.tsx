import React from 'react';
import { PreservedTag } from '../types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import DialogTable from './SharedCode/DialogTable';
import { MainContainer, TableContainer } from './SharedCode/Dialogs.style';
import { columns } from './SharedCode/TableColumns';

interface inServiceDialogProps {
    inServiceTags: PreservedTag[];
    notInServiceTags: PreservedTag[];
}

const InServiceDialog = ({
    inServiceTags,
    notInServiceTags,
}: inServiceDialogProps): JSX.Element => {
    return (
        <MainContainer>
            {notInServiceTags.length > 0 && (
                <TableContainer isHalfSize={inServiceTags.length > 0}>
                    <Typography variant="meta">
                        {notInServiceTags.length} tag(s) cannot be set in
                        service.
                    </Typography>
                    <DialogTable
                        tags={notInServiceTags}
                        columns={columns}
                        toolbarText="tag(s) cannot be set in service"
                        toolbarColor={
                            tokens.colors.interactive.danger__text.rgba
                        }
                    />
                </TableContainer>
            )}
            {inServiceTags.length > 0 && (
                <TableContainer isHalfSize={notInServiceTags.length > 0}>
                    <DialogTable
                        tags={inServiceTags}
                        columns={columns}
                        toolbarText="tag(s) will be set i service"
                        toolbarColor={
                            tokens.colors.interactive.primary__resting.rgba
                        }
                    />
                </TableContainer>
            )}
        </MainContainer>
    );
};

export default InServiceDialog;
