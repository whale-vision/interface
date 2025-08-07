import { WhaleImage, WhaleImageGroup } from '../../App';

import { Button } from '../button/button';
import { Identity } from '../identity/identity';
import { ImageList } from '../imageList/imageList';
import { Prompt } from '../prompt/prompt';
import React from 'react';
import styles from './identityList.scss';

styles;

interface IdentityListProps {
    whale: WhaleImage | undefined;
    group: WhaleImageGroup | undefined;
    setSelectedImage: React.Dispatch<React.SetStateAction<WhaleImage | undefined>>;
}

export const IdentityList = ({
    whale,
    group,
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
                {group?.identities?.map((identity) => (
                    <Identity
                        key={identity.name}
                        identity={identity}
                        selected={identity.name === group.selectedIdentity}
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
