import React from 'react';
import { Dropdown, MenuProps, Popconfirm, Typography, message, notification } from 'antd';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { OwnershipTypeEntity } from '../../../../types.generated';
import { useDeleteOwnershipTypeMutation } from '../../../../graphql/ownership.generated';

const DROPDOWN_TEST_ID = 'ownership-table-dropdown';
const EDIT_OWNERSHIP_TYPE_TEST_ID = 'edit-ownership-type';
const DELETE_OWNERSHIP_TYPE_TEST_ID = 'delete-ownership-type';

const StyledDropdown = styled(Dropdown)``;

const MenuButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MenuButtonText = styled(Typography.Text)`
    font-size: 14px;
    font-weight: 400;
    margin-left: 8px;
`;

const StyledMoreOutlined = styled(MoreOutlined)`
    width: 20px;
    &&& {
        padding-left: 0;
        padding-right: 0;
        font-size: 18px;
    }
    :hover {
        cursor: pointer;
    }
`;

type Props = {
    ownershipType: OwnershipTypeEntity;
    setIsOpen: (isOpen: boolean) => void;
    setOwnershipType: (ownershipType: OwnershipTypeEntity) => void;
    refetch: () => void;
};

export const ActionsColumn = ({ ownershipType, setIsOpen, setOwnershipType, refetch }: Props) => {
    const { t } = useTranslation();
    const editOnClick = () => {
        setIsOpen(true);
        setOwnershipType(ownershipType);
    };

    const [deleteOwnershipTypeMutation] = useDeleteOwnershipTypeMutation();

    const onDelete = () => {
        deleteOwnershipTypeMutation({
            variables: {
                urn: ownershipType.urn,
            },
        })
            .then(() => {
                notification.success({
                    message: t('common.success'),
                    description: t('crud.success.deleteWithName', { name: t('settings.ownershipType').toLowerCase() }),
                    placement: 'bottomLeft',
                    duration: 3,
                });
                setTimeout(() => {
                    refetch();
                }, 3000);
            })
            .catch((e: unknown) => {
                message.destroy();
                if (e instanceof Error) {
                    message.error({
                        content: t('crud.error.deleteWithName', { name: t('settings.ownershipType').toLowerCase() }),
                        duration: 3,
                    });
                }
            });
    };

    const items: MenuProps['items'] = [
        {
            key: 'edit',
            icon: (
                <MenuButtonContainer data-testid={EDIT_OWNERSHIP_TYPE_TEST_ID}>
                    <EditOutlined />
                    <MenuButtonText>{t('common.edit')}</MenuButtonText>
                </MenuButtonContainer>
            ),
        },
        {
            key: 'delete',
            icon: (
                <Popconfirm
                    title={<Typography.Text>{t('crud.doYouWantTo.confirmDeleteOwnershipType')}</Typography.Text>}
                    placement="left"
                    onCancel={() => {}}
                    onConfirm={onDelete}
                    okText={t('common.yes')}
                    cancelText={t('common.no')}
                >
                    <MenuButtonContainer data-testid={DELETE_OWNERSHIP_TYPE_TEST_ID}>
                        <DeleteOutlined />
                        <MenuButtonText>{t('crud.delete')}</MenuButtonText>
                    </MenuButtonContainer>
                </Popconfirm>
            ),
        },
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        const key = e.key as string;
        if (key === 'edit') {
            editOnClick();
        }
    };

    const menuProps: MenuProps = {
        items,
        onClick,
    };

    return (
        <StyledDropdown menu={menuProps}>
            <StyledMoreOutlined date-testid={DROPDOWN_TEST_ID} style={{ display: undefined }} />
        </StyledDropdown>
    );
};
