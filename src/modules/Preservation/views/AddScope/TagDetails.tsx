import React, { useState } from 'react';

import { Tag } from './types';
import { Container, Header, TagList, TagContainer, Collapse, CollapseInfo, Expand, ExpandHeader, ExpandSection, ExpandButton, DeleteButton } from './TagDetails.style';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

interface TagDetailsProps {
    selectedTags: Tag[];
    removeTag: (tagNo: string) => void;
}

const TagDetails = ({
    selectedTags,
    removeTag
}: TagDetailsProps): JSX.Element => {

    const [expandedTagNo, setExpandedTagNo] = useState();

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
                    <ExpandButton onClick={(): void => toggleDetails(tag.tagNo)}>
                        {                        
                            isExpanded
                                ? <KeyboardArrowUpIcon style={{ padding: '16px'}} />
                                : <KeyboardArrowDownIcon style={{ padding: '16px' }} />
                        }
                    </ExpandButton>
                    <CollapseInfo>
                        {tag.tagNo} - {tag.description}
                    </CollapseInfo>
                    <DeleteButton>
                        <DeleteOutlineIcon style={{ padding: '16px'}} onClick={(): void => removeTag(tag.tagNo)} />
                    </DeleteButton>                    
                </Collapse>
                {
                    isExpanded && (
                        <Expand>
                            <ExpandSection>
                                <ExpandHeader>Tag description</ExpandHeader>
                                <div>{tag.description}</div>
                            </ExpandSection>
                            <ExpandSection>
                                <ExpandHeader>MC pkg</ExpandHeader>
                                <div>{tag.mcPkgNo}</div>
                            </ExpandSection>
                        </Expand>
                    )
                }
            </TagContainer>
        );
    };

    return (
        <Container>
            <Header>
                <h1>Selected tags</h1>
            </Header>
            <div>
                {selectedTags.length} tags selected
            </div>
            <TagList>
                {
                    selectedTags.map((tag) => {
                        return createTagSection(tag);
                    })
                }
            </TagList>
        </Container>
    );
};

export default TagDetails;