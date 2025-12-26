# Machine Learning Made Visual

An interactive website that explains the basics of machine learning through visuals, examples, and simple explanations.

**[Live Site](https://machinelearning-amber.vercel.app)**

## Overview

Machine Learning Made Visual is a website built to help students and beginners understand how machines learn. It illustrates the difference between traditional programming and machine learning using patterns, comparisons, and short interactive examples.

## Technologies Used

- **React + TypeScript** – for component-based development and type safety
- **Vite** – for fast builds and a modern development setup
- **Tailwind CSS** – for responsive and simple styling
- **shadcn/ui** – for reusable UI components
- **Framer Motion** – for clean animations
- **TensorFlow.js** – for in-browser machine learning examples

## Features

- Visual and interactive learning experience
- Simple explanations of key ML concepts
- Example-based learning
- Fast and lightweight
- Fully static site deployed via GitHub Pages

## Project Structure

```
machinelearning/
│
├── public/                # Static assets
│   ├── model/             # TensorFlow.js MNIST model
│   │   ├── model.json
│   │   └── group1-shard1of1.bin
│   ├── favicon-*.png
│   └── site.webmanifest
│
├── src/                   # Source code
│   ├── assets/            # Images and icons
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── dist/                  # Production build
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── components.json        # shadcn/ui config
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Before starting, make sure you have:

- Node.js version 18 or later
- npm version 9 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/ishit-bansal/machinelearning.git

# Move into the project directory
cd machinelearning

# Install dependencies
npm install
```

### Run the project locally

```bash
npm run dev
```

Then open your browser to:
```
http://localhost:8080/machinelearning/
```

### Build for production

```bash
npm run build
npm run preview
```

## Deployment (GitHub Pages)

To deploy the site to GitHub Pages:

```bash
npm run deploy
```

## License

This project is licensed under the MIT License.

## Author

**Ishit Bansal**

If you found this project helpful, give it a star ⭐!

Made with ❤️
