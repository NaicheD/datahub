import Cookies from 'js-cookie';
import { CLIENT_AUTH_COOKIE } from '../conf/Global';
import { useGetMeQuery } from '../graphql/me.generated';
import {useTranslation} from 'react-i18next';

/**
 * Fetch a CorpUser object corresponding to the currently authenticated user.
 */
export function useGetAuthenticatedUser(skip?: boolean) {
    const userUrn = Cookies.get(CLIENT_AUTH_COOKIE);
    const { data, error } = useGetMeQuery({ skip: skip || !userUrn, fetchPolicy: 'cache-and-network' });
    const {t} = useTranslation();
    if (error) {
        console.error(t('user.error.noUserInCache') + error.message);
    }
    return data?.me;
}

/**
 * Fetch an urn corresponding to the authenticated user.
 */
export function useGetAuthenticatedUserUrn() {
    const userUrn = Cookies.get(CLIENT_AUTH_COOKIE);
    const {t} = useTranslation('translation');
    if (!userUrn) {
        throw new Error(t('user.error.noUserConnected'));
    }
    return userUrn;
}
