import React, { useState } from 'react';
import { WhaleImage } from 'renderer/App';
import { ImageDragAndDrop } from 'renderer/components/imageDragAndDrop/imageDragAndDrop';
import styles from './imageSelector.scss';
styles;

export enum stage {
    SELECTING,
    SEGMENTING,
    EXTRACTING,
    IDENTIFYING,
}

interface ImageSelectorProps {
    images: WhaleImage[];
    setImages: React.Dispatch<React.SetStateAction<WhaleImage[]>>;
    next: () => void;
}

export const ImageSelector = ({
    images,
    setImages,
    next,
}: ImageSelectorProps): JSX.Element => {
    const [websocket, setWebsocket] = useState<WebSocket>();

    const [currentStage, setCurrentStage] = useState<stage>(stage.SELECTING);
    const [currentImage, setCurrentImage] = useState<number>(0);

    const setProgress = (newStage: stage, message: string) => {
        const currentImage = message.split(`:`)[1].split(`/`)[0];

        if (currentStage !== newStage) {
            setCurrentStage(newStage);
        }

        setCurrentImage(parseInt(currentImage));
    };

    const event = async (event: MessageEvent) => {
        const message = event.data;

        if (message === `complete!`) {
            websocket?.close();
            next();

            return;
        }

        if (message.startsWith(`segmenting`))
            setProgress(stage.SEGMENTING, message);

        if (message.startsWith(`extracting`))
            setProgress(stage.EXTRACTING, message);

        if (message.startsWith(`identifying`))
            setProgress(stage.IDENTIFYING, message);

        if (message.startsWith(`{`)) {
            const data = JSON.parse(message);

            setImages((images) => {
                const newImages = images.map((image) => {
                    if (image.file.path !== data.path) return image;

                    image.identities = data.distances.map(
                        (identity: [string, number]) => ({
                            name: identity[0],
                            confidence: identity[1],
                        }),
                    );

                    image.selectedIdentity = image.identities?.length ?
                        image.identities[0].name
                        : undefined;

                    return image;
                });

                return newImages;
            });
        } else {
            console.log(message);
        }
    };

    const process = () => {
        if (images.length === 0) return;

        setCurrentStage(stage.SEGMENTING);

        const websocket = new WebSocket(`ws://localhost:8765`);
        websocket.onopen = () => {
            websocket.send(
                JSON.stringify({
                    type: `identify`,
                    fileNames: images.map((image) => image.file.path),
                }),
            );
        };
        websocket.onmessage = event;

        setWebsocket(websocket);
    };

    return (
        <section className={`selector`}>
            <ImageDragAndDrop
                images={images}
                setImages={setImages}
                process={process}
                currentStage={currentStage}
                currentImage={currentImage}
            />
        </section>
    );
};
