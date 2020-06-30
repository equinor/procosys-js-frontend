import React, { useState, useEffect } from 'react';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import ActionExpanded from './ActionExpanded';
import { Collapse, CollapseInfo, ActionContainer, ActionList, Container, AddActionContainer, ButtonSpacer, StyledButton } from './ActionTab.style';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import EdsIcon from '../../../../../../components/EdsIcon';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { Canceler } from 'axios';
import { Button } from '@equinor/eds-core-react';
import CreateOrEditAction from './CreateOrEditAction';

//const attachIcon = <EdsIcon name='attach_file' size={16} />;
const notificationIcon = <EdsIcon name='notifications' size={16} />;
const addIcon = <EdsIcon name='add_circle_filled' size={16} />;

export interface ActionListItem {
    id: number;
    title: string;
    dueTimeUtc: Date | null;
    isClosed: boolean;
}

interface ActionTabProps {
    tagId: number;
}

const ActionTab = ({
    tagId
}: ActionTabProps): JSX.Element => {
    const { apiClient } = usePreservationContext();
    const [expandedAction, setExpandedAction] = useState<number | null>();
    const [actions, setActions] = useState<ActionListItem[]>([]);
    const [showCreateAction, setShowCreateAction] = useState<boolean>(false);


    const getActionList = (): Canceler | null => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                if (tagId != null) {
                    const actions = await apiClient.getActions(tagId, (cancel: Canceler) => requestCancellor = cancel);
                    setActions(actions);
                }
            } catch (error) {
                console.error('Get action list failed: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000, true);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    };

    /*Get the action list initially */
    useEffect(() => {
        getActionList();
    }, []);

    const toggleDetails = (action: number): void => {
        if (action === expandedAction) {
            setExpandedAction(null);
        } else {
            setExpandedAction(action);
        }
    };


    const createActionSection = (action: ActionListItem): JSX.Element => {
        const isExpanded = action.id === expandedAction;

        const isDue = (): boolean => {
            if (action.dueTimeUtc) {
                const today = new Date().getTime();
                const dueTime = (new Date(action.dueTimeUtc)).getTime();
                return dueTime <= today;
            } else {
                return false;
            }
        };

        const showNotification = (): boolean => {
            if (!action.isClosed &&
                action.dueTimeUtc &&
                isDue()) {
                return true;
            }
            return false;
        };

        return (
            <ActionContainer isClosed={action.isClosed} key={action.id}>
                <Collapse isClosed={action.isClosed}>
                    <Button data-testid={`toggle-icon-${action.id}`} variant='ghost' onClick={(): void => toggleDetails(action.id)}>
                        {
                            isExpanded
                                ? <KeyboardArrowUpIcon />
                                : <KeyboardArrowDownIcon />
                        }
                    </Button>
                    <CollapseInfo isClosed={action.isClosed} isExpanded={isExpanded}>
                        {action.title}
                    </CollapseInfo>
                    {showNotification() &&
                        notificationIcon
                    }
                    {/* todo: add attachment icon when flag is available <IconSpacer />
                    {attachIcon} */}

                </Collapse>
                {
                    isExpanded && (
                        <ActionExpanded tagId={tagId} actionId={action.id} getActionList={getActionList} toggleDetails={(): void => { toggleDetails(action.id); }} />
                    )
                }
            </ActionContainer >
        );
    };

    return (
        <>
            {showCreateAction &&
                <CreateOrEditAction
                    tagId={tagId}
                    backToParentView={(): void => {
                        getActionList();
                        setShowCreateAction(false);
                    }}
                />
            }
            {
                !showCreateAction &&
                <Container>
                    <AddActionContainer>
                        <StyledButton
                            variant='ghost'
                            onClick={(): void => setShowCreateAction(true)}>
                            {addIcon} <ButtonSpacer /> Add action
                        </StyledButton>
                    </AddActionContainer>

                    <ActionList>
                        {
                            actions.map(action => createActionSection(action))
                        }
                    </ActionList>

                </Container >
            }
        </>
    );
};

export default ActionTab;
