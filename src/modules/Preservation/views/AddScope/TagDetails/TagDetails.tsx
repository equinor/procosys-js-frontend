import React, { useState } from 'react';

import { Tag } from '../types';
import { Header, TagList, TagContainer, Collapse, CollapseInfo, Expand, ExpandHeader, ExpandSection } from './TagDetails.style';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

interface TagDetailsProps {
    selectedTags: Tag[];
    removeTag?: (tagNo: string) => void;
    creatingNewTag?: boolean;
}

const TagDetails = ({
    selectedTags,
    removeTag,
    creatingNewTag = false
}: TagDetailsProps): JSX.Element => {

    const [expandedTagNo, setExpandedTagNo] = useState<string | null>();
    const [defaultExpanded, setDefaultExpanded] = useState<boolean>(() => {
        if (creatingNewTag) {
            return true;
        } else {
            return false;
        }
    });

    const toggleDetails = (tagNo: string): void => {
        if (creatingNewTag) {
            setDefaultExpanded(defaultExpanded ? false : true);
        } else {
            if (tagNo === expandedTagNo) {
                setExpandedTagNo(null);
            } else {
                setExpandedTagNo(tagNo);
            }
        }
    };

    const createTagSection = (tag: Tag): JSX.Element => {
        const isExpanded = tag.tagNo === expandedTagNo;

        return (
            <TagContainer key={tag.tagNo}>
                <Collapse>
                    <IconButton size='small' onClick={(): void => toggleDetails(tag.tagNo)}>
                        {
                            isExpanded || defaultExpanded
                                ? <KeyboardArrowUpIcon />
                                : <KeyboardArrowDownIcon />
                        }
                    </IconButton>
                    <CollapseInfo>
                        {tag.tagNo}
                    </CollapseInfo>
                    { removeTag &&
                        <IconButton size='small' title='Remove' onClick={(): void => removeTag(tag.tagNo)}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    }
                </Collapse>
                {
                    (isExpanded || defaultExpanded) && (
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
                <h1>Selected tag(s)</h1>
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
