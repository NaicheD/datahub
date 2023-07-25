export const FILTER_URL_PREFIX = 'filter_';
export const SEARCH_FOR_ENTITY_PREFIX = 'SEARCH__';
export const EXACT_SEARCH_PREFIX = 'EXACT__';

export const ENTITY_FILTER_NAME = '_entityType';
export const LEGACY_ENTITY_FILTER_NAME = 'entity';
export const ENTITY_INDEX_FILTER_NAME = '_index';
export const ENTITY_SUB_TYPE_FILTER_NAME = '_entityType␞typeNames';
export const TAGS_FILTER_NAME = 'tags';
export const GLOSSARY_TERMS_FILTER_NAME = 'glossaryTerms';
export const CONTAINER_FILTER_NAME = 'container';
export const DOMAINS_FILTER_NAME = 'domains';
export const DATA_PRODUCTS_FILTER_NAME = 'dataProducts';
export const OWNERS_FILTER_NAME = 'owners';
export const TYPE_NAMES_FILTER_NAME = 'typeNames';
export const PLATFORM_FILTER_NAME = 'platform';
export const FIELD_TAGS_FILTER_NAME = 'fieldTags';
export const EDITED_FIELD_TAGS_FILTER_NAME = 'editedFieldTags';
export const FIELD_GLOSSARY_TERMS_FILTER_NAME = 'fieldGlossaryTerms';
export const EDITED_FIELD_GLOSSARY_TERMS_FILTER_NAME = 'editedFieldGlossaryTerms';
export const FIELD_PATHS_FILTER_NAME = 'fieldPaths';
export const FIELD_DESCRIPTIONS_FILTER_NAME = 'fieldDescriptions';
export const EDITED_FIELD_DESCRIPTIONS_FILTER_NAME = 'editedFieldDescriptions';
export const DESCRIPTION_FILTER_NAME = 'description';
export const REMOVED_FILTER_NAME = 'removed';
export const ORIGIN_FILTER_NAME = 'origin';
export const DEGREE_FILTER_NAME = 'degree';
export const BROWSE_PATH_V2_FILTER_NAME = 'browsePathV2';

export const LEGACY_ENTITY_FILTER_FIELDS = [ENTITY_FILTER_NAME, LEGACY_ENTITY_FILTER_NAME];

export const FILTER_DELIMITER = '␞';

export const ENTITY_SUB_TYPE_FILTER_FIELDS = [ENTITY_FILTER_NAME, ENTITY_SUB_TYPE_FILTER_NAME,
    LEGACY_ENTITY_FILTER_NAME, TYPE_NAMES_FILTER_NAME,];

export const FILTERS_TO_TRUNCATE = [TAGS_FILTER_NAME, GLOSSARY_TERMS_FILTER_NAME, CONTAINER_FILTER_NAME,
    DOMAINS_FILTER_NAME, OWNERS_FILTER_NAME, ENTITY_FILTER_NAME, TYPE_NAMES_FILTER_NAME, PLATFORM_FILTER_NAME,];
export const TRUNCATED_FILTER_LENGTH = 5;

export const ORDERED_FIELDS = [ENTITY_FILTER_NAME, PLATFORM_FILTER_NAME, OWNERS_FILTER_NAME, TAGS_FILTER_NAME,
    GLOSSARY_TERMS_FILTER_NAME, DOMAINS_FILTER_NAME, DATA_PRODUCTS_FILTER_NAME, FIELD_TAGS_FILTER_NAME,
    FIELD_GLOSSARY_TERMS_FILTER_NAME, FIELD_PATHS_FILTER_NAME, FIELD_DESCRIPTIONS_FILTER_NAME, DESCRIPTION_FILTER_NAME,
    CONTAINER_FILTER_NAME, REMOVED_FILTER_NAME, TYPE_NAMES_FILTER_NAME, ORIGIN_FILTER_NAME, DEGREE_FILTER_NAME,];

export const FIELD_TO_LABEL: { [key: string]: { name: string, transKey: string, ns: string[], count?: number } } = {
    owners: {
        name: 'Owner', transKey: 'common.owner', ns: ['translation']
    }, tags: {
        name: 'Tag', transKey: 'TAG', ns: ['entity'], count: 1
    }, domains: {
        name: 'Domain', transKey: 'DOMAIN', ns: ['entity'], count: 1
    }, platform: {
        name: 'Platform', transKey: 'DATA_PLATFORM', ns: ['entity'], count: 1
    }, fieldTags: {
        name: 'Column Tag', transKey: 'common.column $t(entity:TAG)', ns: ['translation', 'entity'], count: 1
    }, glossaryTerms: {
        name: 'Glossary Term', transKey: 'GLOSSARY_TERM', ns: ['entity'], count: 1
    }, fieldGlossaryTerms: {
        name: 'Column Glossary Term',
        transKey: 'common.column $t(entity:GLOSSARY_TERM)',
        ns: ['translation', 'entity'],
        count: 1
    }, fieldPaths: {
        name: 'Column Name', transKey: 'common.column $t(translation:common.name)', ns: ['translation']
    }, description: {
        name: 'Description', transKey: 'common.description', ns: ['translation']
    }, fieldDescriptions: {
        name: 'Column Description', transKey: 'common.column $t(translation:common.description)', ns: ['translation']
    }, removed: {
        name: 'Soft Deleted', transKey: 'crud.success.softDelete', ns: ['translation']
    }, entity: {
        name: 'Entity Type', transKey: 'common.entityType', ns: ['translation']
    }, entityType: {
        name: 'Entity Type', transKey: 'common.entityType', ns: ['translation']
    }, _entityType: {
        name: 'Entity Type', transKey: 'common.entityType', ns: ['translation']
    }, container: {
        name: 'Container', transKey: 'CONTAINER', ns: ['entity'], count: 1
    }, typeNames: {
        name: 'Sub Type', transKey: 'common.subtype', ns: ['translation']
    }, origin: {
        name: 'Environment', transKey: 'common.environment', ns: ['translation']
    }, degree: {
        name: 'Degree', transKey: 'common.degree', ns: ['translation']
    }, [DATA_PRODUCTS_FILTER_NAME]: {
        name: 'Data Product', transKey: 'filter.dataProduct', ns: ['translation']
    }, [BROWSE_PATH_V2_FILTER_NAME]: {
        name: 'Browse', transKey: 'common.browse', ns: ['translation']
    },
};

export const FIELDS_THAT_USE_CONTAINS_OPERATOR = [DESCRIPTION_FILTER_NAME, FIELD_DESCRIPTIONS_FILTER_NAME,
    FIELD_PATHS_FILTER_NAME,];

export const ADVANCED_SEARCH_ONLY_FILTERS = [FIELD_GLOSSARY_TERMS_FILTER_NAME, EDITED_FIELD_GLOSSARY_TERMS_FILTER_NAME,
    FIELD_TAGS_FILTER_NAME, EDITED_FIELD_TAGS_FILTER_NAME, FIELD_PATHS_FILTER_NAME, DESCRIPTION_FILTER_NAME,
    FIELD_DESCRIPTIONS_FILTER_NAME, EDITED_FIELD_DESCRIPTIONS_FILTER_NAME, REMOVED_FILTER_NAME,];

export enum UnionType {
    AND, OR,
}

export const UNIT_SEPARATOR = '␟';

export const FilterModes = {
    BASIC: 'basic', ADVANCED: 'advanced',
} as const;

export type FilterMode = typeof FilterModes[keyof typeof FilterModes];
