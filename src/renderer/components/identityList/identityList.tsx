import React from 'react';
import { WhaleImage } from 'renderer/App';
import { Identity } from '../identity/identity';
import styles from './identityList.scss';
styles;

interface IdentityListProps {
    whale: WhaleImage;
    setImages: React.Dispatch<React.SetStateAction<WhaleImage[]>>;
    selectedWhale?: string;
}

export const IdentityList = ({
    whale,
    selectedWhale,
    setImages,
}: IdentityListProps) => {
    const setIdentity = (identity: string) => {
        setImages((images) =>
            images.map((image) => {
                if (image.file.path !== whale.file.path) return image;

                return {
                    ...image,
                    selectedIdentity: identity,
                };
            }),
        );
    };

    return (
        <div className={`identityList`}>
            {whale.identities?.map((identity) => (
                <Identity
                    key={identity.name}
                    identity={identity}
                    selected={identity.name === selectedWhale}
                    setIdentity={() => setIdentity(identity.name)}
                />
            ))}
        </div>
    );
};
