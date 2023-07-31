import React, { useState } from 'react';
import { Form, Input, Modal, Typography } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { useCommands } from '@remirror/react';
import { CommandButton } from './CommandButton';
import { useTranslation } from 'react-i18next';

export const AddImageButton = () => {
    const { t } = useTranslation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { insertImage } = useCommands();

    const handleButtonClick = () => {
        setModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                form.resetFields();
                setModalVisible(false);
                insertImage(values);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <>
            <CommandButton
                active={false}
                icon={<PictureOutlined />}
                commandName="insertImage"
                onClick={handleButtonClick}
            />
            <Modal title={t('crud.addWithName', {name: t('common.image')})} visible={isModalVisible} okText={t('common.save')} cancelText={t('common.cancel')} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical" colon={false} requiredMark={false}>
                    <Form.Item
                        name="src"
                        label={<Typography.Text strong>{t('common.image')} URL</Typography.Text>}
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="http://www.example.com/image.jpg" autoFocus />
                    </Form.Item>
                    <Form.Item name="alt" label={<Typography.Text strong>{t('form.altText')}</Typography.Text>}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
