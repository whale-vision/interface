import React, { useCallback, useEffect, useState } from 'react';

import { WhaleImage } from '../../App';
import styles from './image.scss';

styles;

interface ImageProps {
    whale: WhaleImage;
    setWhale: (image: WhaleImage) => void

    selected?: boolean;
}

export const Image = ({ whale, setWhale, selected }: ImageProps): JSX.Element => {
    const confirmed = !!whale.confirmed
    const processing = !whale.identities

    const [imageURL, setImageURL] = useState<string>();

    const readFile = useCallback(() => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const dataURL = event.target?.result;
            if (typeof dataURL === `string`) setImageURL(dataURL);
        };

        reader.readAsDataURL(whale.file);
    }, [whale]);

    useEffect(() => {
        readFile();
    }, [whale]);

    const toggleConfirmed = useCallback(() => {
        setWhale({
            ...whale,
            confirmed: !whale.confirmed
        })
    }, [whale, setWhale])

    return (
        <div className={`imageBorder${selected ? ` imageSelected` : ``}`}>
            <img className={`image`} src={imageURL} alt={whale.file.name} draggable="false" />
            <div onClick={toggleConfirmed} className={`statusIndicator` + (processing? " statusProcessing": confirmed? " statusConfirmed": "")}/>
            <p className={`imageText`}>{whale.file.name}</p>
        </div>
    );
};
