import React from 'react';
import { FolderOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { EntityType, Owner, ParentNodesResult } from '../../../../types.generated';
import DefaultPreviewCard from '../../../preview/DefaultPreviewCard';
import { useEntityRegistry } from '../../../useEntityRegistry';

export const Preview = ({
    urn,
    name,
    description,
    owners,
    parentNodes,
}: {
    urn: string;
    name: string;
    description?: string | null;
    owners?: Array<Owner> | null;
    parentNodes?: ParentNodesResult | null;
}): JSX.Element => {
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    return (
        <DefaultPreviewCard
            url={entityRegistry.getEntityUrl(EntityType.GlossaryNode, urn)}
            name={name || ''}
            urn={urn}
            description={description || ''}
            owners={owners}
            logoComponent={<FolderOutlined style={{ fontSize: '20px' }} />}
            type={entityRegistry.getEntityNameTrans(EntityType.GlossaryNode, t)}
            parentNodes={parentNodes}
        />
    );
};
