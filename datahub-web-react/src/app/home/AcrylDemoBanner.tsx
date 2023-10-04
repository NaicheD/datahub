import Link from 'antd/lib/typography/Link';
import React from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import AcrylLogo from '../../images/acryl-light-mark.svg';

const BannerWrapper = styled.div`
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #262626;
    background-color: #e6f4ff;
    width: 100%;
    margin-bottom: 24px;
`;

const Logo = styled.img`
    margin-right: 12px;
    height: 40px;
    width: 40px;
`;

const TextWrapper = styled.div`
    font-size: 14px;
`;

const Title = styled.div`
    font-weight: 700;
`;

const StyledLink = styled(Link)`
    color: #1890ff;
    font-weight: 700;
`;

export default function AcrylDemoBanner() {
    const { t } = useTranslation();
    return (
        <BannerWrapper>
            <Logo src={AcrylLogo} />
            <TextWrapper>
                <Title>{t('home.scheduleDemo')}</Title>
                <Trans
                    {...{
                        i18nKey: 'home.scheduleDemoDescription_component',
                        components: {
                            styledLinkDemo: (
                                <StyledLink
                        href="https://www.acryldata.io/datahub-sign-up?utm_source=datahub&utm_medium=referral&utm_campaign=acryl_signup"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                            styledLinkAws: (
                                <StyledLink
                                    href="https://aws.amazon.com/marketplace/pp/prodview-ratzv4k453pck?sr=0-1&ref_=beagle&applicationId=AWSMPContessa"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                        },
                    }}
                />
            </TextWrapper>
        </BannerWrapper>
    );
}
