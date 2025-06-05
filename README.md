# MemeGen AI

A vanilla JavaScript meme generator app that uses OpenAI's image generation and structured outputs for creating, editing, and sharing memes.

## Features

- Generate memes using AI with text prompts
- Get creative meme ideas from the AI assistant
- Edit meme text, position, color, and more
- Save your favorite memes to a gallery
- Share memes via download, clipboard, or sharing API (when available)
- Responsive design that works on mobile and desktop

## Tech Stack

- Vanilla JavaScript (no frameworks)
- HTML5 and CSS3
- OpenAI API
  - Image generation via GPT-4.1-mini
  - Structured text outputs via GPT-4o-mini
- Local browser storage for persistence

## Getting Started

### Prerequisites

- Node.js and npm (for development tools)
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open `http://localhost:8080` in your browser

### Setting Up Your OpenAI API Key

1. Go to the Settings tab in the app
2. Enter your OpenAI API key
3. Save settings

## Project Structure

```
meme-generator/
├── public/                # Static assets
│   ├── assets/
│   │   ├── images/        # Image assets
│   │   └── fonts/         # Font files  
│   └── mock-data/         # Sample data for testing
├── src/                   # Source code
│   ├── css/               # Stylesheets
│   │   ├── main.css       # Main styles
│   │   ├── components.css # Component-specific styles
│   │   └── responsive.css # Responsive design styles
│   ├── js/                # JavaScript code
│   │   ├── services/      # API and business logic
│   │   ├── modules/       # Utility modules
│   │   └── ui/            # UI components
│   └── templates/         # View templates
├── index.html             # Main HTML file
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## Development

This project uses:

- ESLint for code quality
- live-server for local development

## License

MIT
