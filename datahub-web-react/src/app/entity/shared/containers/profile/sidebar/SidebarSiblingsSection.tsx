import React from 'react';
import styled from 'styled-components';

import { useTranslation } from 'react-i18next';
import { useDataNotCombinedWithSiblings, useEntityData } from '../../../EntityContext';
import { SidebarHeader } from './SidebarHeader';
import { CompactEntityNameList } from '../../../../../recommendations/renderer/component/CompactEntityNameList';
import { Entity } from '../../../../../../types.generated';
import { SEPARATE_SIBLINGS_URL_PARAM, stripSiblingsFromEntity, useIsSeparateSiblingsMode } from '../../../siblingUtils';
import { GetDatasetQuery } from '../../../../../../graphql/dataset.generated';

const EntityListContainer = styled.div`
    margin-left: -8px;
`;

export const SidebarSiblingsSection = () => {
    const { entityData } = useEntityData();
    const { t } = useTranslation();
    const dataNotCombinedWithSiblings = useDataNotCombinedWithSiblings<GetDatasetQuery>();

    const isHideSiblingMode = useIsSeparateSiblingsMode();

    if (!entityData) {
        return <></>;
    }

    if (isHideSiblingMode) {
        return (
            <div>
                <SidebarHeader title={t('common.partOf')} />
                <EntityListContainer>
                    <CompactEntityNameList entities={[entityData as Entity]} showTooltips />
                </EntityListContainer>
            </div>
        );
    }

    const siblingEntities = entityData?.siblings?.siblings || [];
    const entityDataWithoutSiblings = stripSiblingsFromEntity(dataNotCombinedWithSiblings.dataset);

    const allSiblingsInGroup = [...siblingEntities, entityDataWithoutSiblings] as Entity[];

    return (
        <div>
            <SidebarHeader title={t('common.composedOf')} />
            <EntityListContainer>
                <CompactEntityNameList
                    entities={allSiblingsInGroup}
                    linkUrlParams={{ [SEPARATE_SIBLINGS_URL_PARAM]: true }}
                    showTooltips
                />
            </EntityListContainer>
        </div>
    );
};
