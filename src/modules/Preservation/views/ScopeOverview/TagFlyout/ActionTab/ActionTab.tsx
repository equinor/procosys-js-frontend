import React, { useState, useEffect } from 'react';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import ActionExpanded from './ActionExpanded';
import {
    Collapse,
    CollapseInfo,
    ActionContainer,
    ActionList,
    Container,
    AddActionContainer,
    StyledButton,
} from './ActionTab.style';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import EdsIcon from '../../../../../../components/EdsIcon';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { Canceler } from 'axios';
import { Button } from '@equinor/eds-core-react';
import CreateOrEditAction from './CreateOrEditAction';

const attachmentIcon = <EdsIcon name="attach_file" size={16} />;
const notificationIcon = <EdsIcon name="notifications" size={16} />;
const addIcon = <EdsIcon name="add_circle_filled" size={16} />;

export interface ActionListItem {
    id: number;
    title: string;
    dueTimeUtc: Date | null;
    isClosed: boolean;
    attachmentCount: number;
}

interface ActionTabProps {
    tagId: number;
    isVoided: boolean;
    setDirty: () => void;
}

const ActionTab = ({
    tagId,
    isVoided,
    setDirty,
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
                    const actions = await apiClient.getActions(
                        tagId,
                        (cancel: Canceler) => (requestCancellor = cancel)
                    );
                    setActions(actions);
                }
            } catch (error) {
                console.error(
                    'Get action list failed: ',
                    error.message,
                    error.data
                );
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
                const dueTime = new Date(action.dueTimeUtc).getTime();
                return dueTime <= today;
            } else {
                return false;
            }
        };

        const showNotificationIcon = (): boolean => !action.isClosed && isDue();
        const showAttachmentIcon = (): boolean => action.attachmentCount > 0;

        return (
            <ActionContainer isClosed={action.isClosed} key={action.id}>
                <Collapse
                    isClosed={action.isClosed}
                    onClick={(): void => toggleDetails(action.id)}
                >
                    <Button
                        data-testid={`toggle-icon-${action.id}`}
                        variant="ghost_icon"
                    >
                        {isExpanded ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </Button>
                    <CollapseInfo
                        isClosed={action.isClosed}
                        isExpanded={isExpanded}
                    >
                        {action.title}
                    </CollapseInfo>
                    <div style={{ whiteSpace: 'nowrap' }}>
                        {showNotificationIcon() && notificationIcon}
                        {showAttachmentIcon() && attachmentIcon}
                    </div>
                </Collapse>
                {isExpanded && (
                    <ActionExpanded
                        tagId={tagId}
                        isVoided={isVoided}
                        actionId={action.id}
                        getActionList={getActionList}
                        toggleDetails={(): void => {
                            toggleDetails(action.id);
                        }}
                        setDirty={setDirty}
                    />
                )}
            </ActionContainer>
        );
    };

    return (
        <>
            {showCreateAction && (
                <CreateOrEditAction
                    tagId={tagId}
                    isVoided={isVoided}
                    backToParentView={(): void => {
                        getActionList();
                        setShowCreateAction(false);
                    }}
                    setDirty={setDirty}
                />
            )}
            {!showCreateAction && (
                <Container>
                    <AddActionContainer>
                        <StyledButton
                            disabled={isVoided}
                            variant="ghost"
                            onClick={(): void => setShowCreateAction(true)}
                        >
                            {addIcon} Add action
                        </StyledButton>
                    </AddActionContainer>

                    <ActionList>
                        {actions.map((action) => createActionSection(action))}
                    </ActionList>
                </Container>
            )}
        </>
    );
};

export default ActionTab;
