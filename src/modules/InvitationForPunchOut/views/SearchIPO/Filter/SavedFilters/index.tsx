// TODO: change imports to use correct for this module
import React, { useState, useEffect } from 'react';
import { TextField, Typography, Button } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import Checkbox from '../../../../../components/Checkbox';
import { ListContainer, Container, Header, Divider, Link, Row } from './index.style';
import { SavedTagListFilter, TagListFilter } from '../types';
import EdsIcon from '@procosys/components/EdsIcon';
import CloseIcon from '@material-ui/icons/Close';
import { usePreservationContext } from '@procosys/modules/Preservation/context/PreservationContext';

const deleteIcon = <EdsIcon name='delete_to_trash' size={16} />;
const defaultTrueIcon = <EdsIcon name='star_filled' size={16} />;
const defaultFalseIcon = <EdsIcon name='star_outlined' size={16} />;

//TODO: change to use the IPOFilter instead of TagListFilter
interface SavedFiltersProps {
    savedTagListFilters: SavedTagListFilter[];
    refreshSavedTagListFilters: () => void;
    tagListFilter: TagListFilter;
    setTagListFilter: (tagListFilter: TagListFilter) => void;
    selectedSavedFilterTitle: string | null;
    setSelectedSavedFilterTitle: (savedFilterTitle: string | null) => void;
    onCloseRequest: () => void;
}

const SavedFilters = (props: SavedFiltersProps): JSX.Element => {

    const [saveFilterMode, setSaveFilterMode] = useState<boolean>(false);
    const [newFilterTitle, setNewFilterTitle] = useState<string>('');
    const [newFilterIsDefault, setNewFilterIsDefault] = useState<boolean>(false);
    const [selectedFilterIndex, setSelectedFilterIndex] = useState<number | null>();

    //TODO: change to use IPO
    const {
        project,
        apiClient
    } = usePreservationContext();

    //TODO: use IPOFilter not TagListFilter
    //Set selected filter to null, if filter values are changed
    useEffect((): void => {
        if (props.savedTagListFilters && props.selectedSavedFilterTitle) {
            const selectedFilterIndex = props.savedTagListFilters.findIndex((filter) => filter.title == props.selectedSavedFilterTitle);
            setSelectedFilterIndex(selectedFilterIndex);
            if (props.selectedSavedFilterTitle && JSON.stringify(props.tagListFilter) != JSON.stringify(props.savedTagListFilters[selectedFilterIndex].criteria)) {
                props.setSelectedSavedFilterTitle(null);
                setSelectedFilterIndex(null);
            }
        }
    }, [props.savedTagListFilters, props.tagListFilter]);

    //TODO: use IPOFilter not TagListFilter
    const onSaveFilter = async (): Promise<void> => {
        try {
            // NOTE: needs a mock for now, as the API doesn't have all that I need
            await apiClient.addSavedTagListFilter(project.name, newFilterTitle, newFilterIsDefault, JSON.stringify(props.tagListFilter));
            props.refreshSavedTagListFilters();
            showSnackbarNotification('Filter is saved.', 5000);
            setSaveFilterMode(false);
        } catch (error) {
            console.error('Add scope filter failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    //TODO: use IPOFilter not TagListFilter
    const onDeleteFilter = async (index: number): Promise<void> => {
        try {
            const filter = props.savedTagListFilters && props.savedTagListFilters[index];
            if (filter) {
                // NOTE: needs a mock for now, as the API doesn't have all that I need
                await apiClient.deleteSavedTagListFilter(filter.id, filter.rowVersion);
                props.refreshSavedTagListFilters();
                showSnackbarNotification('Filter is deleted.', 5000);
            }
        } catch (error) {
            console.error('Delete scope filter failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    //TODO: use IPOFilter not TagListFilter
    const updateSavedFilter = async (filter: SavedTagListFilter): Promise<void> => {
        try {
            // NOTE: needs a mock for now, as the API doesn't have all that I need
            await apiClient.updateSavedTagListFilter(filter.id, filter.title, filter.defaultFilter, filter.criteria, filter.rowVersion);
            props.refreshSavedTagListFilters();
            showSnackbarNotification('Filter is updated.', 5000);
        } catch (error) {
            console.error('Update scope filter failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    //TODO: use IPOFilter not TagListFilter
    const onSetDefaultValue = async (defaultValue: boolean, index: number): Promise<void> => {
        if (props.savedTagListFilters) {
            const filter = props.savedTagListFilters[index];
            filter.defaultFilter = defaultValue;
            updateSavedFilter(filter);
            showSnackbarNotification('Filter is no longer default.', 5000);
            props.refreshSavedTagListFilters();
        }
    };

    //TODO: use IPOFilter not TagListFilter
    const onSelectFilter = (index: number): void => {
        if (props.savedTagListFilters) {
            props.setSelectedSavedFilterTitle(props.savedTagListFilters[index].title);
            props.setTagListFilter(JSON.parse(props.savedTagListFilters[index].criteria));
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

    //TODO: use IPOFilter not TagListFilter
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
                {props.savedTagListFilters && props.savedTagListFilters.map((filter, index) => {
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