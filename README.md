# SonarQube MCP Server

A Model Context Protocol (MCP) server that provides Claude Code with direct access to SonarQube code quality metrics, issues, and coverage data. This allows you to analyze and fix code quality issues without needing to navigate the SonarQube web interface.

## Features

- **Issue Management**: Get bugs, vulnerabilities, code smells, and security hotspots
- **Code Coverage**: Access detailed coverage metrics including line and branch coverage
- **Quality Metrics**: Retrieve complexity, duplications, and other code quality metrics
- **Quality Gates**: Check project quality gate status
- **Component Analysis**: List and analyze project components
- **Branch-Specific Analysis**: Supports branch-specific analysis by providing branch parameter to tools

## Installation

1. Clone or create the project directory:
```bash
mkdir sonarqube-mcp-server
cd sonarqube-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your SonarQube settings:
```env
SONARQUBE_URL=http://localhost:9000
SONARQUBE_TOKEN=your_sonarqube_token_here
SONARQUBE_PROJECT_KEY=your_project_key
```

### Getting a SonarQube Token

1. Log into your SonarQube instance
2. Go to User > My Account > Security
3. Generate a new token
4. Copy the token to your `.env` file

## Usage with Claude Code

### Option 1: Direct Configuration in Claude Code

Add the server to your Claude Code MCP settings:

```json
{
  "mcpServers": {
    "sonarqube": {
      "command": "node",
      "args": ["/path/to/sonarqube-mcp-server/dist/index.js"],
      "env": {
        "SONARQUBE_URL": "http://localhost:9000",
        "SONARQUBE_TOKEN": "your_token_here",
        "SONARQUBE_PROJECT_KEY": "your_project_key"
      }
    }
  }
}
```

### Option 2: Using Environment Variables

Set environment variables and add to MCP settings:

```json
{
  "mcpServers": {
    "sonarqube": {
      "command": "node",
      "args": ["/path/to/sonarqube-mcp-server/dist/index.js"]
    }
  }
}
```

## Available Tools

### `get_issues`
Get all issues with optional filtering by type, severity, and status.

**Parameters:**
- `projectKey` (optional): Override default project key
- `types` (optional): Filter by issue types (CODE_SMELL, BUG, VULNERABILITY, SECURITY_HOTSPOT)
- `severities` (optional): Filter by severity (INFO, MINOR, MAJOR, CRITICAL, BLOCKER)
- `statuses` (optional): Filter by status (OPEN, CONFIRMED, REOPENED, RESOLVED, CLOSED)
- `branch` (optional): Specific branch to analyze

### `get_code_smells`
Get all code smells for the project.

**Parameters:**
- `projectKey` (optional): Override default project key
- `branch` (optional): Specific branch to analyze

### `get_bugs`
Get all bugs for the project.

**Parameters:**
- `projectKey` (optional): Override default project key
- `branch` (optional): Specific branch to analyze

### `get_vulnerabilities`
Get all vulnerabilities for the project.

**Parameters:**
- `projectKey` (optional): Override default project key
- `branch` (optional): Specific branch to analyze

### `get_security_hotspots`
Get all security hotspots for the project.

**Parameters:**
- `projectKey` (optional): Override default project key
- `branch` (optional): Specific branch to analyze

### `get_coverage`
Get code coverage metrics including overall, line, and branch coverage.

**Parameters:**
- `projectKey` (optional): Override default project key
- `branch` (optional): Specific branch to analyze

### `get_metrics`
Get various code quality metrics like complexity, duplications, etc.

**Parameters:**
- `projectKey` (optional): Override default project key
- `metricKeys` (optional): Specific metrics to retrieve
- `branch` (optional): Specific branch to analyze

### `get_project_status`
Get the quality gate status for the project.

**Parameters:**
- `projectKey` (optional): Override default project key
- `branch` (optional): Specific branch to analyze

### `get_components`
Get all components (files) in the project.

**Parameters:**
- `projectKey` (optional): Override default project key
- `branch` (optional): Specific branch to analyze

## Branch-Specific Analysis

The MCP server supports branch-specific analysis by accepting a `branch` parameter in all tool calls. This provides more control and reliability:

- **Explicit Branch Selection**: Specify which branch to analyze using the `branch` parameter
- **Flexible Usage**: Can analyze any branch without switching your working directory
- **Optional Parameter**: If no branch is specified, uses the default branch analysis
- **Clear Feedback**: Tool responses show which branch was analyzed

The server will log which branch parameter is being used:
```
Adding branch parameter: feature/my-branch
```

## Example Usage in Claude Code

### Default Branch Analysis (no branch parameter)
```
Show me all critical bugs in my project
```

```
What's the current code coverage for my project?
```

### Branch-Specific Analysis (with branch parameter)
```
Show me all critical bugs in branch "feature/user-auth"
```

```
What's the current code coverage for branch "develop"?
```

```
Get all code smells in branch "feature/payment-system" and help me prioritize which ones to fix first
```

```
Check the quality gate status for branch "release/v2.0" and tell me what needs to be fixed
```

**Note**: When using branch-specific analysis, make sure your SonarQube server is configured to support branch analysis and that the specified branch has been analyzed.

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building
```bash
npm run build
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

## Troubleshooting

### Common Issues

1. **Authentication Error**: Check your SonarQube token and ensure it has the necessary permissions
2. **Connection Refused**: Verify the SonarQube URL is correct and the server is running
3. **Project Not Found**: Ensure the project key is correct and exists in SonarQube
4. **Permission Denied**: Check that your token has permission to access the project

### Debugging

Enable debug logging by setting the environment variable:
```bash
DEBUG=sonarqube-mcp-server npm run dev
```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request