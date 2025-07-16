import { useCallback, useEffect, useState } from 'react';

import { IdentityList } from '../../components/identityList/identityList';
import { ImageList } from '../../components/imageList/imageList';
import { ImageViewer } from '../../components/imageViewer/imageViewer';
import { WhaleImage } from '../../App';
import styles from './whaleIdentifier.scss';

styles;

interface WhaleIdentifierProps {}

export const WhaleIdentifier = ({}: WhaleIdentifierProps) => {
    const [images, setImages] = useState<WhaleImage[]>([]);
    
    const [selectedImage, setSelectedImage] = useState<WhaleImage | undefined>(undefined);

    const [websocket, setWebsocket] = useState<WebSocket>();


    const updateImages = useCallback((data: any) => {
        setImages((images) => {
            const newImages = images.map((image) => {
                const dataImage = data.find((x: any) => x.path === image.file.path);

                if (!dataImage) return image;

                if (dataImage.identities) {
                    image.identities = dataImage.identities.map(
                        (identity: [string, number]) => ({
                            name: identity[0],
                            confidence: identity[1],
                        }),
                    );

                    image.selectedIdentity = image.identities?.length ?
                        image.identities[0].name
                        : undefined;

                }

                if (dataImage.embedding) {
                    image.embedding = dataImage.embedding;
                    image.type = dataImage.type;
                }

                return image;
            });

            console.log("newImages", newImages);
            identifyImages(newImages);

            return newImages;
        });
    }, [setImages, images]);

    const connectAndSend = async (message: string, retries = 0) => {
        const ws = new WebSocket('ws://localhost:8765');

        ws.onopen = () => {
            ws.send(message);
            retries = 0;

            setWebsocket(ws);
        };

        ws.onerror = (event) => {
            console.log("Connection error:", event);
            if (retries < 100) {
                retries++;
                setTimeout(() => connectAndSend(message, retries), 1000);
            } else {
                console.log("Max retries reached");
            }
        };

        ws.onmessage = websocketEvent;
    }

    const identifyImages = useCallback((selectedImages?: WhaleImage[]) => {
        const unprocessedImages = selectedImages ? 
            selectedImages.filter((image) => !image.identities && image.embedding):
            images.filter((image) => !image.confirmed && image.embedding)

        if (!selectedImages) {
            setImages((images) => {
                return images.map((image) => {
                    if (!image.confirmed && image.embedding) {
                        return {...image, identities: undefined, selectedIdentity: undefined}
                    }
                    return image
                })
            })
        }

        if (unprocessedImages.length === 0) return;

        const message = JSON.stringify({
            type: `identify`,
            data: unprocessedImages.map((image) => ({
                path: image.file.path,
                type: image.type,
                embedding: image.embedding,
                identity: image.selectedIdentity,
            })),
        });

        connectAndSend(message);
    }, [images, updateImages]);

    const extractImages = useCallback((images: WhaleImage[]) => {
        if (images.length === 0) return;

        const message = JSON.stringify({
            type: `extract`,
            fileNames: images.map((image) => image.file.path),
        });

        connectAndSend(message);
    }, [updateImages]);

    const save = () => {
        const message = JSON.stringify({
            type: `save`,
            whaleIdentities: images.map((image) => ({
                "file": image.file.path,
                "selectedIdentity": image.selectedIdentity,
            })),
        });

        connectAndSend(message);
    };
    
    const websocketEvent = useCallback(async (event: MessageEvent) => {
        const message = event.data;

        console.log("recieved message", message);

        if (message.startsWith(`[`)) {
            const data = JSON.parse(message);
            console.log("images received", images);

            updateImages(data);
        }
    }, [updateImages, images, identifyImages]);


    return (
        <section className={`whaleIdentifier`}>
            <section className={`whaleIdentifierImages`}>
                <ImageList
                    images={images}
                    setImages={setImages}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    processImages={extractImages}
                    saveImages={save}
                />
            </section>
            {selectedImage && (
                <section className={`whaleIdentifierDetails`}>
                    <IdentityList
                        whale={selectedImage}
                        setSelectedImage={setSelectedImage}
                    />
                    <ImageViewer
                        imageFile={selectedImage.file}
                        selectedIdentity={selectedImage.selectedIdentity}
                    />
                </section>
            )}
        </section>
    );
};
