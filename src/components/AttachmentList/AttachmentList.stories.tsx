import React from 'react';
import ProgressBar, { ProgressBarProps } from '@procosys/components/ProgressBar';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';
import AttachmentList, { AttachmentListProps } from '.';
import { TableOptions } from 'react-table';
import { Attachment } from '@procosys/modules/InvitationForPunchOut/types';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const downloadAttachment = (attachment: Attachment): void => {
    console.log(attachment.fileName);
};

const deleteAttachment = (row: TableOptions<Attachment>): void => {
    console.log(row.row.index);
};

const addAttachments = (files: FileList | null): void => {
    console.log('Adding file(s)')
};

export default {
    title: 'Procosys/AttachmentList',
    component: AttachmentList,
    args: {
        attachments: [
            {
                fileName: "Filter-button.PNG",
                id: 97,
                rowVersion: "AAAAAAAAKH0=",
                uploadedAt: "2021-03-26T14:45:45.2989933Z",
                uploadedBy: {
                    id: 10,
                    firstName: "Jane",
                    lastName: "Doe",
                    userName: "JDOE",
                    azureOid: "4jjfe",
                    email: "JDOE@email.com",
                    rowVersion: "AAAAAAAAIBL=",
                }
            },
        ],
        disabled: false,
        downloadAttachment: downloadAttachment,
        deleteAttachment: deleteAttachment,
    },
    argTypes: {
    },
    parameters: {
        docs: {
            description: {
                component: `Attachment component used in Procosys.
        `,
            },
        },
        info: {},
    },
} as Meta;

interface ChangedAttachmentListProps {
    attachments: Attachment[];
    disabled: boolean;
    deleteAttachment?: (row: TableOptions<Attachment>) => void;
    downloadAttachment: (attachment: Attachment) => Promise<void> | void;
    large?: boolean;
    detailed?: boolean;
}

export const Default: Story<ChangedAttachmentListProps> = (args: JSX.IntrinsicAttributes & ChangedAttachmentListProps) => {
    console.log(args);
    return (
        <Wrapper>
            <AttachmentList {...args} addAttachments={undefined} ></AttachmentList>
        </Wrapper>
    );
};

export const WithAddAttachments: Story<ChangedAttachmentListProps> = (args: JSX.IntrinsicAttributes & ChangedAttachmentListProps) => {
    console.log(args);
    return (
        <Wrapper>
            <AttachmentList {...args} addAttachments={addAttachments} ></AttachmentList>
        </Wrapper>
    );
};
