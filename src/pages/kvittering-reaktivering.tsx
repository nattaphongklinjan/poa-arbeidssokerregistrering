import { useEffect } from 'react';
import { BodyLong, GuidePanel, Heading, Link } from '@navikt/ds-react';
import { lagHentTekstForSprak, Tekster } from '@navikt/arbeidssokerregisteret-utils';

import useSprak from '../hooks/useSprak';
import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';
import { loggAktivitet, loggFlyt } from '../lib/amplitude';
import { withAuthenticatedPage } from '../auth/withAuthentication';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Du er nå registrert som arbeidssøker',
        dagpengerTittel: 'Har du søkt om dagpenger?',
        permittert: 'Er du permittert eller arbeidsledig må du søke om dagpenger i egen søknad.',
        tidligstFaaDagpenger: 'Du kan tidligst få dagpenger fra den dagen du sender søknaden.',
        sendeSoknaden:
            'For å ikke tape dager med dagpenger må du sende søknaden senest samme dag som du ønsker dagpenger fra.',
        sokDagpenger: 'Søk dagpenger',
        skalIkkeSoke: 'Skal ikke søke nå',
    },
    nn: {
        header: 'Du er no registrert som arbeidssøkjar',
        dagpengerTittel: 'Har du søkt om dagpengar?',
        permittert: 'Viss du er permittert eller arbeidsledig, må du søkje om dagpengar i ein eigen søknad.',
        tidligstFaaDagpenger: 'Du kan få dagpengar tidlegast frå den dagen du sender inn søknaden.',
        sendeSoknaden:
            'For å unngå å tape dagar med dagpengar er det viktig at du sender søknaden seinast same dag som du ønskjer dagpengar frå.',
        sokDagpenger: 'Søk om dagpengar',
        skalIkkeSoke: 'Skal ikkje søkje no',
    },
    en: {
        header: 'You are now registered as a jobseeker',
        dagpengerTittel: 'Have you applied for unemployment benefits?',
        permittert:
            'If you were laid off or unemployed, you must apply for unemployment benefits in a separate application.',
        tidligstFaaDagpenger:
            'You can receive unemployment benefits at the earliest from the day you submit the application.',
        sendeSoknaden:
            'In order not to lose days of unemployment benefits, you must send the application no later than the same day you want unemployment benefits.',
        sokDagpenger: 'Apply for unemployment benefits',
        skalIkkeSoke: 'Not going to apply now',
    },
};

const Kvittering = () => {
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    useEffect(() => {
        loggAktivitet({
            aktivitet: 'Viser kvittering',
        });
        loggFlyt({ hendelse: 'Registrering fullført' });
    }, []);

    const { dagpengesoknadUrl, dittNavUrl } = useConfig() as Config;

    return (
        <>
            <Heading spacing level="1" size={'large'}>
                {tekst('header')}
            </Heading>
            <GuidePanel poster>
                <Heading level={'2'} spacing size={'medium'}>
                    {tekst('dagpengerTittel')}
                </Heading>
                <BodyLong>{tekst('permittert')}</BodyLong>
                <BodyLong>{tekst('tidligstFaaDagpenger')}</BodyLong>
                <BodyLong>{tekst('sendeSoknaden')}</BodyLong>
            </GuidePanel>
            <a
                href={dagpengesoknadUrl}
                onClick={() =>
                    loggAktivitet({
                        aktivitet: 'Går til dagpenger fra kvittering',
                    })
                }
                className="my-8 navds-button navds-button--primary navds-button--medium"
            >
                {tekst('sokDagpenger')}
            </a>
            <Link
                href={dittNavUrl}
                onClick={() =>
                    loggAktivitet({
                        aktivitet: 'Velger å ikke gå til dagpenger fra kvittering',
                    })
                }
            >
                {tekst('skalIkkeSoke')}
            </Link>
        </>
    );
};

export const getServerSideProps = withAuthenticatedPage();
export default Kvittering;
