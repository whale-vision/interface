import React from 'react';
import { WhaleImage } from 'renderer/App';
import { Button } from '../button/button';
import { ReactComponent as RightArrowIcon } from '../../icons/right_arrow.svg';
import { ReactComponent as LeftArrowIcon } from '../../icons/left_arrow.svg';
import styles from './imageControlBar.scss';
styles;

interface ImageControlBarProps {
    next: () => void;
    previous: () => void;
    images: WhaleImage[];
}

export const ImageControlBar = ({
    next,
    previous,
    images,
}: ImageControlBarProps) => {
    const save = () => {
        if (images.length === 0) return;

        const websocket = new WebSocket(`ws://localhost:8765`);
        websocket.onopen = () => {
            websocket.send(
                JSON.stringify({
                    type: `save`,
                    whaleIdentities: images.map((image) => ({
                        file: image.file.path,
                        selectedIdentity: image.selectedIdentity,
                    })),
                }),
            );
        };

        websocket.onmessage = (event) => {
            const message = event.data;

            console.log(message);

            if (message === `complete!`) {
                websocket.close();
            }
        };
    };

    return (
        <div className={`imageControlBar`}>
            <div className={`imageControlBarCluster`}>
                <Button onClick={previous}>
                    <LeftArrowIcon className={`iconDark`} />
                </Button>
                <Button onClick={next}>
                    <RightArrowIcon className={`iconDark`} />
                </Button>
            </div>
            <div>
                <Button altColour onClick={save}>
                    Export all
                </Button>
            </div>
        </div>
    );
};
