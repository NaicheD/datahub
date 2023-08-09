import { DeliveredProcedureOutlined } from '@ant-design/icons';
import { Pagination, Table, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import { Trans, useTranslation } from 'react-i18next';
import { useGetDataJobRunsQuery } from '../../../../graphql/dataJob.generated';
import { DataProcessInstanceRunResultType, DataProcessRunStatus } from '../../../../types.generated';
import {
    getExecutionRequestStatusDisplayColor,
    getExecutionRequestStatusDisplayText,
    getExecutionRequestStatusIcon,
} from '../../../ingest/source/utils';
import { CompactEntityNameList } from '../../../recommendations/renderer/component/CompactEntityNameList';
import { ANTD_GRAY } from '../../shared/constants';
import { useEntityData } from '../../shared/EntityContext';
import { ReactComponent as LoadingSvg } from '../../../../images/datahub-logo-color-loading_pendulum.svg';
import { scrollToTop } from '../../../shared/searchUtils';

const ExternalUrlLink = styled.a`
    font-size: 16px;
    color: ${ANTD_GRAY[8]};
`;

const PaginationControlContainer = styled.div`
    padding-top: 16px;
    padding-bottom: 16px;
    text-align: center;
`;

const LoadingText = styled.div`
    margin-top: 18px;
    font-size: 12px;
`;

const LoadingContainer = styled.div`
    padding-top: 40px;
    padding-bottom: 40px;
    width: 100%;
    text-align: center;
`;

function getStatusForStyling(status: DataProcessRunStatus, resultType: DataProcessInstanceRunResultType) {
    if (status === 'COMPLETE') {
        if (resultType === 'SKIPPED') {
            return 'CANCELLED';
        }
        return resultType;
    }
    return 'RUNNING';
}

const PAGE_SIZE = 20;

export const RunsTab = () => {
    const { t } = useTranslation();
    const { urn } = useEntityData();
    const [page, setPage] = useState(1);

    const { loading, data } = useGetDataJobRunsQuery({
        variables: { urn, start: (page - 1) * PAGE_SIZE, count: PAGE_SIZE },
    });
    const runs = data && data?.dataJob?.runs?.runs;

    const columns = [
        {
            title: t('common.time'),
            dataIndex: 'time',
            key: 'time',
            render: (value) => (
                <Tooltip title={new Date(Number(value)).toUTCString()}>
                    {new Date(Number(value)).toLocaleString()}
                </Tooltip>
            ),
        },
        {
            title: t('operation.runId'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('common.status'),
            dataIndex: 'status',
            key: 'status',
            render: (status: any, row) => {
                const statusForStyling = getStatusForStyling(status, row?.resultType);
                const Icon = getExecutionRequestStatusIcon(statusForStyling);
                const text = getExecutionRequestStatusDisplayText(statusForStyling);
                const color = getExecutionRequestStatusDisplayColor(statusForStyling);
                return (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                            {Icon && <Icon style={{ color }} />}
                            <Typography.Text strong style={{ color, marginLeft: 8 }}>
                                {<Trans i18nKey={text} /> || 'N/A'}
                            </Typography.Text>
                        </div>
                    </>
                );
            },
        },
        {
            title: t('common.inputs'),
            dataIndex: 'inputs',
            key: 'inputs',
            render: (inputs) => <CompactEntityNameList entities={inputs} />,
        },
        {
            title: t('common.outputs'),
            dataIndex: 'outputs',
            key: 'outputs',
            render: (outputs) => <CompactEntityNameList entities={outputs} />,
        },
        {
            title: '',
            dataIndex: 'externalUrl',
            key: 'externalUrl',
            render: (externalUrl) =>
                externalUrl && (
                    <Tooltip title="View task run details">
                        <ExternalUrlLink href={externalUrl}>
                            <DeliveredProcedureOutlined />
                        </ExternalUrlLink>
                    </Tooltip>
                ),
        },
    ];

    const tableData = runs
        ?.filter((run) => run)
        .map((run) => ({
            time: run?.created?.time,
            name: run?.name,
            status: run?.state?.[0]?.status,
            resultType: run?.state?.[0]?.result?.resultType,
            inputs: run?.inputs?.relationships.map((relationship) => relationship.entity),
            outputs: run?.outputs?.relationships.map((relationship) => relationship.entity),
            externalUrl: run?.externalUrl,
        }));
    if (loading) {
        return (
            <LoadingContainer>
                <LoadingSvg height={80} width={80} />
                <LoadingText>{t('operation.fetchingRuns')}...</LoadingText>
            </LoadingContainer>
        );
    }

    const onChangePage = (newPage: number) => {
        scrollToTop();
        setPage(newPage);
    };

    return (
        <>
            <Table dataSource={tableData} columns={columns} pagination={false} />
            <PaginationControlContainer>
                <Pagination
                    current={page}
                    pageSize={PAGE_SIZE}
                    total={data?.dataJob?.runs?.total || 0}
                    showLessItems
                    onChange={onChangePage}
                    showSizeChanger={false}
                />
            </PaginationControlContainer>
        </>
    );
};
