import React, { useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

import { WhaleIdentifier } from './screens/whaleIdentifier/whaleIdentifier';

export interface WhaleImage {
    file: File;
    
    type?: string;

    embedding?: number[];
    identities?: {
        name: string;
        confidence: number;
    }[];
}

export interface WhaleImageGroup {
    name: string;

    identities?: {
        name: string;
        confidence: number;
    }[];
    selectedIdentity?: string;

    images: WhaleImage[];
}

export default function App() {

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <WhaleIdentifier />
                    }
                />
            </Routes>
        </Router>
    );
}
