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
    setSelectedImage: React.Dispatch<React.SetStateAction<WhaleImage | undefined>>;
}

export const IdentityList = ({
    whale,
    setSelectedImage,
}: IdentityListProps) => {
    const [showPrompt, setShowPrompt] = React.useState(false);

    const setIdentity = (identity: string) => {
        setSelectedImage((image) =>
            image ? ({
                ...image,
                selectedIdentity: identity,
            }) : undefined
        );
    };

    const confirmIdentity = () => {
        if (!whale) return;

        setSelectedImage((image) => 
            image ? ({
                ...image,
                confirmed: true,
            }) : undefined
        );
    };

    const setIdentityName = (name: string) => {
        if (!whale) return;

        setSelectedImage((image) =>
            image ? ({
                ...image,
                identities: [
                    { name, confidence: 0 },
                    ...(image.identities || []),
                ],
                selectedIdentity: name,
                confirmed: true,
            }) : undefined
        );

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
