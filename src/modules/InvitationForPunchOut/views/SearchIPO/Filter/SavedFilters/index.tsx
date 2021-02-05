import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { Container, Divider, Header, Link, ListContainer, Row } from './index.style';
import { IPOFilter, SavedIPOFilter } from '../../types';
import React, { useEffect, useState } from 'react';

import Checkbox from '@procosys/components/Checkbox';
import CloseIcon from '@material-ui/icons/Close';
import EdsIcon from '@procosys/components/EdsIcon';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { usePreservationContext } from '@procosys/modules/Preservation/context/PreservationContext';

const deleteIcon = <EdsIcon name='delete_to_trash' size={16} />;
const defaultTrueIcon = <EdsIcon name='star_filled' size={16} />;
const defaultFalseIcon = <EdsIcon name='star_outlined' size={16} />;

interface SavedFiltersProps {
    savedFilters: SavedIPOFilter[];
    refreshSavedFilters: () => void;
    filter: IPOFilter;
    setFilter: (filter: IPOFilter) => void;
    selectedSavedFilterTitle: string | null;
    setSelectedSavedFilterTitle: (savedFilterTitle: string | null) => void;
    onCloseRequest: () => void;
}

const SavedFilters = (props: SavedFiltersProps): JSX.Element => {

    const [saveFilterMode, setSaveFilterMode] = useState<boolean>(false);
    const [newFilterTitle, setNewFilterTitle] = useState<string>('');
    const [newFilterIsDefault, setNewFilterIsDefault] = useState<boolean>(false);
    const [selectedFilterIndex, setSelectedFilterIndex] = useState<number | null>();

    const {
        project,
        apiClient
    } = usePreservationContext();

    //Set selected filter to null, if filter values are changed
    useEffect((): void => {
        if (props.savedFilters && props.selectedSavedFilterTitle) {
            const selectedFilterIndex = props.savedFilters.findIndex((filter) => filter.title == props.selectedSavedFilterTitle);
            setSelectedFilterIndex(selectedFilterIndex);
            if (props.selectedSavedFilterTitle && JSON.stringify(props.filter) != JSON.stringify(props.savedFilters[selectedFilterIndex].criteria)) {
                props.setSelectedSavedFilterTitle(null);
                setSelectedFilterIndex(null);
            }
        }
    }, [props.savedFilters, props.filter]);

    const onSaveFilter = async (): Promise<void> => {
        try {
            await apiClient.addSavedTagListFilter(project.name, newFilterTitle, newFilterIsDefault, JSON.stringify(props.filter));
            props.refreshSavedFilters();
            showSnackbarNotification('Filter is saved.', 5000);
            setSaveFilterMode(false);
        } catch (error) {
            console.error('Add scope filter failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const onDeleteFilter = async (index: number): Promise<void> => {
        try {
            const filter = props.savedFilters && props.savedFilters[index];
            if (filter) {
                await apiClient.deleteSavedTagListFilter(filter.id, filter.rowVersion);
                props.refreshSavedFilters();
                showSnackbarNotification('Filter is deleted.', 5000);
            }
        } catch (error) {
            console.error('Delete scope filter failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const updateSavedFilter = async (filter: SavedIPOFilter): Promise<void> => {
        try {
            await apiClient.updateSavedTagListFilter(filter.id, filter.title, filter.defaultFilter, filter.criteria, filter.rowVersion);
            props.refreshSavedFilters();
            showSnackbarNotification('Filter is updated.', 5000);
        } catch (error) {
            console.error('Update scope filter failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const onSetDefaultValue = async (defaultValue: boolean, index: number): Promise<void> => {
        if (props.savedFilters) {
            const filter = props.savedFilters[index];
            filter.defaultFilter = defaultValue;
            updateSavedFilter(filter);
            showSnackbarNotification('Filter is no longer default.', 5000);
            props.refreshSavedFilters();
        }
    };

    const onSelectFilter = (index: number): void => {
        if (props.savedFilters) {
            props.setSelectedSavedFilterTitle(props.savedFilters[index].title);
            props.setFilter(JSON.parse(props.savedFilters[index].criteria));
            props.onCloseRequest();
        }
    };

    if (saveFilterMode) {
        return (
            <Container>
                <Header>
                    <Typography variant='h6'>Save as new filter</Typography>
                    <Button variant='ghost' title='Close' onClick={(): void => { props.onCloseRequest(); }}>
                        <CloseIcon />
                    </Button>
                </Header>

                <Divider />
                <div style={{ justifyContent: 'space-between', margin: '16px 0 24px', width: '300px' }}>
                    <TextField
                        id={'title'}
                        label='Title for the filter'
                        value={newFilterTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { setNewFilterTitle(e.target.value); }}
                        placeholder="Write here"
                    />
                </div>

                < div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Checkbox
                        checked={newFilterIsDefault}
                        onChange={(checked: boolean): void => {
                            setNewFilterIsDefault(checked);
                        }}
                    >
                        <Typography variant='body_long'>Set as default</Typography>
                    </Checkbox>
                    <Button onClick={onSaveFilter} disabled={!newFilterTitle} title={'Save current filter'}>
                        Save filter
                    </Button>
                </div>
            </Container >
        );
    }

    return (
        <Container>
            <Header>
                <Typography variant='h6'>Saved filters</Typography>
                <Button variant='ghost' title='Close' onClick={(): void => { props.onCloseRequest(); }}>
                    <CloseIcon />
                </Button>
            </Header>
            <Divider />
            <div style={{ padding: 'calc(var(--grid-unit) * 2) 0px calc(var(--grid-unit) * 2)' }}>
                <Button onClick={(): void => { setSaveFilterMode(true); }} disabled={props.selectedSavedFilterTitle}>
                    Save current filter
                </Button>
            </div>

            <ListContainer>
                {props.savedFilters && props.savedFilters.map((filter, index) => {
                    return (
                        <React.Fragment key={`filter._${index}`}>
                            <Row isSelectedFilter={index == selectedFilterIndex} >
                                <Link onClick={(): void => onSelectFilter(index)}>
                                    {filter.title}
                                </Link>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    {filter.defaultFilter ?
                                        <Button variant='ghost' title="Remove as default filter" onClick={(): Promise<void> => onSetDefaultValue(false, index)}>
                                            {defaultTrueIcon}
                                        </Button>
                                        :
                                        <Button variant='ghost' title="Set as default" onClick={(): Promise<void> => onSetDefaultValue(true, index)}>
                                            {defaultFalseIcon}
                                        </Button>
                                    }

                                    <Button variant='ghost' title="Delete scope filter" onClick={(): Promise<void> => onDeleteFilter(index)}>
                                        {deleteIcon}
                                    </Button>
                                </div>

                            </Row>
                        </React.Fragment>
                    );
                })}
            </ListContainer>

        </Container >
    );
};

export default SavedFilters;

