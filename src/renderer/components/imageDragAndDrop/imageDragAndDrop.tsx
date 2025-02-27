import React, { useCallback } from 'react';
import { Image } from '../image/image';
import { useDropzone } from 'react-dropzone';
import styles from './imageDragAndDrop.scss';
import { Button } from '../button/button';
import { WhaleImage } from 'renderer/App';
import ProgressBar from '@ramonak/react-progress-bar';
import { ReactComponent as RightArrowIcon } from '../../icons/right_arrow.svg';
import { ReactComponent as AddIcon } from '../../icons/add.svg';

import { stage } from 'renderer/screens/imageSelector/imageSelector';
styles;

interface DragAndDropToolBarProps {
    isDragActive: boolean;
    open: () => void;
    process: () => void;
}

const DragAndDropToolBar = ({
    isDragActive,
    open,
    process,
}: DragAndDropToolBarProps) => {
    return (
        <div className={`dropToolBar`}>
            <p className={`dragAndDropText`}>
                {isDragActive ? (
                    <>Drop the images above</>
                ) : (
                    <>
                        Select images to be identified, drag and drop or
                        <Button onClick={open}>
                            <>
                                <AddIcon className={`iconDark`} /> add more
                                images
                            </>
                        </Button>
                    </>
                )}
            </p>
            <div>
                <Button altColour onClick={process}>
                    <>
                        Process Images{` `}
                        <RightArrowIcon className={`iconLight`} />
                    </>
                </Button>
            </div>
        </div>
    );
};

interface DragAndDropProgressBar {
    currentStage: stage;
    currentImage: number;
    imageCount: number;
}

const DragAndDropProgressBar = ({
    currentStage,
    currentImage,
    imageCount,
}: DragAndDropProgressBar) => {
    let progress = 0;

    if (currentStage === stage.SEGMENTING) {
        progress += (currentImage / imageCount) * 80;
    } else if (currentStage === stage.EXTRACTING) {
        progress += 80;
        progress += (currentImage / imageCount) * 10;
    } else if (currentStage === stage.IDENTIFYING) {
        progress += 90;
        progress += (currentImage / imageCount) * 10;
    }

    return (
        <div className={`ProgressBar`}>
            <ProgressBar
                isLabelVisible={false}
                completed={progress}
                bgColor={`#2978a0`}
            />
        </div>
    );
};

interface ImageDragAndDropProps {
    images: WhaleImage[];
    setImages: React.Dispatch<React.SetStateAction<WhaleImage[]>>;
    process: () => void;
    currentStage: stage;
    currentImage: number;
}

export const ImageDragAndDrop = ({
    images,
    setImages,
    process,
    currentStage,
    currentImage,
}: ImageDragAndDropProps): JSX.Element => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const images = acceptedFiles.filter((file) =>
                file.type.startsWith(`image/`),
            );

            setImages((currentImages) => {
                const uniqueImages = images.filter(
                    (image) =>
                        !currentImages.find(
                            (currentImage) =>
                                currentImage.file.name === image.name,
                        ),
                );
                return currentImages.concat(
                    uniqueImages.map((image) => ({
                        file: image,
                    })),
                );
            });
        },
        [setImages],
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        noClick: true,
    });

    return (
        <div className={`dropBorder`} {...getRootProps()}>
            {images.length === 0 ? (
                <div className={`dragAndDropHint`}>
                    Drag and drop images to be identified here, or click the
                    button below
                </div>
            ) : null}

            <div className={`images`}>
                {images.map((image) => (
                    <Image key={image.file.name} whale={image} />
                ))}
            </div>

            <input {...getInputProps()} />

            {currentStage === stage.SELECTING ? (
                <DragAndDropToolBar
                    isDragActive={isDragActive}
                    open={open}
                    process={process}
                />
            ) : (
                <DragAndDropProgressBar
                    currentStage={currentStage}
                    currentImage={currentImage}
                    imageCount={images.length}
                />
            )}
        </div>
    );
};
