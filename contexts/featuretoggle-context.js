import { createContext, useContext, useEffect, useState } from 'react';
import { useConfig } from './config-context';

const FeatureToggleContext = createContext();

function FeatureToggleProvider({ children }) {
    const [toggles, setToggles] = useState({});
    const { featureTogglesUrl } = useConfig();
    useEffect(() => {
        const fetchToggles = async () => {
            const response = await fetch(featureTogglesUrl);

            const json = await response.json();
            const aktiveFeatures = json.reduce((features, feature) => {
                if (feature.enabled) {
                    features[feature.name] = true;
                }
                return features;
            }, {});
            setToggles(aktiveFeatures);
        };

        if (featureTogglesUrl) {
            fetchToggles();
        }
    }, [featureTogglesUrl]);

    return <FeatureToggleContext.Provider value={{ toggles }}>{children}</FeatureToggleContext.Provider>;
}

function useFeatureToggles() {
    const context = useContext(FeatureToggleContext);
    if (context === undefined) {
        throw new Error('useFeatureToggles må brukes under en FeatureToggleProvider');
    }
    return context;
}

export { FeatureToggleProvider, useFeatureToggles };
