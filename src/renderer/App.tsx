import React, { useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

import { ImageSelector } from './screens/imageSelector/imageSelector';
import { WhaleIdentifier } from './screens/whaleIdentifier/whaleIdentifier';

export interface WhaleImage {
    file: File;
    selectedIdentity?: string;
    identities?: {
        name: string;
        confidence: number;
    }[];
}

export default function App() {
    const [images, setImages] = useState<WhaleImage[]>([]);
    const [hasProcessed, setHasProcessed] = useState<boolean>(false);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        hasProcessed ? (
                            <WhaleIdentifier
                                images={images}
                                setImages={setImages}
                            />
                        ) : (
                            <ImageSelector
                                images={images}
                                setImages={setImages}
                                next={() => setHasProcessed(true)}
                            />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}
