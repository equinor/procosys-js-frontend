import React, { useState, useEffect } from 'react';
import { TextField, Typography, Button } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import Checkbox from './../../../../../components/Checkbox';
import { SavedFilterListContainer, SavedFilterContainer, Divider, Column } from './ScopeFilter.style';
import Spinner from '@procosys/components/Spinner';
import { TagListFilter } from '../types';
import { usePlantConfigContext } from '@procosys/modules/PlantConfig/context/PlantConfigContext';
import EdsIcon from '@procosys/components/EdsIcon';

const deleteIcon = <EdsIcon name='delete_to_trash' size={16} />;
const defaultTrueIcon = <EdsIcon name='star_filled' size={16} />;
const defaultFalseIcon = <EdsIcon name='star_outlined' size={16} />;

interface SavedScopeFiltersProps {
    tagListFilter: TagListFilter;
}

interface SavedFilter {
    id: number;
    title: string;
    criteria: string;
    default: boolean;
    rowVersion: string;
}

const SavedScopeFilters = (props: SavedScopeFiltersProps): JSX.Element => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
    const [saveFilterMode, setSaveFilterMode] = useState<boolean>(false);
    const [newFilterTitle, setNewFilterTitle] = useState<string>('');
    const [newFilterIsDefault, setNewFilterIsDefault] = useState<boolean>(false);
    const [selectedFilter, setSelectedSavedFilter] = useState<number | null>(null);

    const {
        preservationApiClient,
    } = usePlantConfigContext();


    const getSavedFilters = async (): Promise<void> => {
        setIsLoading(true);
        try {
            //            response = await preservationApiClient.getSavedFilters();
            //          setSavedFilters(response.data);
            setSavedFilters([
                { id: 1, title: 'tesqweqwef qeft1', criteria: 'critier1', default: true, rowVersion: 'asdf' },
                { id: 3, title: 'test3', criteria: 'critier5', default: false, rowVersion: 'asdf' },
                { id: 4, title: 'test4', criteria: 'critier5', default: false, rowVersion: 'asdf' },
                { id: 5, title: 'tesqqweft5', criteria: 'critier6', default: false, rowVersion: 'asdf' }]
            );

        } catch (error) {
            console.error('Get saved filters failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

    useEffect((): void => {
        getSavedFilters();
    }, []);

    const onSaveFilter = async (): Promise<void> => {
        try {
            await preservationApiClient.addScopeFilter(newFilterTitle, newFilterIsDefault, JSON.stringify(props.tagListFilter));
            getSavedFilters();
            showSnackbarNotification('Filter is saved.', 5000);
            setSaveFilterMode(false);
        } catch (error) {
            console.error('Add scope filter failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const onDeleteFilter = async (index: number): Promise<void> => {
        console.log('delete ', index);
        showSnackbarNotification('Filter is deleted.', 5000);
        getSavedFilters();
    };


    if (isLoading) {
        return <Spinner large />;
    }

    if (saveFilterMode) {
        return (
            <SavedFilterContainer>
                <Typography variant='h6'>Save as new filter</Typography>
                <Divider />
                <div style={{ margin: '16px 0 24px', width: '300px' }}>
                    <TextField
                        id={'title'}
                        label='Title for this filter'
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
            </SavedFilterContainer >
        );
    }

    return (
        <SavedFilterContainer>
            <Typography variant='h6'>Saved filters</Typography>
            <Divider />
            <div style={{ padding: '8px' }}>
                <Button onClick={(): void => { setSaveFilterMode(true); }} disabled={selectedFilter}>
                    Save current filter
                </Button>
            </div>
            <SavedFilterListContainer>
                {savedFilters.map((filter, index) => {
                    return (
                        <React.Fragment key={`filter._${index}`}>
                            <div style={{ width: '100%' }} onClick={(): void => setSelectedSavedFilter(index)}>
                                <Column style={{ marginRight: 'calc(var(--grid-unit) * 2)' }}>{filter.title}</Column>
                            </div>
                            <div style={{ width: '100%' }}>

                                <Column>
                                    {filter.default ?
                                        <Button variant='ghost' title="Remove as default filter" onClick={(): Promise<void> => onDeleteFilter(index)}>
                                            {defaultTrueIcon}
                                        </Button>
                                        :
                                        <Button variant='ghost' title="Set as default" onClick={(): Promise<void> => onDeleteFilter(index)}>
                                            {defaultFalseIcon}
                                        </Button>
                                    }

                                    <Button variant='ghost' title="Delete scope filter" onClick={(): Promise<void> => onDeleteFilter(index)}>
                                        {deleteIcon}
                                    </Button>
                                </Column>
                            </div>
                        </React.Fragment>
                    );
                })}
            </SavedFilterListContainer>
        </SavedFilterContainer >
    );
};

export default SavedScopeFilters;
