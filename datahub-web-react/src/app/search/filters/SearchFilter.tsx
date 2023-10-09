import React from 'react';
import { useTranslation } from 'react-i18next';
import { FacetFilterInput, FacetMetadata } from '../../../types.generated';
import useSearchFilterDropdown from './useSearchFilterDropdown';
import { getFilterDropdownIcon } from './utils';
import SearchFilterView from './SearchFilterView';
import { ENTITY_FILTER_NAME, FIELD_TO_LABEL } from '../utils/constants';
import EntityTypeFilter from './EntityTypeFilter/EntityTypeFilter';

interface Props {
    filter: FacetMetadata;
    activeFilters: FacetFilterInput[];
    onChangeFilters: (newFilters: FacetFilterInput[]) => void;
}

export default function SearchFilter({ filter, activeFilters, onChangeFilters }: Props) {
    const { t, i18n } = useTranslation();
    const {
        isMenuOpen,
        updateIsMenuOpen,
        updateFilters,
        filterOptions,
        numActiveFilters,
        areFiltersLoading,
        searchQuery,
        updateSearchQuery,
    } = useSearchFilterDropdown({
        filter,
        activeFilters,
        onChangeFilters,
    });
    const filterIcon = getFilterDropdownIcon(filter.field);

    if (filter.field === ENTITY_FILTER_NAME) {
        return <EntityTypeFilter filter={filter} activeFilters={activeFilters} onChangeFilters={onChangeFilters} />;
    }

    // Check translation with type
    let potentialI18nKey = `entity.type.${filter.displayName?.toUpperCase()}_interval`;
    // Check translation in common
    if (!i18n.exists(potentialI18nKey)) {
        potentialI18nKey = `common.${(filter.displayName || '').toLowerCase()}`;
    }
    // Check translation FIELD_TO_LABEL key
    if (!i18n.exists(potentialI18nKey)) {
        potentialI18nKey = FIELD_TO_LABEL[(filter.displayName || '').toLowerCase()]?.transKey;
    }
    // Check translation FIELD_TO_LABEL name
    if (!i18n.exists(potentialI18nKey)) {
        Object.keys(FIELD_TO_LABEL).forEach((flKey) => {
            const fl = FIELD_TO_LABEL[flKey];
            if (fl.name === filter.displayName) {
                potentialI18nKey = fl.transKey;
            }
        });
    }

    const displayName =
        (i18n.exists(potentialI18nKey) && t(potentialI18nKey, { count: 1 })) || filter.displayName || '';

    return (
        <SearchFilterView
            filterOptions={filterOptions}
            isMenuOpen={isMenuOpen}
            numActiveFilters={numActiveFilters}
            filterIcon={filterIcon}
            displayName={displayName}
            searchQuery={searchQuery}
            loading={areFiltersLoading}
            updateIsMenuOpen={updateIsMenuOpen}
            setSearchQuery={updateSearchQuery}
            updateFilters={updateFilters}
        />
    );
}
