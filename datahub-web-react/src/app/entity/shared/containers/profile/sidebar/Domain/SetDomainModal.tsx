import React, { useRef, useState } from 'react';
import { Button, Form, message, Modal, Select } from 'antd';

import { useTranslation } from 'react-i18next';
import { useGetSearchResultsLazyQuery } from '../../../../../../../graphql/search.generated';
import { Domain, Entity, EntityType } from '../../../../../../../types.generated';
import { useBatchSetDomainMutation } from '../../../../../../../graphql/mutations.generated';
import { useEntityRegistry } from '../../../../../../useEntityRegistry';
import { useEnterKeyListener } from '../../../../../../shared/useEnterKeyListener';
import { DomainLabel } from '../../../../../../shared/DomainLabel';
import { handleBatchError } from '../../../../utils';
import { tagRender } from '../tagRenderer';
import { BrowserWrapper } from '../../../../../../shared/tags/AddTagsTermsModal';
import DomainNavigator from '../../../../../../domain/nestedDomains/domainNavigator/DomainNavigator';
import ClickOutside from '../../../../../../shared/ClickOutside';

type Props = {
    urns: string[];
    onCloseModal: () => void;
    refetch?: () => Promise<any>;
    defaultValue?: { urn: string; entity?: Entity | null };
    onOkOverride?: (result: string) => void;
    titleOverride?: string;
};

type SelectedDomain = {
    displayName: string;
    type: EntityType;
    urn: string;
};

export const SetDomainModal = ({ urns, onCloseModal, refetch, defaultValue, onOkOverride, titleOverride }: Props) => {
    const { t } = useTranslation();
    const entityRegistry = useEntityRegistry();
    const [isFocusedOnInput, setIsFocusedOnInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedDomain, setSelectedDomain] = useState<SelectedDomain | undefined>(
        defaultValue
            ? {
                  displayName: entityRegistry.getDisplayName(EntityType.Domain, defaultValue?.entity),
                  type: EntityType.Domain,
                  urn: defaultValue?.urn,
              }
            : undefined,
    );
    const [domainSearch, { data: domainSearchData }] = useGetSearchResultsLazyQuery();
    const domainSearchResults =
        domainSearchData?.search?.searchResults?.map((searchResult) => searchResult.entity) || [];
    const [batchSetDomainMutation] = useBatchSetDomainMutation();
    const inputEl = useRef(null);
    const isShowingDomainNavigator = !inputValue && isFocusedOnInput;

    const onModalClose = () => {
        setInputValue('');
        setSelectedDomain(undefined);
        onCloseModal();
    };

    const handleSearch = (text: string) => {
        domainSearch({
            variables: {
                input: {
                    type: EntityType.Domain,
                    query: text,
                    start: 0,
                    count: 5,
                },
            },
        });
    };

    // Renders a search result in the select dropdown.
    const renderSearchResult = (entity: Entity) => {
        const displayName = entityRegistry.getDisplayName(entity.type, entity);
        return (
            <Select.Option value={entity.urn} key={entity.urn}>
                <DomainLabel name={displayName} />
            </Select.Option>
        );
    };

    const domainResult = !inputValue || inputValue.length === 0 ? [] : domainSearchResults;

    const domainSearchOptions = domainResult?.map((result) => {
        return renderSearchResult(result);
    });

    const onSelectDomain = (newUrn: string) => {
        if (inputEl && inputEl.current) {
            (inputEl.current as any).blur();
        }
        const filteredDomains = domainResult?.filter((entity) => entity.urn === newUrn).map((entity) => entity) || [];
        if (filteredDomains.length) {
            const domain = filteredDomains[0];
            setSelectedDomain({
                displayName: entityRegistry.getDisplayName(EntityType.Domain, domain),
                type: EntityType.Domain,
                urn: newUrn,
            });
        }
    };

    function selectDomainFromBrowser(domain: Domain) {
        setIsFocusedOnInput(false);
        setSelectedDomain({
            displayName: entityRegistry.getDisplayName(EntityType.Domain, domain),
            type: EntityType.Domain,
            urn: domain.urn,
        });
    }

    const onDeselectDomain = () => {
        setInputValue('');
        setSelectedDomain(undefined);
    };

    const onOk = () => {
        if (!selectedDomain) {
            return;
        }

        if (onOkOverride) {
            onOkOverride(selectedDomain?.urn);
            return;
        }

        batchSetDomainMutation({
            variables: {
                input: {
                    resources: [...urns.map((urn) => ({ resourceUrn: urn }))],
                    domainUrn: selectedDomain.urn,
                },
            },
        })
            .then(({ errors }) => {
                if (!errors) {
                    message.success({
                        content: t('crud.success.updateWithName', { name: t('common.domain') }),
                        duration: 2,
                    });
                    refetch?.();
                    onModalClose();
                    setSelectedDomain(undefined);
                }
            })
            .catch((e) => {
                message.destroy();
                message.error(
                    handleBatchError(
                        urns,
                        e,
                        {
                            content: `${t('crud.error.updateWithName', { name: t('common.domain') })}: \n ${
                                e.message || ''
                            }`,
                            duration: 3,
                        },
                        t,
                    ),
                );
            });
    };

    const selectValue = (selectedDomain && [selectedDomain?.displayName]) || undefined;

    // Handle the Enter press
    useEnterKeyListener({
        querySelectorToExecuteClick: '#setDomainButton',
    });

    function handleBlur() {
        setInputValue('');
    }

    function handleCLickOutside() {
        // delay closing the domain navigator so we don't get a UI "flash" between showing search results and navigator
        setTimeout(() => setIsFocusedOnInput(false), 0);
    }

    return (
        <Modal
            title={titleOverride || t('crud.setWithname', { name: t('common.domain') })}
            visible
            onCancel={onModalClose}
            footer={
                <>
                    <Button onClick={onModalClose} type="text">
                        {t('common.cancel')}
                    </Button>
                    <Button id="setDomainButton" disabled={selectedDomain === undefined} onClick={onOk}>
                        {t('common.add')}
                    </Button>
                </>
            }
        >
            <Form component={false}>
                <Form.Item>
                    <ClickOutside onClickOutside={handleCLickOutside}>
                        <Select
                            autoFocus
                            defaultOpen
                            filterOption={false}
                            showSearch
                            mode="multiple"
                            defaultActiveFirstOption={false}
                            placeholder={t('placeholder.searchForWithName', { name: t('common.domains') })}
                            onSelect={(domainUrn: any) => onSelectDomain(domainUrn)}
                            onDeselect={onDeselectDomain}
                            onSearch={(value: string) => {
                                // eslint-disable-next-line react/prop-types
                                handleSearch(value.trim());
                                // eslint-disable-next-line react/prop-types
                                setInputValue(value.trim());
                            }}
                            ref={inputEl}
                            value={selectValue}
                            tagRender={tagRender}
                            onBlur={handleBlur}
                            onFocus={() => setIsFocusedOnInput(true)}
                            dropdownStyle={isShowingDomainNavigator ? { display: 'none' } : {}}
                        >
                            {domainSearchOptions}
                        </Select>
                        <BrowserWrapper isHidden={!isShowingDomainNavigator}>
                            <DomainNavigator selectDomainOverride={selectDomainFromBrowser} />
                        </BrowserWrapper>
                    </ClickOutside>
                </Form.Item>
            </Form>
        </Modal>
    );
};
