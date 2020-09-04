import { Collapse, CollapseInfo, Expand, ExpandHeader, ExpandSection, Header, TagContainer, TagList } from './TagDetails.style';
import React, { useEffect, useState } from 'react';

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Tag } from '../types';
import { Typography } from '@equinor/eds-core-react';

interface TagDetailsProps {
    selectedTags: Tag[];
    removeTag?: ((tagNo: string) => void) | null;
    collapsed?: boolean;
    showMCPkg?: boolean;
}

const TagDetails = ({
    selectedTags,
    removeTag,
    collapsed = true,
    showMCPkg = true
}: TagDetailsProps): JSX.Element => {

    const [expandedTagNo, setExpandedTagNo] = useState<string | null>(null);

    useEffect((): void => {
        if (!collapsed && selectedTags.length > 0) {
            setExpandedTagNo(selectedTags[0].tagNo);
        }
    }, [selectedTags]);

    const toggleDetails = (tagNo: string): void => {
        if (tagNo === expandedTagNo) {
            setExpandedTagNo(null);
        } else {
            setExpandedTagNo(tagNo);
        }
    };

    const createTagSection = (tag: Tag): JSX.Element => {
        const isExpanded = tag.tagNo === expandedTagNo;

        return (
            <TagContainer key={tag.tagNo}>
                <Collapse>
                    <IconButton size='small' onClick={(): void => toggleDetails(tag.tagNo)}>
                        {
                            isExpanded
                                ? <KeyboardArrowUpIcon />
                                : <KeyboardArrowDownIcon />
                        }
                    </IconButton>
                    <CollapseInfo>
                        {tag.tagNo}
                    </CollapseInfo>
                    {removeTag &&
                        <IconButton size='small' title='Remove' onClick={(): void => removeTag(tag.tagNo)}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    }
                </Collapse>
                {
                    (isExpanded) && (
                        <Expand>
                            <ExpandSection>
                                <ExpandHeader>Tag description</ExpandHeader>
                                <div>{tag.description}</div>
                            </ExpandSection>
                            {showMCPkg &&
                                <ExpandSection>
                                    <ExpandHeader>MC pkg</ExpandHeader>
                                    <div>{tag.mcPkgNo}</div>
                                </ExpandSection>
                            }
                        </Expand>
                    )
                }
            </TagContainer>
        );
    };

    return (
        <div>
            <Header>
                <Typography variant="h1">Selected tag(s)</Typography>
            </Header>
            <div>
                {selectedTags.length} tag(s) selected
            </div>
            <TagList>
                {
                    selectedTags.map(tag => createTagSection(tag))
                }
            </TagList>
        </div>
    );
};

export default TagDetails;
