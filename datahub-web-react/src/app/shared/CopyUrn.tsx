import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';
import {useTranslation} from 'react-i18next';

interface CopyUrnProps {
    urn: string;
    isActive: boolean;
    onClick: () => void;
}

export default function CopyUrn({ urn, isActive, onClick }: CopyUrnProps) {
    const {t} = useTranslation('translation');
    if (navigator.clipboard) {
        return (
            <Tooltip title={t('entityPage.copyUrnTitle')}>
                <Button
                    icon={isActive ? <CheckOutlined /> : <CopyOutlined />}
                    onClick={() => {
                        navigator.clipboard.writeText(urn);
                        onClick();
                    }}
                />
            </Tooltip>
        );
    }

    return null;
}
