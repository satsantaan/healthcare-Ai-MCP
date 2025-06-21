# Contributing to AI-Powered MCP Server

We welcome contributions to the AI-Powered MCP Server! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/ai-mcp-healthcare-server.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Setup

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start development server
npm run server

# Run tests
npm test
```

## Code Style

- Use ESLint and Prettier for code formatting
- Follow existing code patterns and conventions
- Write clear, descriptive commit messages
- Include tests for new features

## Testing

- Write unit tests for new functionality
- Ensure all tests pass before submitting PR
- Include integration tests for API endpoints
- Test HIPAA compliance features thoroughly

## Security

- Never commit API keys or sensitive data
- Follow HIPAA compliance guidelines
- Report security issues privately to security@mcpserver.com

## Pull Request Process

1. Update documentation for any new features
2. Ensure all tests pass
3. Update CHANGELOG.md with your changes
4. Submit PR with clear description of changes

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming community

## Questions?

- Open an issue for bugs or feature requests
- Use discussions for questions and community support
- Contact support@mcpserver.com for technical assistance

Thank you for contributing!
