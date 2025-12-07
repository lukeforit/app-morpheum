# Morpheum - RealityEngine

Morpheum is a powerful image transformation and editing application powered by Google's **Gemini 2.5 Flash Image** model. It specializes in transforming game screenshots into photorealistic images and performing complex edits using natural language prompts.

![Morpheum App](https://via.placeholder.com/800x400?text=Morpheum+App+Preview)

## Features

- 🎮 **Game to Reality**: Transform stylized or low-poly game screenshots into 8k realistic photos.
- 🎨 **Natural Language Editing**: Add objects, remove elements, change lighting, or apply stylistic filters using simple text prompts.
- 👁️ **Smart Comparison Views**: 
  - **Split**: Side-by-side comparison.
  - **Slider**: Interactive drag-to-reveal comparison.
  - **Single**: Full-screen view of the result.
- ⚡ **Real-time Performance**: Built with React and optimized for speed.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 2.5 Flash Image (`gemini-2.5-flash-image`)
- **Icons**: Lucide React

## Setup & Configuration

This project requires a Google Gemini API Key.

1. **Environment Variable**:
   Ensure you have an API key available in your environment variables.
   ```env
   API_KEY=your_google_genai_api_key
   ```

2. **Installation**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm start
   ```

## Usage

1. **Upload**: Drag and drop an image or click to select one from your device.
2. **Prompt**: 
   - Select a preset (e.g., "Game to Realism", "Cyberpunk").
   - Or type a custom prompt (e.g., "Make the car red", "Add snow to the mountains").
3. **Generate**: Click the **Generate** button.
4. **Compare**: Use the slider or split view to analyze the changes.
5. **Download**: Save your transformed image locally.

## License

MIT
