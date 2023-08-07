import React from 'react';
import { Switch, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components/macro';

import { useTranslation } from 'react-i18next';
import { ANTD_GRAY } from '../../entity/shared/constants';
import { navigateToLineageUrl } from '../utils/navigateToLineageUrl';
import { useIsSeparateSiblingsMode } from '../../entity/shared/siblingUtils';
import { useIsShowColumnsMode } from '../utils/useIsShowColumnsMode';

const ControlDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const ControlsSwitch = styled(Switch)`
    margin-right: 8px;
`;

const ControlLabel = styled.span`
    vertical-align: sub;
`;

const HelpIcon = styled(QuestionCircleOutlined)`
    color: ${ANTD_GRAY[7]};
    padding-left: 4px;
`;

type Props = {
    showExpandedTitles: boolean;
    setShowExpandedTitles: (showExpandedTitles: boolean) => void;
};

export function LineageVizToggles({ showExpandedTitles, setShowExpandedTitles }: Props) {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const isHideSiblingMode = useIsSeparateSiblingsMode();
    const showColumns = useIsShowColumnsMode();

    return (
        <>
            <ControlDiv>
                <ControlsSwitch
                    data-test-id="expand-titles-toggle"
                    checked={showExpandedTitles}
                    onChange={(checked) => setShowExpandedTitles(checked)}
                />{' '}
                <ControlLabel>
                    <b>{t('lineage.showFullTitle')}</b>
                </ControlLabel>
            </ControlDiv>
            <ControlDiv>
                <ControlsSwitch
                    data-testid="compress-lineage-toggle"
                    checked={!isHideSiblingMode}
                    onChange={(checked) => {
                        navigateToLineageUrl({
                            location,
                            history,
                            isLineageMode: true,
                            isHideSiblingMode: !checked,
                        });
                    }}
                />{' '}
                <ControlLabel>
                    <b>{t('lineage.compressLineage')}</b>
                    <Tooltip title={t('lineage.collapseRelatedEntitiesIntoASingleLineageNode')} placement="topRight">
                        <HelpIcon />
                    </Tooltip>
                </ControlLabel>
            </ControlDiv>
            <ControlDiv>
                <ControlsSwitch
                    data-testid="column-toggle"
                    checked={showColumns}
                    onChange={(checked) => {
                        navigateToLineageUrl({
                            location,
                            history,
                            isLineageMode: true,
                            isHideSiblingMode,
                            showColumns: checked,
                        });
                    }}
                />{' '}
                <ControlLabel>
                    <b>{t('showColumns')}</b>
                </ControlLabel>
            </ControlDiv>
        </>
    );
}
