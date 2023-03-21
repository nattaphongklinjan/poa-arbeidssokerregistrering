import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import {
    Components as DecoratorComponents,
    fetchDecoratorReact,
    Props as DecoratorProps,
} from '@navikt/nav-dekoratoren-moduler/ssr';
import { logger } from '@navikt/next-logger';

const dekoratorEnv = process.env.DEKORATOR_ENV as Exclude<DecoratorProps['env'], 'localhost'>;

const dekoratorProps: DecoratorProps = {
    env: dekoratorEnv ?? 'prod',
    simple: true,
    context: 'privatperson',
    chatbot: false,
    // availableLanguages,
};
export default class MyDocument extends Document<DecoratorComponents> {
    static async getInitialProps(ctx: DocumentContext) {
        const { locale } = ctx;
        const initialProps = await Document.getInitialProps(ctx);
        const Dekorator: DecoratorComponents = await fetchDecoratorReact({
            ...dekoratorProps,
            //language: locale as any,
        }).catch((err) => {
            logger.error(err);
            const empty = () => <></>;
            return {
                Footer: empty,
                Header: empty,
                Scripts: empty,
                Styles: empty,
            };
        });

        return {
            ...initialProps,
            ...Dekorator,
            locale,
        };
    }

    render(): JSX.Element {
        const { Styles, Scripts, Header, Footer, locale } = this.props;
        return (
            <Html lang={locale ?? 'nb'}>
                <Head>
                    <Styles />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <body>
                    <Scripts />
                    <Header />
                    <Main />
                    <Footer />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
