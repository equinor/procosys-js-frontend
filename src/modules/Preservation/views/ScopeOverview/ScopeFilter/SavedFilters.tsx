import React, { useState, useEffect } from 'react';
import { TextField, Typography, Button } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import Checkbox from '../../../../../components/Checkbox';
import { ListContainer, Container, Header, Divider, Link, Row } from './SavedFilters.style';
import Spinner from '@procosys/components/Spinner';
import { TagListFilter } from '../types';
import EdsIcon from '@procosys/components/EdsIcon';
import CloseIcon from '@material-ui/icons/Close';
import { usePreservationContext } from '@procosys/modules/Preservation/context/PreservationContext';

const deleteIcon = <EdsIcon name='delete_to_trash' size={16} />;
const defaultTrueIcon = <EdsIcon name='star_filled' size={16} />;
const defaultFalseIcon = <EdsIcon name='star_outlined' size={16} />;

interface SavedFiltersProps {
    tagListFilter: TagListFilter;
    setTagListFilter: (tagListFilter: TagListFilter) => void;
    selectedSavedFilterTitle: string | null;
    setSelectedSavedFilterTitle: (savedFilterTitle: string | null) => void;
    onCloseRequest: () => void;
}

interface SavedFilter {
    id: number;
    title: string;
    criteria: string;
    defaultFilter: boolean;
    rowVersion: string;
}

const SavedFilters = (props: SavedFiltersProps): JSX.Element => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [savedFilters, setSavedFilters] = useState<SavedFilter[]>();
    const [saveFilterMode, setSaveFilterMode] = useState<boolean>(false);
    const [newFilterTitle, setNewFilterTitle] = useState<string>('');
    const [newFilterIsDefault, setNewFilterIsDefault] = useState<boolean>(false);
    const [selectedFilterIndex, setSelectedFilterIndex] = useState<number | null>();

    const {
        project,
        apiClient
    } = usePreservationContext();

    const getSavedFilters = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await apiClient.getSavedTagListFilters(project.name);
            setSavedFilters(response);
        } catch (error) {
            console.error('Get saved filters failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

    useEffect((): void => {
        getSavedFilters();
    }, []);

    //Set selected filter to null, if filter values are changed
    useEffect((): void => {
        if (savedFilters && props.selectedSavedFilterTitle) {
            const selectedFilterIndex = savedFilters.findIndex((filter) => filter.title == props.selectedSavedFilterTitle);
            setSelectedFilterIndex(selectedFilterIndex);
            if (props.selectedSavedFilterTitle && JSON.stringify(props.tagListFilter) != JSON.stringify(savedFilters[selectedFilterIndex].criteria)) {
                props.setSelectedSavedFilterTitle(null);
                setSelectedFilterIndex(null);
            }
        }
    }, [savedFilters, props.tagListFilter]);

    const onSaveFilter = async (): Promise<void> => {
        try {
            await apiClient.addSavedTagListFilter(project.name, newFilterTitle, newFilterIsDefault, JSON.stringify(props.tagListFilter));
            getSavedFilters();
            showSnackbarNotification('Filter is saved.', 5000);
            setSaveFilterMode(false);
        } catch (error) {
            console.error('Add scope filter failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const onDeleteFilter = async (index: number): Promise<void> => {
        try {
            const filter = savedFilters && savedFilters[index];
            if (filter) {
                await apiClient.deleteSavedTagListFilter(1, filter.rowVersion);
                getSavedFilters();
                showSnackbarNotification('Filter is deleted.', 5000);
            }
        } catch (error) {
            console.error('Delete scope filter failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };


    const updateSavedFilter = async (filter: SavedFilter): Promise<void> => {
        try {
            await apiClient.updateSavedTagListFilter(filter.id, filter.title, filter.defaultFilter, filter.criteria, filter.rowVersion);
            getSavedFilters();
            showSnackbarNotification('Filter is deleted.', 5000);
        } catch (error) {
            console.error('Delete scope filter failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const onSetDefaultValue = async (defaultValue: boolean, index: number): Promise<void> => {
        if (savedFilters) {
            const filter = savedFilters[index];
            filter.defaultFilter = defaultValue;
            updateSavedFilter(filter);
            showSnackbarNotification('Filter is no longer default.', 5000);
            getSavedFilters();
        }
    };

    const onSelectFilter = (index: number): void => {
        if (savedFilters) {
            props.setSelectedSavedFilterTitle(savedFilters[index].title);
            props.setTagListFilter(JSON.parse(savedFilters[index].criteria));
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
                        placeholder="Write Here"
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
            </div>¨

            {isLoading && <Spinner />}

            {!isLoading && <ListContainer>
                {savedFilters && savedFilters.map((filter, index) => {
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
            }
        </Container >
    );
};

export default SavedFilters;
