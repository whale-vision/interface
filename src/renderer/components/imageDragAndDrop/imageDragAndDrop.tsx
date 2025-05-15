import { DropEvent, useDropzone } from 'react-dropzone';
import React, { useCallback } from 'react';

import { ReactComponent as AddIcon } from '../../icons/add.svg';
import { Button } from '../button/button';
import { Image } from '../image/image';
import ProgressBar from '@ramonak/react-progress-bar';
import { ReactComponent as RightArrowIcon } from '../../icons/right_arrow.svg';
import { WhaleImage } from '../../App';
import { stage } from '../../screens/imageSelector/imageSelector';
import styles from './imageDragAndDrop.scss';

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
        progress += (currentImage / imageCount) * 50;
    } else if (currentStage === stage.EXTRACTING) {
        progress += 50;
        progress += (currentImage / imageCount) * 30;
    } else if (currentStage === stage.IDENTIFYING) {
        progress += 80;
        progress += (currentImage / imageCount) * 20;
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
                console.log(images[0])
                
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

    const getFiles = async (event: DropEvent) => {
        // @ts-ignore
        const files: Promise<File[]> = Array.from(event.dataTransfer?.files);
        return files;
    };

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        getFilesFromEvent: getFiles,
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
