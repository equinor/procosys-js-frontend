import React from 'react';
import Highlighter from 'react-highlight-words';
import { ContentDocument } from './http/QuickSearchApiClient';
import CommPkgIcon from './icons/commPkg';
import MCPkgIcon from './icons/mcPkg';
import PunchIcon from './icons/punch';
import TagIcon from './icons/tag';
import {
    QuickSearchResultItem,
    SearchResultItemPart,
    SearchResultType,
    TypeIndicator,
} from './style';

interface QuickSearchPreviewHitProps {
    item: ContentDocument;
    searchValue: string;
    hitNumber: number;
}

const QuickSearchPreviewHit = (
    props: QuickSearchPreviewHitProps
): JSX.Element => {
    const KEYCODE_ENTER = 13;

    const highlightSearchValue = (text: string): JSX.Element => {
        text = text.replaceAll('"', '');

        return (
            <Highlighter
                searchWords={props.searchValue.replaceAll('"', '').split(' ')}
                autoEscape={true}
                textToHighlight={text}
            />
        );
    };

    const getTypeIcon = (type: string): JSX.Element => {
        switch (type) {
            case 'C':
                return <CommPkgIcon />;
            case 'MC':
                return <MCPkgIcon />;
            case 'T':
                return <TagIcon />;
            case 'PI':
                return <PunchIcon />;
            default:
                return (
                    <TypeIndicator>
                        <span>{type}</span>
                    </TypeIndicator>
                );
        }
    };

    const getNumber = (): JSX.Element => {
        const pkgNo = props.item.commPkg
            ? (props.item.commPkg.commPkgNo ?? '')
            : props.item.mcPkg
              ? (props.item.mcPkg.mcPkgNo ?? '')
              : props.item.tag
                ? (props.item.tag.tagNo ?? '')
                : props.item.punchItem
                  ? (props.item.punchItem.punchItemNo ?? '')
                  : '';

        return highlightSearchValue(pkgNo);
    };

    const getDescription = (): JSX.Element => {
        return highlightSearchValue(
            props.item.commPkg
                ? (props.item.commPkg.description ?? '')
                : props.item.mcPkg
                  ? (props.item.mcPkg.description ?? '')
                  : props.item.tag
                    ? (props.item.tag.description ?? '')
                    : props.item.punchItem
                      ? (props.item.punchItem.description ?? '')
                      : ''
        );
    };

    const getItemProject = (item: ContentDocument): string => {
        return encodeURIComponent(item.project?.toLocaleUpperCase() ?? '');
    };

    const navigateToItem = (item: ContentDocument): void => {
        let url =
            location.origin + '/' + item.plant?.replace('PCS$', '') + '/link';

        if (item.commPkg) {
            url +=
                '/CommPkg?commPkgNo=' +
                encodeURIComponent(item.commPkg.commPkgNo ?? '') +
                '&project=' +
                getItemProject(item);
        }

        if (item.mcPkg) {
            url +=
                '/MCPkg?mcPkgNo=' +
                encodeURIComponent(item.mcPkg.mcPkgNo ?? '') +
                '&project=' +
                getItemProject(item);
        }

        if (item.tag) {
            url +=
                '/Tag?tagNo=' +
                encodeURIComponent(item.tag.tagNo ?? '') +
                '&project=' +
                getItemProject(item);
        }

        if (item.punchItem) {
            url +=
                '/PunchListItem?punchListItemNo=' +
                encodeURIComponent(item.punchItem.punchItemNo ?? '');
        }

        window.location.href = url;
    };

    return (
        <QuickSearchResultItem
            tabIndex={props.hitNumber}
            id={'hit_' + props.hitNumber}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                e.keyCode === KEYCODE_ENTER && navigateToItem(props.item);
            }}
            onClick={(): void => navigateToItem(props.item)}
        >
            <SearchResultType>
                {getTypeIcon(props.item.type ?? '')}
            </SearchResultType>
            <SearchResultItemPart group="navigation" variant="menu_title">
                {getNumber()}
            </SearchResultItemPart>
            <SearchResultItemPart
                group="navigation"
                variant="menu_title"
                lines={3}
            >
                {getDescription()}
            </SearchResultItemPart>
        </QuickSearchResultItem>
    );
};

export default QuickSearchPreviewHit;
