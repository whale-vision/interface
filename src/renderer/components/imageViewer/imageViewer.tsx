import React, { useState, useCallback, useEffect } from 'react';
import { WhaleImage } from 'renderer/App';
import { Button } from '../button/button';
import { ReactComponent as RightArrowIcon } from '../../icons/right_arrow.svg';
import { ReactComponent as LeftArrowIcon } from '../../icons/left_arrow.svg';
import styles from './imageViewer.scss';
styles;

interface ImageViewerProps {
    currentImage: WhaleImage;
}

export const ImageViewer = ({ currentImage }: ImageViewerProps) => {
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
        readFile(currentImage.file, setCurrentImageURL);
        setCurrentOtherImage(0);
    }, [currentImage, readFile]);

    useEffect(() => {
        if (!otherImageDirectory) return;
        if (!currentImage.selectedIdentity) return;
        if (!otherImageDirectory[currentImage.selectedIdentity]) return;

        readFile(
            otherImageDirectory[currentImage.selectedIdentity][
                currentOtherImage
            ],
            setOtherImageURL,
        );
    }, [
        currentImage.selectedIdentity,
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
        if (!currentImage.selectedIdentity) return;
        if (!otherImageDirectory[currentImage.selectedIdentity]) return;

        if (
            currentOtherImage
            < otherImageDirectory[currentImage.selectedIdentity].length - 1
        ) {
            setCurrentOtherImage(currentOtherImage + 1);
        } else {
            setCurrentOtherImage(0);
        }
    };

    const previous = () => {
        if (!otherImageDirectory) return;
        if (!currentImage.selectedIdentity) return;
        if (!otherImageDirectory[currentImage.selectedIdentity]) return;

        if (currentOtherImage > 0) {
            setCurrentOtherImage(currentOtherImage - 1);
        } else {
            setCurrentOtherImage(
                otherImageDirectory[currentImage.selectedIdentity].length - 1,
            );
        }
    };

    return (
        <section className={`imageViewer`}>
            <div className={`imageViewerSection`}>
                {currentImage.file?.name}
                <img
                    className={`imageViewerImage`}
                    src={currentImageURL}
                    alt={currentImage.file.name}
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

            {otherImageDirectory && currentImage.selectedIdentity ? (
                otherImageDirectory[currentImage.selectedIdentity] ? (
                    <div className={`imageViewerSection`}>
                        <div className={`imageViewerControls`}>
                            Confirmed images of {currentImage.selectedIdentity}
                        </div>
                        <img
                            className={`imageViewerImage`}
                            src={otherImageURL}
                            alt={
                                currentImage.selectedIdentity ?
                                    otherImageDirectory[
                                        currentImage.selectedIdentity
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
                        No other images of {currentImage.selectedIdentity}
                        {` `}
                        found,
                        <Button onClick={selectDirectory}>
                            select a directory
                        </Button>
                    </div>
                )
            ) : (
                <div className={`imageViewerControls`}>
                    To view other images of {currentImage.selectedIdentity}
                    <Button onClick={selectDirectory}>
                        select a directory
                    </Button>
                </div>
            )}
        </section>
    );
};
