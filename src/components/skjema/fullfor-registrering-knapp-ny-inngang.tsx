import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import useSprak from '../../hooks/useSprak';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { useConfig } from '../../contexts/config-context';
import { Config } from '../../model/config';
import byggOpplysningerPayload from '../../lib/bygg-opplysninger-payload';
import { FullforRegistreringResponse } from '../../model/registrering';
import { fetcher as api } from '../../lib/api-utils';
import hentKvitteringsUrl from '../../lib/hent-kvitterings-url';
import { logger } from '@navikt/next-logger';
import { FeilmeldingGenerell } from '../feilmeldinger/feilmeldinger';
import { Button } from '@navikt/ds-react';
import { Side, SkjemaState } from '../../model/skjema';

interface FullforKnappProps {
    skjemaState: SkjemaState;
    onSubmit(): void;
    onValiderSkjema(): boolean;
    tekst(s: string): string;
}
const FullforRegistreringKnappNyInngang = (props: FullforKnappProps) => {
    const { tekst } = props;
    const [senderSkjema, settSenderSkjema] = useState<boolean>(false);
    const [visFeilmelding, settVisFeilmelding] = useState<boolean>(false);
    const router = useRouter();
    const { enableMock } = useConfig() as Config;
    const brukerMock = enableMock === 'enabled';
    const { skjemaState, onSubmit, onValiderSkjema } = props;
    const fullfoerRegostreringUrl = brukerMock ? 'api/mocks/opplysninger' : 'api/opplysninger';

    const validerOgFullfor = () => {
        if (onValiderSkjema()) {
            return fullforRegistrering();
        }
    };

    const fullforRegistrering = useCallback(async () => {
        try {
            const body = byggOpplysningerPayload(skjemaState);
            settSenderSkjema(true);
            settVisFeilmelding(false);
            onSubmit();

            const response: FullforRegistreringResponse = await api(fullfoerRegostreringUrl, {
                method: 'post',
                body: JSON.stringify(body),
            });
            console.log('response ->', response);
            return router.push(hentKvitteringsUrl());
        } catch (e) {
            settVisFeilmelding(true);
            logger.error(e, `Registreringfeilet`);
            console.error(e);
            return router.push('/feil/');
        } finally {
            settSenderSkjema(false);
        }
    }, [onSubmit, router, skjemaState, fullfoerRegostreringUrl]);

    return (
        <>
            {visFeilmelding && (
                <div className="mb-6">
                    <FeilmeldingGenerell />
                </div>
            )}
            <div style={{ textAlign: 'center' }}>
                <Button onClick={validerOgFullfor} loading={senderSkjema} disabled={senderSkjema}>
                    {tekst('fullfoerRegistrering')}
                </Button>
            </div>
        </>
    );
};

export default FullforRegistreringKnappNyInngang;
