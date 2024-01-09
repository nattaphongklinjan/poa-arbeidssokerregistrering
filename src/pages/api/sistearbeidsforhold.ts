import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import {
    getAaregToken,
    getHeaders,
    getTokenFromRequest,
    getVeilarbregistreringToken,
} from '../../lib/next-api-handler';
import { withAuthenticatedApi } from '../../auth/withAuthentication';
import { verifyToken } from '../../auth/token-validation';
import { decodeJwt } from 'jose';
import { hentSisteArbeidsForhold } from '../../lib/hent-siste-arbeidsforhold';

const url = `${process.env.SISTE_ARBEIDSFORHOLD_URL}`;
const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';

async function hentFraVeilarbregistrering(req: NextApiRequest, callId: string) {
    const headers = brukerMock
        ? getHeaders('token', callId)
        : getHeaders(await getVeilarbregistreringToken(req), callId);

    return fetch(url, {
        headers,
    }).then((res) => res.json());
}

async function hentFraAareg(req: NextApiRequest, callId: string) {
    const headers = brukerMock ? getHeaders('token', callId) : getHeaders(await getAaregToken(req), callId);

    const url = `${process.env.AAREG_REST_API}/v2/arbeidstaker/arbeidsforholdoversikt`;
    const token = getTokenFromRequest(req)!;
    const result = await verifyToken(token, decodeJwt(token));
    const fnr = result.payload.pid as string;

    const arbeidsforholdoversikt = await fetch(url, {
        headers: {
            ...headers,
            'Nav-Personident': fnr,
        },
    }).then((res) => res.json());

    return hentSisteArbeidsForhold(arbeidsforholdoversikt);
}
const sisteArbeidsforhold = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const callId = nanoid();

    try {
        // const { styrk } = await hentFraVeilarbregistrering(req, callId);
        const { styrk } = await hentFraAareg(req, callId);
        const { konseptMedStyrk08List } = await fetch(
            `${process.env.PAM_JANZZ_URL}/kryssklassifiserMedKonsept?kodeForOversetting=${styrk}`,
            {
                headers: getHeaders('token', callId),
            },
        ).then((res) => res.json());

        res.json(konseptMedStyrk08List[0]);
    } catch (e) {
        res.status(500).end(`${e}`);
    }
};

export default withAuthenticatedApi(sisteArbeidsforhold);
