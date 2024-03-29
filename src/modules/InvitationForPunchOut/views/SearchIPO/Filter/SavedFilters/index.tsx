import React, { useState } from 'react';
import { TextField, Typography, Button } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import Checkbox from '@procosys/components/Checkbox';
import {
    ListContainer,
    Container,
    Header,
    Divider,
    Link,
    Row,
} from './index.style';
import { SavedIPOFilter, IPOFilter } from '../../types';
import EdsIcon from '@procosys/components/EdsIcon';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';
import { ProjectDetails } from '@procosys/modules/InvitationForPunchOut/types';
import { Close } from '@mui/icons-material';

const deleteIcon = <EdsIcon name="delete_to_trash" size={16} />;
const defaultTrueIcon = <EdsIcon name="star_filled" size={16} />;
const defaultFalseIcon = <EdsIcon name="star_outlined" size={16} />;

interface SavedFiltersProps {
    project: ProjectDetails | undefined;
    savedIPOFilters: SavedIPOFilter[] | null;
    refreshSavedIPOFilters: () => void;
    ipoFilter: IPOFilter;
    setIPOFilter: (ipoFilter: IPOFilter) => void;
    selectedSavedFilterTitle: string | null;
    setSelectedSavedFilterTitle: (savedFilterTitle: string | null) => void;
    onCloseRequest: () => void;
    selectedFilterIndex: number | null | undefined;
    setSelectedFilterIndex: (
        selectedFilterIndex: number | null | undefined
    ) => void;
}

const SavedFilters = (props: SavedFiltersProps): JSX.Element => {
    const [saveFilterMode, setSaveFilterMode] = useState<boolean>(false);
    const [newFilterTitle, setNewFilterTitle] = useState<string>('');
    const [newFilterIsDefault, setNewFilterIsDefault] =
        useState<boolean>(false);

    const { apiClient } = useInvitationForPunchOutContext();

    const saveFilter = async (): Promise<void> => {
        if (props.project === undefined) {
            console.error('The project is of type undefined');
            showSnackbarNotification(
                'Add IPO filter failed: Project is undefined',
                5000
            );
            return;
        }
        try {
            await apiClient.addSavedIPOFilter(
                props.project.id === -1 ? null : props.project.name,
                newFilterTitle,
                newFilterIsDefault,
                JSON.stringify(props.ipoFilter)
            );
            props.setSelectedSavedFilterTitle(newFilterTitle);
            showSnackbarNotification('Filter is saved.', 5000);
            setSaveFilterMode(false);
        } catch (error) {
            console.error('Add IPO filter failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const onSaveFilter = async (): Promise<void> => {
        await saveFilter();
        props.refreshSavedIPOFilters();
    };

    const deleteFilter = async (index: number): Promise<void> => {
        try {
            const filter =
                props.savedIPOFilters && props.savedIPOFilters[index];
            if (filter) {
                await apiClient.deleteSavedIPOFilter(
                    filter.id,
                    filter.rowVersion
                );
                showSnackbarNotification('Filter is deleted.', 5000);
            }
        } catch (error) {
            console.error(
                'Delete IPO filter failed: ',
                error.message,
                error.data
            );
            showSnackbarNotification(error.message, 5000);
        }
    };

    const onDeleteFilter = async (index: number): Promise<void> => {
        await deleteFilter(index);
        if (index === props.selectedFilterIndex) {
            props.setSelectedSavedFilterTitle(null);
            props.setSelectedFilterIndex(null);
        }
        props.refreshSavedIPOFilters();
    };

    const updateSavedFilter = async (filter: SavedIPOFilter): Promise<void> => {
        try {
            await apiClient.updateSavedIPOFilter(
                filter.id,
                filter.title,
                filter.defaultFilter,
                filter.criteria,
                filter.rowVersion
            );
            showSnackbarNotification('Filter is updated.', 5000);
        } catch (error) {
            console.error(
                'Update IPO filter failed: ',
                error.message,
                error.data
            );
            showSnackbarNotification(error.message, 5000);
        }
    };

    const onSetDefaultValue = async (
        defaultValue: boolean,
        index: number
    ): Promise<void> => {
        if (props.savedIPOFilters) {
            const filter = props.savedIPOFilters[index];
            filter.defaultFilter = defaultValue;
            await updateSavedFilter(filter);
            defaultValue
                ? showSnackbarNotification('Filter is set to default.', 5000)
                : showSnackbarNotification(
                      'Filter is no longer default.',
                      5000
                  );
            props.refreshSavedIPOFilters();
        }
    };

    const onSelectFilter = (index: number): void => {
        if (props.savedIPOFilters) {
            props.setSelectedSavedFilterTitle(
                props.savedIPOFilters[index].title
            );
            props.setIPOFilter(
                JSON.parse(props.savedIPOFilters[index].criteria)
            );
            props.onCloseRequest();
        }
    };

    if (saveFilterMode) {
        return (
            <Container>
                <Header>
                    <Typography variant="h6">Save as new filter</Typography>
                    <Button
                        variant="ghost"
                        title="Close"
                        onClick={(): void => {
                            props.onCloseRequest();
                        }}
                    >
                        <Close />
                    </Button>
                </Header>
                <Divider />
                <div
                    style={{
                        justifyContent: 'space-between',
                        margin: '16px 0 24px',
                        width: '300px',
                    }}
                >
                    <TextField
                        id={'title'}
                        label="Title for the filter"
                        value={newFilterTitle}
                        onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                        ): void => {
                            setNewFilterTitle(e.target.value);
                        }}
                        placeholder="Write here"
                    />
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Checkbox
                        checked={newFilterIsDefault}
                        onChange={(checked: boolean): void => {
                            setNewFilterIsDefault(checked);
                        }}
                    >
                        <Typography variant="body_long">
                            Set as default
                        </Typography>
                    </Checkbox>
                    <Button
                        onClick={onSaveFilter}
                        disabled={!newFilterTitle}
                        title={'Save current filter'}
                    >
                        Save filter
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <Typography variant="h6">Saved filters</Typography>
                <Button
                    variant="ghost"
                    title="Close"
                    onClick={(): void => {
                        props.onCloseRequest();
                    }}
                >
                    <Close />
                </Button>
            </Header>
            <Divider />
            <div
                style={{
                    padding:
                        'calc(var(--grid-unit) * 2) 0px calc(var(--grid-unit) * 2)',
                }}
            >
                <Button
                    onClick={(): void => {
                        setSaveFilterMode(true);
                    }}
                    disabled={props.selectedSavedFilterTitle}
                >
                    Save current filter
                </Button>
            </div>

            <ListContainer>
                {props.savedIPOFilters &&
                    props.savedIPOFilters.map((filter, index) => {
                        return (
                            <React.Fragment key={`filter._${index}`}>
                                <Row
                                    isSelectedFilter={
                                        index == props.selectedFilterIndex
                                    }
                                >
                                    <Link
                                        onClick={(): void =>
                                            onSelectFilter(index)
                                        }
                                    >
                                        {filter.title}
                                    </Link>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        {filter.defaultFilter ? (
                                            <Button
                                                variant="ghost"
                                                title="Remove as default filter"
                                                onClick={(): Promise<void> =>
                                                    onSetDefaultValue(
                                                        false,
                                                        index
                                                    )
                                                }
                                            >
                                                {defaultTrueIcon}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                title="Set as default"
                                                onClick={(): Promise<void> =>
                                                    onSetDefaultValue(
                                                        true,
                                                        index
                                                    )
                                                }
                                            >
                                                {defaultFalseIcon}
                                            </Button>
                                        )}

                                        <Button
                                            variant="ghost"
                                            title="Delete scope filter"
                                            onClick={(): Promise<void> =>
                                                onDeleteFilter(index)
                                            }
                                        >
                                            {deleteIcon}
                                        </Button>
                                    </div>
                                </Row>
                            </React.Fragment>
                        );
                    })}
            </ListContainer>
        </Container>
    );
};

export default SavedFilters;
