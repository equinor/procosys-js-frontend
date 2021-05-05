import React from 'react';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';
import AttachmentList, { AttachmentListProps } from '@procosys/components/AttachmentList';
import { attachmentsMock } from './__tests__/AttachmentList.test';

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4, fit-content(100%));
`;

const downloadAttachment = (): void => {
    console.log('Downloading attachment')
};

export default {
    title: 'Procosys/AttachmentList',
    component: AttachmentList,
    parameters: {
        docs: {
            description: {
                component: `Attachment component used in Procosys.
          `,
            },
        },
        info: {},
    },
    args: {
        attachments: [
            {
                fileName: 'Attachment 1',
                id: 1,
                rowVersion: '1',
                uploadedBy: {
                    id: 1,
                    firstName: 'Jane',
                    lastName: 'Doe',
                    azureOid: 'string',
                    email: 'string',
                    rowVersion: 'string',
                },
                uploadedAt: new Date(),
            }
        ],
        disabled: false,
        downloadAttachment: downloadAttachment,
    }
} as Meta;


export const Default: Story<AttachmentListProps> = (args: JSX.IntrinsicAttributes & AttachmentListProps & { children?: React.ReactNode; }) => {
    return (
        <Wrapper>
            <AttachmentList {...args} />
        </Wrapper>
    );
};
