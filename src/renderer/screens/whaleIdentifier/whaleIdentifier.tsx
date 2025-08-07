import { WhaleImage, WhaleImageGroup } from '../../App';
import { useCallback, useEffect, useState } from 'react';

import { IdentityList } from '../../components/identityList/identityList';
import { ImageList } from '../../components/imageList/imageList';
import { ImageViewer } from '../../components/imageViewer/imageViewer';
import styles from './whaleIdentifier.scss';

styles;

interface WhaleIdentifierProps {}

export const WhaleIdentifier = ({}: WhaleIdentifierProps) => {
    const [imageGroups, setImageGroups] = useState<WhaleImageGroup[]>([]);
    
    const [selectedImage, setSelectedImage] = useState<WhaleImage | undefined>(undefined);

    const [websocket, setWebsocket] = useState<WebSocket>();


    const updateImages = useCallback((data: any) => {
        setImageGroups((imageGroups) => {
            const newImageGroups = imageGroups.map((group) => {
                const identities = [] as { name: string; confidence: number }[];

                const images = group.images.map((image) => {
                    const dataImage = data.find((x: any) => x.path === image.file.path);

                    if (!dataImage) return image;

                    if (dataImage.identities) {
                        image.identities = dataImage.identities.map(
                            (identity: [string, number]) => ({
                                name: identity[0],
                                confidence: identity[1],
                            }),
                        );

                        identities.push(dataImage.identities);
                    }

                    if (dataImage.embedding) {
                        image.embedding = dataImage.embedding;
                        image.type = dataImage.type;
                    }

                    return image;
                });

                const averagedIdentities: { [name: string]: number[] } = {};

                images.forEach((image) => {
                    image.identities?.forEach((identity) => {
                        if (!averagedIdentities[identity.name]) {
                            averagedIdentities[identity.name] = [];
                        }
                        averagedIdentities[identity.name].push(identity.confidence);
                    });
                });

                const averaged = Object.entries(averagedIdentities).map(([name, confidences]) => ({
                    name,
                    confidence: confidences.reduce((a, b) => a + b, 0) / confidences.length,
                }));

                averaged.sort((a, b) => a.confidence - b.confidence);

                return {
                    ...group,
                    identities: averaged,
                    selectedIdentity: group.selectedIdentity || averaged[0]?.name,
                    images: images,
                };
            });

            console.log("newImageGroups", newImageGroups);
            identifyImages(newImageGroups);

            return newImageGroups;
        });
    }, [setImageGroups, imageGroups]);

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

    const imagesFromGroups = useCallback((groups: WhaleImageGroup[]) => {
        const images: WhaleImage[] = [];
        groups.forEach((group) => {
            images.push(...group.images);
        });
        return images;
    }, []);

    const findImageGroup = useCallback((image: WhaleImage) => {
        return imageGroups.find((group) => group.images.some((img) => img.file.path === image.file.path));
    }, [imageGroups]);

    const identifyImages = useCallback((selectedImages?: WhaleImageGroup[]) => {
        const unprocessedImages = selectedImages ?
            imagesFromGroups(selectedImages).filter((image) => !image.identities && image.embedding) :
            imagesFromGroups(imageGroups).filter((image) => !image.identities && image.embedding);


        if (!selectedImages) {
            setImageGroups((imageGroups) => {
                return imageGroups.map((group) => {
                    const images = group.images.map((image) => {
                        if (image.embedding) {
                            return {...image, identities: undefined}
                        }
                        return image;
                    });
                    return {...group, images};
                });
            });
        }

        if (unprocessedImages.length === 0) return;

        const message = JSON.stringify({
            type: `identify`,
            data: unprocessedImages.map((image) => ({
                path: image.file.path,
                type: image.type,
                embedding: image.embedding,
            })),
        });

        connectAndSend(message);
    }, [imageGroups, updateImages]);

    const extractImages = useCallback((images: WhaleImage[]) => {
        if (images.length === 0) return;

        const message = JSON.stringify({
            type: `extract`,
            fileNames: images.map((image) => image.file.path),
        });

        connectAndSend(message);
    }, [updateImages]);

    const save = () => {
        // const message = JSON.stringify({
        //     type: `save`,
        //     whaleIdentities: images.map((image) => ({
        //         "file": image.file.path,
        //         "selectedIdentity": image.selectedIdentity,
        //     })),
        // });

        // connectAndSend(message);
    };
    
    const websocketEvent = useCallback(async (event: MessageEvent) => {
        const message = event.data;

        console.log("recieved message", message);

        if (message.startsWith(`[`)) {
            const data = JSON.parse(message);

            updateImages(data);
        }
    }, [updateImages, imageGroups, identifyImages]);


    return (
        <section className={`whaleIdentifier`}>
            <section className={`whaleIdentifierImages`}>
                <ImageList
                    imageGroups={imageGroups}
                    setImageGroups={setImageGroups}
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
                        group={findImageGroup(selectedImage)}
                        setSelectedImage={setSelectedImage}
                    />
                    <ImageViewer
                        imageFile={selectedImage.file}
                        selectedIdentity={findImageGroup(selectedImage)?.selectedIdentity}
                    />
                </section>
            )}
        </section>
    );
};
