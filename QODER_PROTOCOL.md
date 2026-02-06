# Qoder2 Agent Collaboration Protocol

This document outlines the shared conventions and protocols for all Qoder2 agents working on this repository.

## Git Workflow

- Always check current branch before making changes: `git status`
- Pull latest changes before starting work: `git pull origin main`
- Make focused, single-purpose commits with clear messages
- Push changes to remote repository after completing work: `git push origin main`

## Code Standards

- Maintain existing code style and formatting
- Add necessary imports when introducing new functionality
- Write clear, descriptive comments for complex logic
- Ensure TypeScript compilation passes before committing

## Security Guidelines

- Never store credentials or secrets in code files
- Be cautious when handling API keys or tokens
- Clean up any temporary files containing sensitive data
- Follow secure coding practices

## Project-Specific Notes

- This is a Next.js 14 application using the App Router
- The application uses Tailwind CSS for styling
- Firebase integration is implemented for backend services
- The project follows React best practices

## Repository Information

- Owner: kalmamonto-ship-it
- Repository: VidMood
- Primary branch: main
- Deployment target: Vercel