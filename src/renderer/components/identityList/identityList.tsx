import { Button } from '../button/button';
import { Identity } from '../identity/identity';
import { ImageList } from '../imageList/imageList';
import { Prompt } from '../prompt/prompt';
import React from 'react';
import { WhaleImage } from '../../App';
import styles from './identityList.scss';

styles;

interface IdentityListProps {
    whale: WhaleImage | undefined;
    setImages: React.Dispatch<React.SetStateAction<WhaleImage[]>>;
}

export const IdentityList = ({
    whale,
    setImages,
}: IdentityListProps) => {
    const [showPrompt, setShowPrompt] = React.useState(false);

    const setIdentity = (identity: string) => {
        setImages((images) =>
            images.map((image) => {
                if (image.file.path !== whale?.file.path) return image;

                return {
                    ...image,
                    selectedIdentity: identity,
                };
            }),
        );
    };

    const confirmIdentity = () => {
        setImages((images) =>
            images.map((image) => {
                if (image.file.path !== whale?.file.path) return image;

                return {
                    ...image,
                    confirmed: !image.confirmed,
                };
            }),
        );
    };

    console.log("whale", whale)

    const setIdentityName = (name: string) => {
        setImages((images) => {
            const newImages = images.map((image) => {
                if (image.file.path !== whale?.file.path) return image;

                return {
                    ...image,
                    identities: [
                        { name, confidence: 0 },
                        ...(image.identities || []),
                    ],
                    selectedIdentity: name,
                    confirmed: true,
                };
            });

            // identifyImages(newImages);

            return newImages;
        });

        setShowPrompt(false);
    }

    return (
        <div className={"identityListContainer"}>
            {showPrompt && <Prompt
                title={"New Identity"}
                message={"Enter the name of the new identity"}
                onConfirm={setIdentityName}
                onCancel={() => setShowPrompt(false)}
            />}
            <div className={`identityList`}>
                {whale?.identities?.map((identity) => (
                    <Identity
                        key={identity.name}
                        identity={identity}
                        selected={identity.name === whale.selectedIdentity}
                        setIdentity={() => setIdentity(identity.name)}
                    />
                ))}
            </div>
            <div className={`identityControls`}>
                <Button onClick={confirmIdentity}>Confirm</Button>
                <Button onClick={() => setShowPrompt(true)}>New Identity</Button>
            </div>
        </div>
    );
};
