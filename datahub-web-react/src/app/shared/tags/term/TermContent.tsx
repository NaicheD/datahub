import { BookOutlined } from '@ant-design/icons';
import { message, Modal, Tag } from 'antd';
import React from 'react';
import styled from 'styled-components';
import Highlight from 'react-highlighter';
import { useRemoveTermMutation } from '../../../../graphql/mutations.generated';
import { EntityType, GlossaryTermAssociation, SubResourceType } from '../../../../types.generated';
import { useEntityRegistry } from '../../../useEntityRegistry';
import {useTranslation} from 'react-i18next';

const highlightMatchStyle = { background: '#ffe58f', padding: '0' };

const StyledTag = styled(Tag)<{ fontSize?: number }>`
    ${(props) => props.fontSize && `font-size: ${props.fontSize}px;`}
`;

interface Props {
    term: GlossaryTermAssociation;
    entityUrn?: string;
    entitySubresource?: string;
    canRemove?: boolean;
    readOnly?: boolean;
    highlightText?: string;
    fontSize?: number;
    onOpenModal?: () => void;
    refetch?: () => Promise<any>;
}

export default function TermContent({
    term,
    entityUrn,
    entitySubresource,
    canRemove,
    readOnly,
    highlightText,
    fontSize,
    onOpenModal,
    refetch,
}: Props) {
    const {t} = useTranslation('translation');
    const entityRegistry = useEntityRegistry();
    const [removeTermMutation] = useRemoveTermMutation();

    const removeTerm = (termToRemove: GlossaryTermAssociation) => {
        onOpenModal?.();
        const termName = termToRemove && entityRegistry.getDisplayName(termToRemove.term.type, termToRemove.term);
        Modal.confirm({
            title: t('tagTerm.tagTermModal.removeTerm.title', { termName: termName }),
            content: t('tagTerm.tagTermModal.removeTerm.content', { termName: termName }),
            onOk() {
                if (termToRemove.associatedUrn || entityUrn) {
                    removeTermMutation({
                        variables: {
                            input: {
                                termUrn: termToRemove.term.urn,
                                resourceUrn: termToRemove.associatedUrn || entityUrn || '',
                                subResource: entitySubresource,
                                subResourceType: entitySubresource ? SubResourceType.DatasetField : null,
                            },
                        },
                    })
                        .then(({ errors }) => {
                            if (!errors) {
                                message.success({ content: t('tagTerm.tagTermModal.removeTerm.success'), duration: 2 });
                            }
                        })
                        .then(refetch)
                        .catch((e) => {
                            message.destroy();
                            message.error({ content: `${t('tagTerm.tagTermModal.removeTerm.error')}: \n ${e.message || ''}`, duration: 3 });
                        });
                }
            },
            onCancel() {},
            okText: t('common.yes'),
            maskClosable: true,
            closable: true,
        });
    };

    return (
        <StyledTag
            style={{ cursor: 'pointer' }}
            closable={canRemove && !readOnly}
            onClose={(e) => {
                e.preventDefault();
                removeTerm(term);
            }}
            fontSize={fontSize}
        >
            <BookOutlined style={{ marginRight: '4px' }} />
            <Highlight style={{ marginLeft: 0 }} matchStyle={highlightMatchStyle} search={highlightText}>
                {entityRegistry.getDisplayName(EntityType.GlossaryTerm, term.term)}
            </Highlight>
        </StyledTag>
    );
}
