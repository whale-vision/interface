import React from 'react';
import styles from './button.scss';
styles;

interface ImageProps {
    children: JSX.Element | string;
    onClick: () => void;
    altColour?: boolean;
}

export const Button = ({
    children,
    onClick,
    altColour,
}: ImageProps): JSX.Element => {
    return (
        <button
            onClick={onClick}
            className={altColour ? `buttonAltColour` : `buttonDefaultColour`}
        >
            {children}
        </button>
    );
};
