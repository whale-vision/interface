# Whale Vision Application

## About

**Whale Vision** is a user-friendly application designed to identify individual sperm whales using state-of-the-art neural networks. Developed for researchers and conservationists, this tool automates the traditionally manual process of photo-identification, accelerating and improving the accuracy of whale monitoring efforts.

## Features

- **Automated Identification:** Uses deep learning models to recognise individual whales from images of flukes and flanks.
- **User-Friendly Interface:** Built with Electron and React.js for cross-platform compatibility and ease of use.
- **GPU Acceleration:** Utilises GPU resources when available for faster processing, with automatic fallback to CPU if necessary.
- **Dataset Management:** Easily add new individuals, confirm identifications, and export organised datasets for further research.

## Installation

1. **Install Python**  
   Ensure Python is installed on your system. [Download Python](https://www.python.org/downloads/)

2. **Install Required Python Packages**  
   Open a terminal and run:
	```
	pip install websockets torch torchvision
	```


3. **Download and Run the Application**  
- Download the latest `.exe` release from the project repository.
- Double-click the `.exe` to install the application.

## Usage

1. **Create a Dataset:**  
- Gather as many images as possible for each individual whale, drag every image for an identity into the program and wait for it to process them.
- Use the "New Identity" button to add a new whale to your database.

2. **Identify Whales:**  
- Drag and drop image files into the left panel of the application.
- The processed image and predicted identity will be displayed in the center and right panels.
- Use the predicted order to select the correct identity for each whale.

3. **Manage and Confirm Identifications:**  
- To view additional images of a whale, select a directory structured with subfolders named after each whale (each containing images of that individual).
- Use the "Confirm" button to mark images as confirmed. This enables re-identification if new identities are added, ensuring all images are correctly sorted.
- The "Export Images" feature saves confirmed images in folders named after each identity for easy organisation.

## Technical Overview

- The frontend is built with Electron and React.js, providing a seamless experience across platforms.
- The backend Python server handles all neural network computations and communicates with the frontend via a websocket, allowing for progress tracking and responsive updates.
- The application is optimised for GPU acceleration but will run on CPU if no CUDA device is detected, ensuring compatibility with a wide range of hardware.

## Scientific Context

The Mediterranean sperm whale (*Physeter macrocephalus*) is endangered, and effective conservation relies on accurate, non-invasive individual identification. Traditional manual photo-ID is labor-intensive. Whale Vision leverages machine learning to automate this process, supporting both fluke and (novelly) flank images for identification. Two Residual Neural Network models, trained with contrastive learning, represent each whale in a 128-dimensional latent space for rapid re-identification. Evaluation on the Oceanomare Delphis dataset achieved identification accuracies of 81.2% for fluke images and 76.5% for flank images, demonstrating the effectiveness of this approach. The application is adaptable to other cetacean species, offering a scalable, non-invasive solution to support conservation efforts.

## Citation

If you use this tool in your research, please cite:

> S. Fuller, S. Maggi, T. Kypraios, B. Mussi, and M. Pound, ‘Whale Vision: A Tool for Identifying Sperm Whales and Other Cetaceans by Their Flank or Fluke’, Mar. 07, 2025, Social Science Research Network, Rochester, NY: 5169298. doi: 10.2139/ssrn.5169298.

## License

This project is licensed under the MIT License.  
See the [LICENSE](./LICENSE) file for details.
