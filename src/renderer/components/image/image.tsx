import React, { useCallback, useEffect, useState } from 'react';

import { WhaleImage } from '../../App';
import styles from './image.scss';

styles;

interface ImageProps {
    whale: WhaleImage;

    selected?: boolean;
}

export const Image = ({ whale, selected }: ImageProps): JSX.Element => {
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

    return (
        <div className={`imageBorder${selected ? ` imageSelected` : ``}`}>
            <img className={`image`} src={imageURL} alt={whale.file.name} draggable="false" />
            <div className={`statusIndicator` + (processing? " statusProcessing": "")}/>
            <p className={`imageText`}>{whale.file.name}</p>
        </div>
    );
};
