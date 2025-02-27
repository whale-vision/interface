import React, { useCallback, useState } from 'react';
import { WhaleImage } from 'renderer/App';
import styles from './image.scss';
styles;

interface ImageProps {
    whale: WhaleImage;
    selected?: boolean;
}

export const Image = ({ whale, selected }: ImageProps): JSX.Element => {
    const [imageURL, setImageURL] = useState<string>();

    const readFile = useCallback(() => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const dataURL = event.target?.result;
            if (typeof dataURL === `string`) setImageURL(dataURL);
        };

        reader.readAsDataURL(whale.file);
    }, [whale]);

    readFile();

    return (
        <div className={`imageBorder${selected ? ` imageSelected` : ``}`}>
            <img className={`image`} src={imageURL} alt={whale.file.name} />
            <p className={`imageText`}>{whale.file.name}</p>
        </div>
    );
};
