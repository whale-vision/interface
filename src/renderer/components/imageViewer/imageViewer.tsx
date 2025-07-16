import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '../button/button';
import { ReactComponent as LeftArrowIcon } from '../../icons/left_arrow.svg';
import { ReactComponent as RightArrowIcon } from '../../icons/right_arrow.svg';
import { WhaleImage } from '../../App';
import styles from './imageViewer.scss';

styles;

interface ImageViewerProps {
    imageFile: File;
    selectedIdentity?: string;
}

export const ImageViewer = ({ imageFile, selectedIdentity }: ImageViewerProps) => {
    const [currentImageURL, setCurrentImageURL] = useState<string>();
    const [otherImageURL, setOtherImageURL] = useState<string>();

    const [currentOtherImage, setCurrentOtherImage] = useState<number>(0);
    const [otherImageDirectory, setOtherImageDirectory] = useState<{
        [key: string]: File[];
    }>();

    const readFile = useCallback(
        (
            image: Blob,
            setter: React.Dispatch<React.SetStateAction<string | undefined>>,
        ) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const dataURL = event.target?.result;
                if (typeof dataURL === `string`) setter(dataURL);
                console.log("set url")
            };

            reader.readAsDataURL(image);
        },
        [],
    );

    useEffect(() => {
        readFile(imageFile, setCurrentImageURL);
        setCurrentOtherImage(0);
    }, [imageFile, readFile]);

    useEffect(() => {
        if (!otherImageDirectory) return setOtherImageURL(undefined);;
        if (!selectedIdentity) return setOtherImageURL(undefined);;

        const identityID: string | undefined = selectedIdentity.match(/PMOD\d\d\d/)?.[0];

        if (!identityID) return setOtherImageURL(undefined);
        if (!otherImageDirectory[identityID]) return setOtherImageURL(undefined);
        
        try {
            readFile(
                otherImageDirectory[identityID][currentOtherImage],
                setOtherImageURL,
            );
        } catch (error) {
            console.error("Error reading file:", error);
            setOtherImageURL(undefined);
        }
        
    }, [
        selectedIdentity,
        currentOtherImage,
        otherImageDirectory,
        readFile,
    ]);

    const selectDirectory = () =>
        document.getElementById(`fileSelector`)?.click();

    const importDirectory = useCallback(
        (files: FileList | null) => {
            if (!files) return;

            const whaleImages: { [key: string]: File[] } = {};

            for (let i = 0; i < files.length; i++) {
                const path = files[i].path;
                const whaleID: string | undefined = path.match(/PMOD\d\d\d/)?.[0];

                if (!whaleID) continue;
                if (!files[i].type.startsWith('image/')) {
                    continue;
                }

                if (!whaleImages[whaleID]) {
                    whaleImages[whaleID] = [];
                }

                whaleImages[whaleID].push(files[i]);
            }

            setOtherImageDirectory(whaleImages);
            setCurrentOtherImage(0);
        },
        [setOtherImageDirectory, setCurrentOtherImage, currentOtherImage, otherImageDirectory],
    );

    const next = () => {
        if (!selectedIdentity) return;
        const identityID: string | undefined = selectedIdentity.match(/PMOD\d\d\d/)?.[0];

        if (!otherImageDirectory) return;
        if (!identityID) return;
        if (!otherImageDirectory[identityID]) return;

        if (
            currentOtherImage
            < otherImageDirectory[identityID].length - 1
        ) {
            setCurrentOtherImage(currentOtherImage + 1);
        } else {
            setCurrentOtherImage(0);
        }
    };

    const previous = () => {
        if (!selectedIdentity) return;
        const identityID: string | undefined = selectedIdentity.match(/PMOD\d\d\d/)?.[0];

        if (!otherImageDirectory) return;
        if (!identityID) return;
        if (!otherImageDirectory[identityID]) return;

        if (currentOtherImage > 0) {
            setCurrentOtherImage(currentOtherImage - 1);
        } else {
            setCurrentOtherImage(
                otherImageDirectory[identityID].length - 1,
            );
        }
    };

    return (
        <section className={`imageViewer`}>
            <div className={`imageViewerSection`}>
                <h2>{imageFile?.name}</h2>
                <img
                    className={`imageViewerImage`}
                    src={currentImageURL}
                    alt={imageFile.name}
                />
            </div>

            <input
                id="fileSelector"
                type="file"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                webkitdirectory=""
                style={{ display: `none` }}
                onChange={(event) => importDirectory(event.target.files)}
            />

            {otherImageURL ? (
                <div className={`imageViewerSection`}>
                    <div className={`imageViewerControls`}>
                        Confirmed images of {selectedIdentity}
                    </div>
                    <img
                        className={`imageViewerImage`}
                        src={otherImageURL}
                        alt={
                            selectedIdentity
                        }
                    />
                    <div className={`imageViewerControls`}>
                        <Button onClick={previous}>
                            <LeftArrowIcon className={`iconDark`} />
                        </Button>
                        <Button onClick={next}>
                            <RightArrowIcon className={`iconDark`} />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={`imageViewerControls`}>
                    To view other images of {selectedIdentity}
                    <Button onClick={selectDirectory}>
                        select a directory
                    </Button>
                </div>
            )}
        </section>
    );
};
