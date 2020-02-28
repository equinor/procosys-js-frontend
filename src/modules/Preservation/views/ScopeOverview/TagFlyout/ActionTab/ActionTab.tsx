import React, { useState, useEffect } from 'react';

import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';

import ActionExpanded from './ActionExpanded';
import { Collapse, CollapseInfo, ActionContainer, ActionList } from './ActionTab.style';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { Canceler } from 'axios';
import { Button } from '@equinor/eds-core-react';

interface Action {
    id: number;
    title: string;
    dueTimeUtc: Date | null;
    isClosed: boolean;
}

interface ActionTabProps {
    tagId: number | null;
}

const ActionTab = ({
    tagId
}: ActionTabProps): JSX.Element => {
    const { apiClient } = usePreservationContext();
    const [expandedAction, setExpandedAction] = useState<number | null>();
    const [actions, setActions] = useState<Action[]>([]);

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                if (tagId != null) {
                    const actions = await apiClient.getActions(tagId, (cancel: Canceler) => requestCancellor = cancel);
                    setActions(actions);
                }
            } catch (error) {
                console.error('Get actions failed: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    const toggleDetails = (action: number): void => {
        if (action === expandedAction) {
            setExpandedAction(null);
        } else {
            setExpandedAction(action);
        }
    };

    const createTagSection = (action: Action): JSX.Element => {
        const isExpanded = action.id === expandedAction;

        return (
            <ActionContainer key={action.id}>
                <Collapse>
                    <Button variant='ghost' onClick={(): void => toggleDetails(action.id)}>
                        {
                            isExpanded
                                ? <KeyboardArrowUpIcon />
                                : <KeyboardArrowDownIcon />
                        }
                    </Button>
                    <CollapseInfo isExpanded={isExpanded}>
                        {action.title}
                    </CollapseInfo>
                    <Button title='Due' variant='ghost'>
                        <NotificationsOutlinedIcon />
                    </Button>
                    <Button title='Attachment' variant='ghost'>
                        <AttachFileOutlinedIcon />
                    </Button>
                </Collapse>
                {
                    isExpanded && (
                        <ActionExpanded tagId={tagId} actionId={action.id} close={(): void => toggleDetails(action.id)} />
                    )
                }
            </ActionContainer>
        );
    };

    return (
        <div>
            <ActionList>
                {
                    actions.map(action => createTagSection(action))
                }
            </ActionList>
        </div>
    );
};

export default ActionTab; 