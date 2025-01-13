# Wuyill APP

## Overview

Wuyill APP is a cutting-edge AI assistant designed to provide a spotlight-like experience, offering intelligent and context-aware assistance. Built on the foundation of **LLMack**, Wuyill aims to evolve into an omnipotent AI agent or a multi-agent system capable of handling a wide range of tasks and interactions.

The goal of Wuyill is to create a seamless and intuitive user experience, leveraging the power of large language models (LLMs) to deliver personalized, intelligent, and efficient assistance across various domains.

## Features

- **Spotlight-like Assistance**: Wuyill provides quick, context-aware responses to user queries, similar to a spotlight that instantly illuminates the information you need.
  
- **Omnipotent AI Agent**: Wuyill is designed to handle a wide range of tasks, from simple queries to complex problem-solving, making it a versatile assistant for everyday use.

- **Multi-Agent System**: Wuyill can be extended to operate as a multi-agent system, where multiple AI agents collaborate to solve more complex problems or handle multiple tasks simultaneously.

- **LLMack Integration**: Built on the **LLMack** framework, Wuyill leverages state-of-the-art language models to ensure high-quality, accurate, and contextually relevant responses.

- **Customizable**: Wuyill is highly customizable, allowing developers to tailor its behavior, responses, and capabilities to specific use cases or industries.

## Getting Started

### Prerequisites

- Golang 1.23.4 or higher
- Access to the LLMack framework (if applicable)
    https://github.com/showntop/llmack

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/showntop/wuyill.git
   ```

2. **Install Server**:
   ```bash
   go build cmd/search
   ```

3. **Install Client**:
   ```bash
   cd client
   pnpm install
   ```

4. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add necessary environment variables, such as API keys or configuration settings.

5. **Run the Application**:
   ```bash
   pnpm tuari dev
   go run cmd/search/main.go
   ```

### Usage

Once the application is running, you can interact with Wuyill through the command line or integrate it into your preferred interface (e.g., desktop app, web app, mobile app).

Example interaction:
```bash
$ CMD + K 
Wuyill: Hello! How can I assist you today?
User: What's the weather like in New York?
Wuyill: The weather in New York is currently 72°F with clear skies.
```

## Contributing

We welcome contributions from the community! If you'd like to contribute to Wuyill, please follow these steps:

1. **Fork the Repository**: Fork the repository to your own GitHub account.

2. **Create a Branch**: Create a new branch for your feature or bug fix.
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**: Implement your changes and ensure they are well-tested.

4. **Commit and Push**: Commit your changes and push them to your forked repository.
   ```bash
   git commit -m "Add your commit message here"
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**: Open a pull request from your branch to the main repository. Provide a detailed description of your changes.

## License

Wuyill APP is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions, suggestions, or feedback, please reach out to us at:

- **Email**: rongtaoxiao@gmail.com
- **GitHub Issues**: [Open an Issue](https://github.com/showntop/wuyill/issues)

---

Thank you for using Wuyill APP! We hope it becomes an indispensable tool in your daily life.