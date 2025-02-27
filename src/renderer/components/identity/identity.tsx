import React from 'react';
import styles from './identity.scss';

styles;

interface IdentityProps {
    setIdentity: () => void;
    identity: {
        name: string;
        confidence: number;
    };

    selected?: boolean;
}

export const Identity = ({
    identity,
    selected,
    setIdentity,
}: IdentityProps) => {
    const confidence = 100 * (1 - Math.min(identity.confidence, 1));

    return (
        <div
            className={`identity${selected ? ` identitySelected` : ``}`}
            onClick={setIdentity}
        >
            {String(Math.round(confidence)).padStart(2, `0`)}% - {identity.name}
            <div className={`identityBar`}>
                <div
                    className={`identityBarFill`}
                    style={{
                        width: `${confidence}%`,
                    }}
                ></div>
            </div>
        </div>
    );
};
