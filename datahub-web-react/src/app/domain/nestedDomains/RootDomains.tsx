import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Message } from '../../shared/Message';
import { ResultWrapper } from '../../search/SearchResultList';
import { useEntityRegistry } from '../../useEntityRegistry';
import { EntityType } from '../../../types.generated';
import useListDomains from '../useListDomains';

const DomainsWrapper = styled.div`
    overflow: auto;
    padding: 0 28px 16px 28px;
`;

export default function RootDomains() {
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const { loading, error, data, sortedDomains } = useListDomains({});

    return (
        <>
            {!data && loading && <Message type="loading" content={t('common.loading')} />}
            {error && <Message type="error" content={t('crud.error.loadWithName', { name: t('common.domains') })} />}
            <DomainsWrapper>
                {sortedDomains?.map((domain) => (
                    <ResultWrapper showUpdatedStyles>
                        {entityRegistry.renderSearchResult(EntityType.Domain, { entity: domain, matchedFields: [] })}
                    </ResultWrapper>
                ))}
            </DomainsWrapper>
        </>
    );
}
