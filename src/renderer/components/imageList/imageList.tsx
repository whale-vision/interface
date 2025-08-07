import { DropEvent, useDropzone } from 'react-dropzone';
import React, { useCallback, useState } from 'react';
import { WhaleImage, WhaleImageGroup } from '../../App';

import { Button } from '../button/button';
import { Image } from '../image/image';
import { ImageControlBar } from '../imageControlBar/imageControlBar';
import { fromEvent } from "file-selector";
// @ts-ignore
import styles from './imageList.scss';

styles;

const getFiles = async (event: DropEvent): Promise<File[]> => {
    // @ts-ignore
    const files: File[] = Array.from(event.dataTransfer?.files);

    const selector = fromEvent(event);
    const resolvedFiles = await selector;

    const filesFromDirectories = resolvedFiles.filter(
        // @ts-ignore
        (file) => file.path
    )

    // @ts-ignore
    return [...files, ...filesFromDirectories];
};

interface ImageListProps {
    imageGroups: WhaleImageGroup[];
    setImageGroups: React.Dispatch<React.SetStateAction<WhaleImageGroup[]>>;

    processImages: (images: WhaleImage[]) => void;
    
    selectedImage: WhaleImage | undefined;
    setSelectedImage: React.Dispatch<React.SetStateAction<WhaleImage | undefined>>;

    saveImages: () => void;
}

export const ImageList = ({
    imageGroups: images,
    setImageGroups: setImages,
    processImages,
    selectedImage,
    setSelectedImage,
    saveImages,
}: ImageListProps) => {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const imageFiles = acceptedFiles
            .filter(file => file.type.startsWith('image/'));

        const newImages = imageFiles.map(file => ({ file }));

        const imageGroup: WhaleImageGroup = {
            name: `Group ${images.length + 1}`,
            images: newImages,
        }


        if (images.length === 0 && newImages.length > 0) {
            setSelectedImage(newImages[0]);
        }

        processImages(newImages);

        setImages(currentImages => {
            currentImages.push(imageGroup);
            return currentImages;
        });
    }, [setImages, processImages, setSelectedImage]);


    const moveImage = useCallback((imageName: string, targetGroup: WhaleImageGroup) => {
        const image = images.flatMap(group => group.images).find(img => img.file.name === imageName);
        if (!image) return;

        setImages(currentImages => {
            const updatedImages = currentImages.map(group => {
                const newImages = group.images.filter(img => img.file.path !== image.file.path);

                if (group.name === targetGroup.name) {
                    newImages.push(image);
                }

                return {
                    ...group,
                    images: newImages,
                };
            });
            return updatedImages;
        });

    }, [setImages]);


    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        getFilesFromEvent: getFiles,
        noClick: true,
    });

    const clearImages = () => {
        setImages([]);
        setSelectedImage(undefined);
    };

    return (
        <div className="identitiesSection">
            <div className={`identitiesList`} {...getRootProps()}>
                <input {...getInputProps()} />
                {images.length === 0 ? (
                    <div className={`dragAndDropHint`}>
                        Drag and drop images to be identified here
                    </div>
                ) : null}
                {images.map((group) => (
                    <div
                        key={group.name}
                        className={`imageCategory`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const imageName = e.dataTransfer.getData('text/plain');
                            moveImage(imageName, group);
                        }}
                    >
                        <h3>{group.name}</h3>
                        <div className={`imageList`}>
                            {group.images.map((image) => (
                                <div
                                    key={image.file.path}
                                    draggable
                                    onDragStart={(e) => e.dataTransfer.setData('text/plain', image.file.name)}
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <Image
                                        whale={image}
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
                    altColour
                    onClick={() => clearImages()}
                >
                    Clear
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
