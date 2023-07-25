import React from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { ANTD_GRAY } from '../../entity/shared/constants';
import { useEntityRegistry } from '../../useEntityRegistry';
import { IconStyleType } from '../../entity/Entity';
import { formatNumber } from '../../shared/formatNumber';
import ExpandableNode from './ExpandableNode';
import EnvironmentNode from './EnvironmentNode';
import useAggregationsQuery from './useAggregationsQuery';
import { ORIGIN_FILTER_NAME, PLATFORM_FILTER_NAME } from '../utils/constants';
import PlatformNode from './PlatformNode';
import SidebarLoadingError from './SidebarLoadingError';
import useToggle from '../../shared/useToggle';
import { BrowseProvider, useEntityAggregation, useEntityType, useIsEntitySelected } from './BrowseContext';
import useSidebarAnalytics from './useSidebarAnalytics';
import { useHasFilterField } from './SidebarContext';

const Count = styled(Typography.Text)`
    font-size: 12px;
    color: ${(props) => props.color};
    padding-left: 4px;
`;

const EntityNode = () => {
    const isSelected = useIsEntitySelected();
    const entityType = useEntityType();
    const entityAggregation = useEntityAggregation();
    const hasEnvironmentFilter = useHasFilterField(ORIGIN_FILTER_NAME);
    const { count } = entityAggregation;
    const registry = useEntityRegistry();
    const { t } = useTranslation([]);
    const { trackToggleNodeEvent } = useSidebarAnalytics();

    const { isOpen, isClosing, toggle } = useToggle({
        initialValue: isSelected,
        closeDelay: 250,
        onToggle: (isNowOpen: boolean) => trackToggleNodeEvent(isNowOpen, 'entity'),
    });

    const onClickHeader = () => {
        if (count) toggle();
    };

    const { loaded, error, environmentAggregations, platformAggregations } = useAggregationsQuery({
        skip: !isOpen,
        facets: [ORIGIN_FILTER_NAME, PLATFORM_FILTER_NAME],
    });

    const showEnvironments =
        environmentAggregations &&
        (environmentAggregations.length > 1 || (hasEnvironmentFilter && !!environmentAggregations.length));
    const color = count > 0 ? '#000' : ANTD_GRAY[8];

    return (
        <ExpandableNode
            isOpen={isOpen && !isClosing && loaded}
            header={
                <ExpandableNode.Header
                    isOpen={isOpen}
                    showBorder
                    onClick={onClickHeader}
                    style={{ paddingTop: '16px' }}
                    data-testid={`browse-entity-${registry.getCollectionNameTrans(entityType, t)}`}
                >
                    <ExpandableNode.HeaderLeft>
                        {registry.getIcon(entityType, 16, IconStyleType.HIGHLIGHT, color)}
                        <ExpandableNode.Title color={color} size={16} padLeft>
                            {registry.getCollectionNameTrans(entityType, t)}
                        </ExpandableNode.Title>
                        <Count color={color}>{formatNumber(entityAggregation.count)}</Count>
                    </ExpandableNode.HeaderLeft>
                    <ExpandableNode.CircleButton isOpen={isOpen && !isClosing} color={color} />
                </ExpandableNode.Header>
            }
            body={
                <ExpandableNode.Body>
                    {showEnvironments
                        ? environmentAggregations?.map((environmentAggregation) => (
                              <BrowseProvider
                                  key={environmentAggregation.value}
                                  entityAggregation={entityAggregation}
                                  environmentAggregation={environmentAggregation}
                              >
                                  <EnvironmentNode />
                              </BrowseProvider>
                          ))
                        : platformAggregations?.map((platformAggregation) => (
                              <BrowseProvider
                                  key={platformAggregation.value}
                                  entityAggregation={entityAggregation}
                                  platformAggregation={platformAggregation}
                              >
                                  <PlatformNode />
                              </BrowseProvider>
                          ))}
                    {error && <SidebarLoadingError />}
                </ExpandableNode.Body>
            }
        />
    );
};

export default EntityNode;
