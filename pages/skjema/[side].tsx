import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Header from '../../components/header';
import DinSituasjon, { Jobbsituasjon } from '../../components/skjema/din-situasjon';
import styles from '../../styles/skjema.module.css';
import SisteJobb from '../../components/skjema/siste-jobb/siste-jobb';
import Utdanning, {Utdanningsnivaa} from '../../components/skjema/utdanning';
import GodkjentUtdanning from '../../components/skjema/utdanning-godkjent';
import BestattUtdanning from '../../components/skjema/utdanning-bestatt';
import Helseproblemer from '../../components/skjema/helseproblemer';
import AndreProblemer from '../../components/skjema/andre-problemer';
import { Reducer, useReducer } from 'react';
import {Knapperad} from "../../components/skjema/knapperad";
import Avbryt from "../../components/skjema/avbryt-lenke";

interface SkjemaProps {
    side: number;
}

type SiderMap = { [key: number]: JSX.Element };

interface SkjemaState {
    dinSituasjon?: string;
    sisteJobb?: string;
    utdanning?: string;
}

type SkjemaReducer = Reducer<SkjemaState, SkjemaAction>;
type SkjemaAction = { type: ActionType; value: string };

enum ActionType {
    DinSituasjon,
    SisteJobb,
    Utdanning
}

function skjemaReducer(state: SkjemaState, action: SkjemaAction): SkjemaState {
    switch (action.type) {
        case ActionType.DinSituasjon: {
            return {
                ...state,
                dinSituasjon: action.value,
            };
        }
        case ActionType.Utdanning: {
            return {
                ...state,
                utdanning: action.value,
            };
        }
    }

    return state;
}

const initializer = (skjemaState: SkjemaState) => skjemaState;

const hentNesteSideForDinSituasjon = (valgtSituasjon?: string) => {
    if (valgtSituasjon === Jobbsituasjon.ALDRIJOBBET.valueOf()) {
        return 2;
    }
    return 1;
};

const hentNesteSideForUtdanning = (valgtSituasjon?: string) => {
    if (valgtSituasjon === Utdanningsnivaa.INGEN.valueOf()) {
        return 5;
    }
    return 3;
};



const Skjema: NextPage<SkjemaProps> = (props) => {
    const { side } = props;
    const router = useRouter();
    const [skjemaState, dispatch] = useReducer<SkjemaReducer, SkjemaState>(skjemaReducer, {}, initializer);

    const siderMap: SiderMap = {
        0: (
            <DinSituasjon
                onChange={(value) => dispatch({ type: ActionType.DinSituasjon, value })}
                valgt={skjemaState.dinSituasjon}
            />

        ),
        1: <SisteJobb/>,
        2: (
            <Utdanning
                onChange={(value) => dispatch({ type: ActionType.Utdanning, value })}
                valgt={skjemaState.utdanning}
            />
        ),
        3: <GodkjentUtdanning />,
        4: <BestattUtdanning />,
        5: <Helseproblemer />,
        6: <AndreProblemer />,
    };

    const hentKomponentForSide = (side: number) => {
        return siderMap[side] || siderMap[0];
    };

    const hentNesteSidenummer = (side: number) => {
        if (side === 0) {return hentNesteSideForDinSituasjon(skjemaState.dinSituasjon)}
        else if (side === 2) {return hentNesteSideForUtdanning(skjemaState.utdanning)}
        else return side++;
    }

    return (
        <>
            <Header />
            <main className={styles.main}>{hentKomponentForSide(side)}</main>
            <Knapperad onNeste={() => router.push(`/skjema/${hentNesteSidenummer(side)}`)} skalViseForrigeKnapp={side !== 0} />
            <Avbryt />
        </>
    );
};

Skjema.getInitialProps = async (context: any) => {
    const { side } = context.query;

    return {
        side: Number(side),
    };
};

export default Skjema;
