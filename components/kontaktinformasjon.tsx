import { Alert, Cell, Detail, Heading, HelpText, Label, Link, Panel } from '@navikt/ds-react';
import useSprak from '../hooks/useSprak';
import lagHentTekstForSprak, { Tekster } from '../lib/lag-hent-tekst-for-sprak';
import { ExternalLink } from '@navikt/ds-icons';
import { Kontaktinformasjon as K } from '../model/kontaktinformasjon';

const TEKSTER: Tekster<string> = {
    nb: {
        tlfHosKRR: 'Telefonnummer lagret hos Kontakt- og reservasjonsregisteret',
        kildeKRR: 'Kilde: Kontakt- og reservasjonsregisteret',
        tlfHosNAV: 'Telefonnummer lagret hos NAV',
        kildeNAV: 'Kilde: NAV',
        endreOpplysninger: 'Endre opplysninger',
        ingenOpplysninger: 'Ingen kontaktopplysninger funnet!',
        hjelpetekst: 'Pass på at kontaktopplysningene dine er oppdatert, ellers kan vi ikke nå deg.',
    },
    en: {
        tlfHosKRR: 'Phone number registered with the common contact register',
        kildeKRR: 'Source: The common contact register',
        tlfHosNAV: 'Phone number registered with NAV',
        kildeNAV: 'Source: NAV',
        endreOpplysninger: 'Change contact details',
        ingenOpplysninger: 'We could not find any contact information!',
        hjelpetekst: 'Please make sure your contact details are updated or we will be unable to reach you.',
    },
};

interface Props {
    kontaktinfo: K;
}

export const Kontaktinformasjon = (props: Props) => {
    const { telefonnummerHosKrr, telefonnummerHosNav } = props.kontaktinfo;
    const manglerKontaktinfo = telefonnummerHosKrr === undefined && telefonnummerHosNav === undefined;
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    if (manglerKontaktinfo) {
        return (
            <>
                <Cell xs={12}>
                    <Alert variant="error" inline>
                        <div style={{ display: 'flex' }}>
                            {tekst('ingenOpplysninger')}
                            <HelpText>{tekst('hjelpetekst')}</HelpText>
                        </div>
                    </Alert>
                </Cell>
                <EndreOpplysninger />
            </>
        );
    } else {
        return (
            <>
                {telefonnummerHosKrr && (
                    <Cell xs={12}>
                        <Telefonnummer kilde="KRR" telefonnummer={telefonnummerHosKrr} />
                    </Cell>
                )}
                {telefonnummerHosNav && (
                    <Cell xs={12}>
                        <Telefonnummer kilde="NAV" telefonnummer={telefonnummerHosNav} />
                    </Cell>
                )}
                <EndreOpplysninger />
            </>
        );
    }
};

type Kilde = 'KRR' | 'NAV';

const Telefonnummer = (props: { kilde: Kilde; telefonnummer: string }) => {
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    return (
        <Panel border>
            <Heading size={'small'}>{tekst(`tlfHos${props.kilde}`)}</Heading>
            <Label>{props.telefonnummer}</Label>
            <Detail size={'small'}>{tekst(`kilde${props.kilde}`)}</Detail>
        </Panel>
    );
};

const EndreOpplysninger = () => {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    return (
        <Cell xs={12}>
            <Link href="https://www.nav.no/person/personopplysninger/#kontaktinformasjon">
                {tekst('endreOpplysninger')}
                <ExternalLink />
            </Link>
        </Cell>
    );
};
