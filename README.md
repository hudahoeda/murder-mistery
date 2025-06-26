# Murder Mystery Game

An open-source, interactive, and customizable murder mystery game engine. This platform allows you to host a web-based mystery game where players team up to solve a series of interconnected puzzles, analyze evidence, and identify a culprit before time runs out.

This repository contains a complete, ready-to-play game set in a train station, but is designed to be easily adapted for your own custom scenarios.

## ✨ Features

-   **Team-Based Gameplay**: Players can create or join teams to solve the mystery together.
-   **Interactive Puzzles**: A variety of puzzle types are supported, including ciphers, image analysis, logic puzzles, and more.
-   **Real-Time Progress**: A live leaderboard tracks team scores and completion times.
-   **Dynamic Clue System**: Clues are revealed progressively as teams solve puzzles.
-   **Admin Dashboard**: A simple interface at `/admin` to monitor teams, view progress, and reset the game state.
-   **Customizable**: The entire game—puzzles, story, evidence, and characters—is defined in JSON files, making it easy to create your own mystery.

## 🚀 Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn-UI](https://ui.shadcn.com/)
-   **Database**: [Redis](https://redis.io/) for storing all game state, including team progress and leaderboards.
-   **Package Manager**: [pnpm](https://pnpm.io/)

## 🏁 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or newer)
-   [pnpm](https://pnpm.io/installation)
-   A [Redis](https://redis.io/docs/getting-started/) instance (you can use a free cloud instance or run it locally via Docker).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/murder-mistery.git
    cd murder-mistery
    ```

2.  **Install dependencies:**
    ```sh
    pnpm install
    ```

3.  **Set up environment variables:**
    Copy the example environment file and update it with your Redis connection URL.
    ```sh
    cp env.example .env.local
    ```

    Your `.env.local` should look like this:
    ```env
    # Example for a local Redis instance
    REDIS_URL="redis://localhost:6379"
    ```

4.  **Run the development server:**
    ```sh
    pnpm dev
    ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🔧 How to Customize Your Own Mystery

All game content is stored in the `lib/data` directory. You can create a new mystery by modifying the contents of these JSON files.

-   `puzzles.json`: Defines the puzzles, their order, their type (which maps to a React component in `components/puzzles/`), the clues they unlock, and their point values.
-   `clues.json`: Contains the text and metadata for all the clues that can be revealed.
-   `evidence.json`: A list of all evidence items, including images and descriptions.
-   `suspects.json`: Defines the characters in the story, including the culprit.

To create a new puzzle type, you would:
1.  Create a new React component in `components/puzzles/`.
2.  Add a new puzzle definition in `puzzles.json` and set its `type` to match the name of your new component.

## 🤝 Contributing

Contributions are welcome! Whether you want to fix a bug, add a new feature, or improve the documentation, your help is appreciated.

Please follow these steps to contribute:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix:
    ```sh
    git checkout -b feature/your-feature-name
    ```
3.  **Make your changes** and commit them with a clear message.
4.  **Push your changes** to your forked repository.
5.  **Open a pull request** to the main repository, explaining the changes you made.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
