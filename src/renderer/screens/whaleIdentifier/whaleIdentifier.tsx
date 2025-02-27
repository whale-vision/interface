import React from 'react';
import { WhaleImage } from 'renderer/App';
import { IdentityList } from 'renderer/components/identityList/identityList';
import { ImageList } from 'renderer/components/imageList/imageList';
import { ImageViewer } from 'renderer/components/imageViewer/imageViewer';
import styles from './whaleIdentifier.scss';
styles;

interface WhaleIdentifierProps {
    images: WhaleImage[];
    setImages: React.Dispatch<React.SetStateAction<WhaleImage[]>>;
}

export const WhaleIdentifier = ({
    images,
    setImages,
}: WhaleIdentifierProps) => {
    const [selectedImage, setSelectedImage] = React.useState<number>(0);

    return (
        <section className={`whaleIdentifier`}>
            <ImageList
                images={images}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
            />
            <section className={`whaleIdentifierDetails`}>
                <IdentityList
                    whale={images[selectedImage]}
                    selectedWhale={images[selectedImage].selectedIdentity}
                    setImages={setImages}
                />

                <ImageViewer currentImage={images[selectedImage]} />
            </section>
        </section>
    );
};
