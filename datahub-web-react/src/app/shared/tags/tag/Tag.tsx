import { message, Modal } from 'antd';
import styled from 'styled-components';
import React, { useState } from 'react';
import Highlight from 'react-highlighter';
import { useRemoveTagMutation } from '../../../../graphql/mutations.generated';
import { EntityType, SubResourceType, TagAssociation } from '../../../../types.generated';
import { StyledTag } from '../../../entity/shared/components/styled/StyledTag';
import { HoverEntityTooltip } from '../../../recommendations/renderer/component/HoverEntityTooltip';
import { useEntityRegistry } from '../../../useEntityRegistry';
import { TagProfileDrawer } from '../TagProfileDrawer';
import {useTranslation} from 'react-i18next';

const TagLink = styled.span`
    display: inline-block;
    margin-bottom: 8px;
`;

const highlightMatchStyle = { background: '#ffe58f', padding: '0' };

interface Props {
    tag: TagAssociation;
    entityUrn?: string;
    entitySubresource?: string;
    canRemove?: boolean;
    readOnly?: boolean;
    highlightText?: string;
    onOpenModal?: () => void;
    refetch?: () => Promise<any>;
    fontSize?: number;
}

export default function Tag({
    tag,
    entityUrn,
    entitySubresource,
    canRemove,
    readOnly,
    highlightText,
    onOpenModal,
    refetch,
    fontSize,
}: Props) {
    const {t} = useTranslation('translation');
    const entityRegistry = useEntityRegistry();
    const [removeTagMutation] = useRemoveTagMutation();

    const [tagProfileDrawerVisible, setTagProfileDrawerVisible] = useState(false);
    const [addTagUrn, setAddTagUrn] = useState('');

    const showTagProfileDrawer = (urn: string) => {
        if (!readOnly) {
            setTagProfileDrawerVisible(true);
            setAddTagUrn(urn);
        }
    };

    const closeTagProfileDrawer = () => {
        setTagProfileDrawerVisible(false);
    };

    const removeTag = (tagAssociationToRemove: TagAssociation) => {
        const tagToRemove = tagAssociationToRemove.tag;
        onOpenModal?.();
        Modal.confirm({
            title: t('tagTerm.tagTermModal.removeTag', { tagName: tagToRemove?.name }),
            content: t('tagTerm.tagTermModal.content', { tagName: tagToRemove?.name }),
            onOk() {
                if (tagAssociationToRemove.associatedUrn || entityUrn) {
                    removeTagMutation({
                        variables: {
                            input: {
                                tagUrn: tagToRemove.urn,
                                resourceUrn: tagAssociationToRemove.associatedUrn || entityUrn || '',
                                subResource: entitySubresource,
                                subResourceType: entitySubresource ? SubResourceType.DatasetField : null,
                            },
                        },
                    })
                        .then(({ errors }) => {
                            if (!errors) {
                                message.success({ content: t('tagTerm.tagTermModal.success'), duration: 2 });
                            }
                        })
                        .then(refetch)
                        .catch((e) => {
                            message.destroy();
                            message.error({ content: `${t('tagTerm.tagTermModal.error')}: \n ${e.message || ''}`, duration: 3 });
                        });
                }
            },
            onCancel() {},
            okText: t('common.yes'),
            maskClosable: true,
            closable: true,
        });
    };

    const displayName = entityRegistry.getDisplayName(EntityType.Tag, tag.tag);

    return (
        <>
            <HoverEntityTooltip entity={tag.tag}>
                <TagLink data-testid={`tag-${displayName}`}>
                    <StyledTag
                        style={{ cursor: 'pointer' }}
                        onClick={() => showTagProfileDrawer(tag?.tag?.urn)}
                        $colorHash={tag?.tag?.urn}
                        $color={tag?.tag?.properties?.colorHex}
                        closable={canRemove && !readOnly}
                        onClose={(e) => {
                            e.preventDefault();
                            removeTag(tag);
                        }}
                        fontSize={fontSize}
                    >
                        <Highlight
                            style={{ marginLeft: 0, fontSize }}
                            matchStyle={highlightMatchStyle}
                            search={highlightText}
                        >
                            {displayName}
                        </Highlight>
                    </StyledTag>
                </TagLink>
            </HoverEntityTooltip>
            {tagProfileDrawerVisible && (
                <TagProfileDrawer
                    closeTagProfileDrawer={closeTagProfileDrawer}
                    tagProfileDrawerVisible={tagProfileDrawerVisible}
                    urn={addTagUrn}
                />
            )}
        </>
    );
}
