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
        if (!otherImageDirectory) return;
        if (!selectedIdentity) return;
        if (!otherImageDirectory[selectedIdentity]) return;

        readFile(
            otherImageDirectory[selectedIdentity][
                currentOtherImage
            ],
            setOtherImageURL,
        );
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
                const path = files[i].path.split(/\\|\//);
                const whale = path[path.length - 2];

                if (!whaleImages[whale]) {
                    whaleImages[whale] = [];
                }

                whaleImages[whale].push(files[i]);
            }

            setOtherImageDirectory(whaleImages);
            setCurrentOtherImage(0);
        },
        [setOtherImageDirectory, setCurrentOtherImage],
    );

    const next = () => {
        if (!otherImageDirectory) return;
        if (!selectedIdentity) return;
        if (!otherImageDirectory[selectedIdentity]) return;

        if (
            currentOtherImage
            < otherImageDirectory[selectedIdentity].length - 1
        ) {
            setCurrentOtherImage(currentOtherImage + 1);
        } else {
            setCurrentOtherImage(0);
        }
    };

    const previous = () => {
        if (!otherImageDirectory) return;
        if (!selectedIdentity) return;
        if (!otherImageDirectory[selectedIdentity]) return;

        if (currentOtherImage > 0) {
            setCurrentOtherImage(currentOtherImage - 1);
        } else {
            setCurrentOtherImage(
                otherImageDirectory[selectedIdentity].length - 1,
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

            {otherImageDirectory && selectedIdentity ? (
                otherImageDirectory[selectedIdentity] ? (
                    <div className={`imageViewerSection`}>
                        <div className={`imageViewerControls`}>
                            Confirmed images of {selectedIdentity}
                        </div>
                        <img
                            className={`imageViewerImage`}
                            src={otherImageURL}
                            alt={
                                selectedIdentity ?
                                    otherImageDirectory[
                                        selectedIdentity
                                    ][currentOtherImage].name
                                    : `no image`
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
                        No other images of {selectedIdentity}
                        {` `}
                        found,
                        <Button onClick={selectDirectory}>
                            select a directory
                        </Button>
                    </div>
                )
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
