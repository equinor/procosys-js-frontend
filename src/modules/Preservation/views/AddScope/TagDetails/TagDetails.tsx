import React, { useState } from 'react';

import { Tag } from '../types';
import { Header, TagList, TagContainer, Collapse, CollapseInfo, Expand, ExpandHeader, ExpandSection } from './TagDetails.style';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

interface TagDetailsProps {
    selectedTags: Tag[];
    removeTag: (tagNo: string) => void;
    creatingNewTag?: boolean;
}

const TagDetails = ({
    selectedTags,
    removeTag,
    creatingNewTag = false
}: TagDetailsProps): JSX.Element => {

    const [expandedTagNo, setExpandedTagNo] = useState<string | null>();

    const toggleDetails = (tagNo: string): void => {
        if (tagNo === expandedTagNo) {
            setExpandedTagNo(null);
        } else {
            setExpandedTagNo(tagNo);
        }
    };

    const createTagSection = (tag: Tag): JSX.Element => {
        const isExpanded = tag.tagNo === expandedTagNo || creatingNewTag;

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
                    { !creatingNewTag &&
                        <IconButton size='small' title='Remove' onClick={(): void => removeTag(tag.tagNo)}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    }
                </Collapse>
                {
                    isExpanded && (
                        <Expand>
                            <ExpandSection>
                                <ExpandHeader>Tag description</ExpandHeader>
                                <div>{tag.description}</div>
                            </ExpandSection>
                            { !creatingNewTag &&
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
                <h1>Selected {creatingNewTag ? 'tag' : 'tags'}</h1>
            </Header>
            { !creatingNewTag &&
                <div>
                    {selectedTags.length} tag(s) selected
                </div>
            }
            <TagList>
                {
                    selectedTags.map(tag => createTagSection(tag))
                }
            </TagList>
        </div>
    );
};

export default TagDetails;
