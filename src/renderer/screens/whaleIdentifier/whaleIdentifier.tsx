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

    const sendWebsocketMessage = async (message: string) => {
        console.log("send message", message);
        
        if (websocket) {
            websocket.send(message)
        } else {
            const websocket = new WebSocket(`ws://localhost:8765`);
            websocket.onopen = () => {
                websocket.send(message);
            };
            websocket.onmessage = websocketEvent;

            setWebsocket(websocket);
        }
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

        sendWebsocketMessage(message);
    }, [images, updateImages]);

    const extractImages = useCallback((images: WhaleImage[]) => {
        if (images.length === 0) return;

        const message = JSON.stringify({
            type: `extract`,
            fileNames: images.map((image) => image.file.path),
        });

        sendWebsocketMessage(message);
    }, [updateImages]);

    const save = () => {
        const message = JSON.stringify({
            type: `save`,
            whaleIdentities: images.map((image) => ({
                "file": image.file.path,
                "selectedIdentity": image.selectedIdentity,
            })),
        });

        sendWebsocketMessage(message);
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
                    reidentifyImages={identifyImages}
                    saveImages={save}
                />
            </section>
            {selectedImage && (
                <section className={`whaleIdentifierDetails`}>
                    <IdentityList
                        whale={images.find(x => x.file.path === selectedImage.file.path)}
                        setImages={setImages}
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
