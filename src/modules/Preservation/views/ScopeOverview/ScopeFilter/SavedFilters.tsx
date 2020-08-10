import React, { useState, useEffect } from 'react';
import { TextField, Typography, Button } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import Checkbox from '../../../../../components/Checkbox';
import { ListContainer, Container, Header, Divider, Link, Row } from './SavedFilters.style';
import Spinner from '@procosys/components/Spinner';
import { TagListFilter } from '../types';
import { usePlantConfigContext } from '@procosys/modules/PlantConfig/context/PlantConfigContext';
import EdsIcon from '@procosys/components/EdsIcon';
import CloseIcon from '@material-ui/icons/Close';

const deleteIcon = <EdsIcon name='delete_to_trash' size={16} />;
const defaultTrueIcon = <EdsIcon name='star_filled' size={16} />;
const defaultFalseIcon = <EdsIcon name='star_outlined' size={16} />;

interface SavedFiltersProps {
    tagListFilter: TagListFilter;
    setTagListFilter: (tagListFilter: TagListFilter) => void;
    selectedSavedFilterId: number | null;
    setSelectedSavedFilterId: (savedFilterId: number | null) => void;
    onCloseRequest: () => void;
}

interface SavedFilter {
    id: number;
    title: string;
    criteria: string;
    default: boolean;
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
        preservationApiClient,
    } = usePlantConfigContext();

    const getSavedFilters = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await preservationApiClient.getSavedTagListFilters();
            setSavedFilters(response);
            /*            setSavedFilters([
                            {
                                id: 6,
                                title: 'Alle active',
                                criteria: {
                                    'tagNoStartsWith': 'EV-11', 'commPkgNoStartsWith': null, 'mcPkgNoStartsWith': null, 'purchaseOrderNoStartsWith': null, 'callOffStartsWith': null, 'storageAreaStartsWith': null, 'preservationStatus': 'Completed', 'actionStatus': null, 'voidedFilter': 'NotVoided', 'journeyIds': [], 'modeIds': [], 'dueFilters': ['NextWeek'], 'requirementTypeIds': ['12'], 'tagFunctionCodes': [], 'disciplineCodes': [], 'responsibleIds': [], 'areaCodes': ['M10']
                                },
                                default: true, rowVersion: 'asdf'
                            },
                            {
                                id: 1, title: 'No overdue actions', criteria:
                                    { "tagNoStartsWith": null, "commPkgNoStartsWith": null, "mcPkgNoStartsWith": null, "purchaseOrderNoStartsWith": null, "callOffStartsWith": null, "storageAreaStartsWith": null, "preservationStatus": null, "actionStatus": "HasOverDue", "voidedFilter": null, "journeyIds": [], "modeIds": [], "dueFilters": [], "requirementTypeIds": [], "tagFunctionCodes": [], "disciplineCodes": [], "responsibleIds": [], "areaCodes": [] }
                                , default: false, rowVersion: 'asdf'
                            },
                            {
                                id: 3, title: 'diverse', criteria:
                                    { "tagNoStartsWith": null, "commPkgNoStartsWith": null, "mcPkgNoStartsWith": null, "purchaseOrderNoStartsWith": null, "callOffStartsWith": null, "storageAreaStartsWith": null, "preservationStatus": null, "actionStatus": null, "voidedFilter": null, "journeyIds": [], "modeIds": [], "dueFilters": [], "requirementTypeIds": [], "tagFunctionCodes": [], "disciplineCodes": [], "responsibleIds": [], "areaCodes": ["M90"] }
                                , default: false, rowVersion: 'asdf'
            
                            },
                            { id: 4, title: 'Alle active3', criteria: { 'tagNoStartsWith': 'EV-11', 'commPkgNoStartsWith': null, 'mcPkgNoStartsWith': null, 'purchaseOrderNoStartsWith': null, 'callOffStartsWith': null, 'storageAreaStartsWith': null, 'preservationStatus': 'Completed', 'actionStatus': null, 'voidedFilter': 'NotVoided', 'journeyIds': [], 'modeIds': [], 'dueFilters': ['NextWeek'], 'requirementTypeIds': ['12'], 'tagFunctionCodes': [], 'disciplineCodes': [], 'responsibleIds': [], 'areaCodes': ['M10'] }, default: false, rowVersion: 'asdf' },
                            { id: 5, title: 'Alle active4', criteria: { 'tagNoStartsWith': 'EV-11', 'commPkgNoStartsWith': null, 'mcPkgNoStartsWith': null, 'purchaseOrderNoStartsWith': null, 'callOffStartsWith': null, 'storageAreaStartsWith': null, 'preservationStatus': 'Completed', 'actionStatus': null, 'voidedFilter': 'NotVoided', 'journeyIds': [], 'modeIds': [], 'dueFilters': ['NextWeek'], 'requirementTypeIds': ['12'], 'tagFunctionCodes': [], 'disciplineCodes': [], 'responsibleIds': [], 'areaCodes': ['M10'] }, default: false, rowVersion: 'asdf' },
                            { id: 6, title: 'Alle active5', criteria: { 'tagNoStartsWith': 'EV-11', 'commPkgNoStartsWith': null, 'mcPkgNoStartsWith': null, 'purchaseOrderNoStartsWith': null, 'callOffStartsWith': null, 'storageAreaStartsWith': null, 'preservationStatus': 'Completed', 'actionStatus': null, 'voidedFilter': 'NotVoided', 'journeyIds': [], 'modeIds': [], 'dueFilters': ['NextWeek'], 'requirementTypeIds': ['12'], 'tagFunctionCodes': [], 'disciplineCodes': [], 'responsibleIds': [], 'areaCodes': ['M10'] }, default: false, rowVersion: 'asdf' },
                            { id: 7, title: 'Alle active6', criteria: { 'tagNoStartsWith': 'EV-11', 'commPkgNoStartsWith': null, 'mcPkgNoStartsWith': null, 'purchaseOrderNoStartsWith': null, 'callOffStartsWith': null, 'storageAreaStartsWith': null, 'preservationStatus': 'Completed', 'actionStatus': null, 'voidedFilter': 'NotVoided', 'journeyIds': [], 'modeIds': [], 'dueFilters': ['NextWeek'], 'requirementTypeIds': ['12'], 'tagFunctionCodes': [], 'disciplineCodes': [], 'responsibleIds': [], 'areaCodes': ['M10'] }, default: false, rowVersion: 'asdf' },
                            { id: 8, title: 'Alle active7', criteria: { 'tagNoStartsWith': 'EV-11', 'commPkgNoStartsWith': null, 'mcPkgNoStartsWith': null, 'purchaseOrderNoStartsWith': null, 'callOffStartsWith': null, 'storageAreaStartsWith': null, 'preservationStatus': 'Completed', 'actionStatus': null, 'voidedFilter': 'NotVoided', 'journeyIds': [], 'modeIds': [], 'dueFilters': ['NextWeek'], 'requirementTypeIds': ['12'], 'tagFunctionCodes': [], 'disciplineCodes': [], 'responsibleIds': [], 'areaCodes': ['M10'] }, default: false, rowVersion: 'asdf' },
                            { id: 9, title: 'Alle active8', criteria: { 'tagNoStartsWith': 'EV-11', 'commPkgNoStartsWith': null, 'mcPkgNoStartsWith': null, 'purchaseOrderNoStartsWith': null, 'callOffStartsWith': null, 'storageAreaStartsWith': null, 'preservationStatus': 'Completed', 'actionStatus': null, 'voidedFilter': 'NotVoided', 'journeyIds': [], 'modeIds': [], 'dueFilters': ['NextWeek'], 'requirementTypeIds': ['12'], 'tagFunctionCodes': [], 'disciplineCodes': [], 'responsibleIds': [], 'areaCodes': ['M10'] }, default: false, rowVersion: 'asdf' },
                            { id: 10, title: 'Alle active9', criteria: { 'tagNoStartsWith': 'EV-11', 'commPkgNoStartsWith': null, 'mcPkgNoStartsWith': null, 'purchaseOrderNoStartsWith': null, 'callOffStartsWith': null, 'storageAreaStartsWith': null, 'preservationStatus': 'Completed', 'actionStatus': null, 'voidedFilter': 'NotVoided', 'journeyIds': [], 'modeIds': [], 'dueFilters': ['NextWeek'], 'requirementTypeIds': ['12'], 'tagFunctionCodes': [], 'disciplineCodes': [], 'responsibleIds': [], 'areaCodes': ['M10'] }, default: false, rowVersion: 'asdf' },
                            { id: 11, title: 'Alle active10', criteria: { 'tagNoStartsWith': 'EV-11', 'commPkgNoStartsWith': null, 'mcPkgNoStartsWith': null, 'purchaseOrderNoStartsWith': null, 'callOffStartsWith': null, 'storageAreaStartsWith': null, 'preservationStatus': 'Completed', 'actionStatus': null, 'voidedFilter': 'NotVoided', 'journeyIds': [], 'modeIds': [], 'dueFilters': ['NextWeek'], 'requirementTypeIds': ['12'], 'tagFunctionCodes': [], 'disciplineCodes': [], 'responsibleIds': [], 'areaCodes': ['M10'] }, default: false, rowVersion: 'asdf' },
                            { id: 12, title: 'Alle active11', criteria: { 'tagNoStartsWith': 'EV-11', 'commPkgNoStartsWith': null, 'mcPkgNoStartsWith': null, 'purchaseOrderNoStartsWith': null, 'callOffStartsWith': null, 'storageAreaStartsWith': null, 'preservationStatus': 'Completed', 'actionStatus': null, 'voidedFilter': 'NotVoided', 'journeyIds': [], 'modeIds': [], 'dueFilters': ['NextWeek'], 'requirementTypeIds': ['12'], 'tagFunctionCodes': [], 'disciplineCodes': [], 'responsibleIds': [], 'areaCodes': ['M10'] }, default: false, rowVersion: 'asdf' },
                            { id: 13, title: 'Alle active12', criteria: { 'tagNoStartsWith': 'EV-11', 'commPkgNoStartsWith': null, 'mcPkgNoStartsWith': null, 'purchaseOrderNoStartsWith': null, 'callOffStartsWith': null, 'storageAreaStartsWith': null, 'preservationStatus': 'Completed', 'actionStatus': null, 'voidedFilter': 'NotVoided', 'journeyIds': [], 'modeIds': [], 'dueFilters': ['NextWeek'], 'requirementTypeIds': ['12'], 'tagFunctionCodes': [], 'disciplineCodes': [], 'responsibleIds': [], 'areaCodes': ['M10'] }, default: false, rowVersion: 'asdf' },
                            { id: 14, title: 'Alle active13', criteria: { 'tagNoStartsWith': 'EV-11', 'commPkgNoStartsWith': null, 'mcPkgNoStartsWith': null, 'purchaseOrderNoStartsWith': null, 'callOffStartsWith': null, 'storageAreaStartsWith': null, 'preservationStatus': 'Completed', 'actionStatus': null, 'voidedFilter': 'NotVoided', 'journeyIds': [], 'modeIds': [], 'dueFilters': ['NextWeek'], 'requirementTypeIds': ['12'], 'tagFunctionCodes': [], 'disciplineCodes': [], 'responsibleIds': [], 'areaCodes': ['M10'] }, default: false, rowVersion: 'asdf' },
                            { id: 15, title: 'Alle active14', criteria: { 'tagNoStartsWith': 'EV-11', 'commPkgNoStartsWith': null, 'mcPkgNoStartsWith': null, 'purchaseOrderNoStartsWith': null, 'callOffStartsWith': null, 'storageAreaStartsWith': null, 'preservationStatus': 'Completed', 'actionStatus': null, 'voidedFilter': 'NotVoided', 'journeyIds': [], 'modeIds': [], 'dueFilters': ['NextWeek'], 'requirementTypeIds': ['12'], 'tagFunctionCodes': [], 'disciplineCodes': [], 'responsibleIds': [], 'areaCodes': ['M10'] }, default: false, rowVersion: 'asdf' },
                            { id: 16, title: 'Alle active15', criteria: { 'tagNoStartsWith': 'EV-11', 'commPkgNoStartsWith': null, 'mcPkgNoStartsWith': null, 'purchaseOrderNoStartsWith': null, 'callOffStartsWith': null, 'storageAreaStartsWith': null, 'preservationStatus': 'Completed', 'actionStatus': null, 'voidedFilter': 'NotVoided', 'journeyIds': [], 'modeIds': [], 'dueFilters': ['NextWeek'], 'requirementTypeIds': ['12'], 'tagFunctionCodes': [], 'disciplineCodes': [], 'responsibleIds': [], 'areaCodes': ['M10'] }, default: false, rowVersion: 'asdf' },
            
                        ]
                        );
            */
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
        if (savedFilters && props.selectedSavedFilterId) {
            const selectedFilterIndex = savedFilters.findIndex((filter) => filter.id == props.selectedSavedFilterId);
            setSelectedFilterIndex(selectedFilterIndex);
            if (props.selectedSavedFilterId && JSON.stringify(props.tagListFilter) != JSON.stringify(savedFilters[selectedFilterIndex].criteria)) {
                props.setSelectedSavedFilterId(null);
                setSelectedFilterIndex(null);
            }
        }
    }, [savedFilters, props.tagListFilter]);

    const onSaveFilter = async (): Promise<void> => {
        try {
            await preservationApiClient.addSavedTagListFilter(newFilterTitle, newFilterIsDefault, JSON.stringify(props.tagListFilter));
            getSavedFilters();
            showSnackbarNotification('Filter is saved.', 5000);
            setSaveFilterMode(false);
        } catch (error) {
            console.error('Add scope filter failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const onDeleteFilter = async (index: number): Promise<void> => {
        showSnackbarNotification('Filter is deleted.', 5000);
        console.log(index);
        getSavedFilters();
    };

    const onRemoveDefault = async (index: number): Promise<void> => {
        showSnackbarNotification('Filter is no longer default.', 5000);
        console.log(index);
        getSavedFilters();
    };
    const onSetDefault = async (index: number): Promise<void> => {
        showSnackbarNotification('Filter is now default.', 5000);
        console.log(index);
        getSavedFilters();
    };

    const onSelectFilter = (index: number): void => {
        if (savedFilters) {
            props.setSelectedSavedFilterId(savedFilters[index].id);
            props.setTagListFilter(JSON.parse(savedFilters[index].criteria));
        }
    };

    if (isLoading) {
        return <Spinner large />;
    }

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

    console.log('Tag: ', props.tagListFilter);

    console.log('Tag: ' + JSON.stringify(props.tagListFilter));

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
                <Button onClick={(): void => { setSaveFilterMode(true); }} disabled={props.selectedSavedFilterId}>
                    Save current filter
                </Button>
            </div>
            <ListContainer>
                {savedFilters && savedFilters.map((filter, index) => {
                    return (
                        <React.Fragment key={`filter._${index}`}>
                            <Row isSelectedFilter={index == selectedFilterIndex} >
                                <Link onClick={(): void => onSelectFilter(index)}>
                                    {filter.title}
                                </Link>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    {filter.default ?
                                        <Button variant='ghost' title="Remove as default filter" onClick={(): Promise<void> => onRemoveDefault(index)}>
                                            {defaultTrueIcon}
                                        </Button>
                                        :
                                        <Button variant='ghost' title="Set as default" onClick={(): Promise<void> => onSetDefault(index)}>
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
