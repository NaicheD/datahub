import { Alert } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import useListDomains from '../../useListDomains';
import DomainNode from './DomainNode';
import { Domain } from '../../../../types.generated';

const NavigatorWrapper = styled.div`
    font-size: 14px;
    max-height: calc(100% - 65px);
    padding: 8px 8px 16px 16px;
    overflow: auto;
`;

interface Props {
    domainUrnToHide?: string;
    selectDomainOverride?: (domain: Domain) => void;
}

export default function DomainNavigator({ domainUrnToHide, selectDomainOverride }: Props) {
    const { t } = useTranslation();
    const { sortedDomains, error } = useListDomains({});

    return (
        <NavigatorWrapper>
            {error && <Alert message={t('crud.error.loadWithName', { name: t('common.domains') })} showIcon type="error" />}
            {sortedDomains?.map((domain) => (
                <DomainNode
                    key={domain.urn}
                    domain={domain as Domain}
                    numDomainChildren={domain.children?.total || 0}
                    domainUrnToHide={domainUrnToHide}
                    selectDomainOverride={selectDomainOverride}
                />
            ))}
        </NavigatorWrapper>
    );
}
