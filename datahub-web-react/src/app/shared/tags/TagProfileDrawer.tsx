import React from 'react';
import { Drawer, Button, Space } from 'antd';
import styled from 'styled-components';
import { InfoCircleOutlined } from '@ant-design/icons';

import TagStyleEntity from '../TagStyleEntity';
import { useEntityRegistry } from '../../useEntityRegistry';
import { EntityType } from '../../../types.generated';
import {useTranslation} from 'react-i18next';

type Props = {
    closeTagProfileDrawer?: () => void;
    tagProfileDrawerVisible?: boolean;
    urn: string;
};

const DetailsLayout = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const TagProfileDrawer = ({ closeTagProfileDrawer, tagProfileDrawerVisible, urn }: Props) => {
    const {t} = useTranslation('translation');
    const entityRegistry = useEntityRegistry();
    return (
        <>
            <Drawer
                width={500}
                placement="right"
                closable={false}
                onClose={closeTagProfileDrawer}
                visible={tagProfileDrawerVisible}
                footer={
                    <DetailsLayout>
                        <Space>
                            <Button type="text" onClick={closeTagProfileDrawer}>
                                {t('common.close')}
                            </Button>
                        </Space>
                        <Space>
                            <Button href={entityRegistry.getEntityUrl(EntityType.Tag, urn)}>
                                <InfoCircleOutlined /> {t('tagTerm.tadDetails')}
                            </Button>
                        </Space>
                    </DetailsLayout>
                }
            >
                <>
                    <TagStyleEntity urn={urn} />
                </>
            </Drawer>
        </>
    );
};
