import React from 'react';
import { tokens } from '@equinor/eds-tokens';
import { Button } from '@equinor/eds-core-react';
import { Tag, TagMigrationRow } from '../types';
import { Container, Header, InnerContainer, ButtonsContainer, TopContainer, TagsHeader, LoadingContainer } from './SelectMigrateTags.style';
import { usePreservationContext } from '../../../context/PreservationContext';
import Table from '../../../../../components/Table';
import Loading from '../../../../../components/Loading';
import { AddScopeMethod } from '../AddScope';
import { useHistory } from 'react-router-dom';

type SelectMigrateTagsProps = {
    selectedTags: Tag[];
    migrationTableData: TagMigrationRow[];
    setSelectedTags: (tags: Tag[]) => void;
    searchTags: (tagNo: string | null) => void;
    nextStep: () => void;
    isLoading: boolean;
    addScopeMethod: AddScopeMethod;
    removeTag: (tagNo: string) => void;
}

const tableColumns = [
    { title: 'Tag no', field: 'tagNo' },
    { title: 'Description', field: 'description' },
    { title: 'Register', field: 'registerCode' },
    { title: 'Tag Func', field: 'tagFunctionCode' },
    { title: 'Comm Pkg', field: 'commPkgNo' },
    { title: 'Mc Pkg', field: 'mcPkgNo' },
    { title: 'PO No', field: 'purchaseOrderNo' },
    { title: 'PO title', field: 'purchaseOrderTitle' },
    { title: 'Call Off', field: 'callOffNo' },
    { title: 'MCCR Resp', field: 'mccrResponsibleCodes' },
    { title: 'Remark', field: 'preservationRemark' },
    { title: 'Storage Area', field: 'storageArea' },
    { title: 'Mode', field: 'modeCode' },
    { title: 'Heating', render: (tag: TagMigrationRow): string => tag.heating === true ? 'Yes' : 'No' },
    { title: 'Special Req.', render: (tag: TagMigrationRow): string => tag.special === true ? 'Yes' : 'No' }
];

const SelectMigrateTags = (props: SelectMigrateTagsProps): JSX.Element => {
    const { project } = usePreservationContext();
    const history = useHistory();

    const removeAllSelectedTagsInScope = (): void => {
        const tagNos: string[] = [];
        props.migrationTableData.forEach(l => {
            tagNos.push(l.tagNo);
        });
        const newSelectedTags = props.selectedTags.filter(item => !tagNos.includes(item.tagNo));
        props.setSelectedTags(newSelectedTags);
    };

    const addAllTagsInScope = (rowData: TagMigrationRow[]): void => {
        const allRows = rowData
            .map(row => {
                return {
                    tagNo: row.tagNo,
                    description: row.description,
                    mcPkgNo: row.mcPkgNo
                };
            });
        const rowsToAdd = allRows.filter(row => !props.selectedTags.some(tag => tag.tagNo === row.tagNo));
        props.setSelectedTags([...props.selectedTags, ...rowsToAdd]);
    };

    const handleSingleTag = (row: TagMigrationRow): void => {
        const tagToHandle = {
            tagNo: row.tagNo,
            description: row.description,
            mcPkgNo: row.mcPkgNo
        };
        if (row.tableData && !row.tableData.checked) {
            props.removeTag(row.tagNo);
        } else {
            props.setSelectedTags([...props.selectedTags, tagToHandle]);
        }
    };

    const rowSelectionChanged = (rowData: TagMigrationRow[], row: TagMigrationRow): void => {
        // exclude any preserved tags (material-table bug)

        if (rowData.length == 0 && props.migrationTableData.length > 0) {
            removeAllSelectedTagsInScope();
        } else if (rowData.length > 0 && rowData[0].tableData && !row) {
            addAllTagsInScope(rowData);
        } else if (rowData.length > 0) {
            handleSingleTag(row);
        }
    };

    const cancel = (): void => {
        history.push('/');
    };

    return (
        <Container>
            <Header>
                <h1>Migrate preservation scope</h1>
                <div>{project.description}</div>
            </Header>
            <TopContainer>
                <InnerContainer>
                    <TagsHeader>Select the tags that should be migrated, and click &apos;next&apos;</TagsHeader>
                </InnerContainer>
                <ButtonsContainer>
                    <Button onClick={cancel} variant='outlined' >Cancel</Button>
                    <Button onClick={props.nextStep} disabled={props.selectedTags.length === 0}>Next</Button>
                </ButtonsContainer>
            </TopContainer>
            <Table
                columns={tableColumns}
                data={props.migrationTableData}
                options={{
                    toolbar: false,
                    showTitle: false,
                    filtering: true,
                    search: false,
                    draggable: false,
                    pageSize: 10,
                    pageSizeOptions: [10, 50, 100],
                    padding: 'dense',
                    headerStyle: {
                        backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba,
                    },
                    selection: true,
                    rowStyle: (data): any => ({
                        backgroundColor: data.tableData.checked && '#e6faec'
                    })
                }}
                style={{
                    boxShadow: 'none'
                }}
                onSelectionChange={(rowData, row): void => {
                    rowSelectionChanged(rowData, row);
                }}
                isLoading={props.isLoading}
                components={{
                    OverlayLoading: (): JSX.Element => (
                        <LoadingContainer>
                            <Loading title="Loading tags" />
                        </LoadingContainer>
                    )
                }}
            />
        </Container >
    );
};

export default SelectMigrateTags;
