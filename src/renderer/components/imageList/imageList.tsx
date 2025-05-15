import { DropEvent, useDropzone } from 'react-dropzone';
import React, { useCallback, useState } from 'react';

import { Button } from '../button/button';
import { Image } from '../image/image';
import { ImageControlBar } from '../imageControlBar/imageControlBar';
import { WhaleImage } from '../../App';
import styles from './imageList.scss';

styles;

const getFiles = async (event: DropEvent) => {
    // @ts-ignore
    const files: Promise<File[]> = Array.from(event.dataTransfer?.files);
    return files;
};

interface ImageListProps {
    images: WhaleImage[];
    setImages: React.Dispatch<React.SetStateAction<WhaleImage[]>>;

    processImages: (images: WhaleImage[]) => void;
    reidentifyImages: (images?: WhaleImage[]) => void;
    
    selectedImage: WhaleImage | undefined;
    setSelectedImage: React.Dispatch<React.SetStateAction<WhaleImage | undefined>>;

    saveImages: () => void;
}

export const ImageList = ({
    images,
    setImages,
    processImages,
    reidentifyImages,
    selectedImage,
    setSelectedImage,
    saveImages,
}: ImageListProps) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const images = acceptedFiles.filter((file) =>
                file.type.startsWith(`image/`),
            );
            console.log(acceptedFiles)

            setImages((currentImages) => {
                const uniqueImages = images.filter(
                    (image) =>
                        !currentImages.find(
                            (currentImage) =>
                                currentImage.file.path === image.path,
                        ),
                );

                const uniqueImageObjects = uniqueImages.map((image) => ({
                    file: image,
                }))

                processImages(uniqueImageObjects)
                if (currentImages.length === 0 && uniqueImageObjects.length > 0) {
                    setSelectedImage(uniqueImageObjects[0]);
                }

                return currentImages.concat(uniqueImageObjects);
            });
        },
        [setImages],
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        getFilesFromEvent: getFiles,
        noClick: true,
    });

    const categorisedImages = Object.entries(
        images.reduce((acc, image) => {
            const identity = image.selectedIdentity || 'processing';
            if (!acc[identity]) {
                acc[identity] = [];
            }
            acc[identity].push(image);
            return acc;
        }, {} as { [key: string]: WhaleImage[] })
    ).map(([identity, images]) => ({ identity, images }));

    const sortedCategorisedImages = categorisedImages.sort((a, b) => {
        if (a.identity === 'processing') return -1;
        if (b.identity === 'processing') return 1;
        return a.identity.localeCompare(b.identity);
    });

    const setConfirmed = useCallback((whale: WhaleImage) => {
        setImages((images) => {
            return images.map((image) => {
                if (image.file.path === whale.file.path) {
                    return { ...image, confirmed: whale.confirmed };
                }
                return image;
            });
        });
    }, [setImages]);

    return (
        <div className="identitiesSection">
            <div className={`identitiesList`} {...getRootProps()}>
                <input {...getInputProps()} />
                {images.length === 0 ? (
                    <div className={`dragAndDropHint`}>
                        Drag and drop images to be identified here
                    </div>
                ) : null}
                {sortedCategorisedImages.map((whale) => (
                    <div
                        key={whale.identity}
                        className={`imageCategory`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            if (whale.identity === 'processing') return;
                            e.preventDefault();
                            const imageName = e.dataTransfer.getData('text/plain');
                            setImages((currentImages) =>
                                currentImages.map((image) =>
                                    image.file.name === imageName
                                        ? { ...image, selectedIdentity: whale.identity, confirmed: true }
                                        : image
                                )
                            );
                        }}
                    >
                        <h3>{whale.identity}</h3>
                        <div className={`imageList`}>
                            {whale.images.map((image) => (
                                <div
                                    key={image.file.path}
                                    draggable={!!image.selectedIdentity}
                                    onDragStart={(e) => image.selectedIdentity && e.dataTransfer.setData('text/plain', image.file.name)}
                                    onClick={() => image.selectedIdentity && setSelectedImage(image)}
                                >
                                    <Image
                                        whale={image}
                                        setWhale={setConfirmed}
                                        selected={selectedImage?.file?.path === image.file.path}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className={`imageControlBar`}>
                <Button
                    onClick={() => reidentifyImages()}
                >
                    Reidentify Unconfirmed
                </Button>
                <Button
                    onClick={saveImages}
                >
                    Export Images
                </Button>
            </div>
        </div>
    );
};
