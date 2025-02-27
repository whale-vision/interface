import React from 'react';
import { Image } from '../image/image';
import { WhaleImage } from 'renderer/App';
import styles from './imageList.scss';
import { ImageControlBar } from '../imageControlBar/imageControlBar';
styles;

interface ImageListProps {
    images: WhaleImage[];

    selectedImage: number;
    setSelectedImage: React.Dispatch<React.SetStateAction<number>>;
}

export const ImageList = ({
    images,
    selectedImage,
    setSelectedImage,
}: ImageListProps) => {
    return (
        <div>
            <div className={`imageList`}>
                {images.map((image, index) => (
                    <div
                        key={image.file.name}
                        onClick={() => setSelectedImage(index)}
                    >
                        <Image
                            whale={image}
                            selected={selectedImage === index}
                        />
                    </div>
                ))}
            </div>
            <ImageControlBar
                next={() => {
                    setSelectedImage((selectedImage) =>
                        Math.min(images.length - 1, selectedImage + 1),
                    );
                }}
                previous={() =>
                    setSelectedImage((selectedImage) =>
                        Math.max(0, selectedImage - 1),
                    )
                }
                images={images}
            />
        </div>
    );
};
