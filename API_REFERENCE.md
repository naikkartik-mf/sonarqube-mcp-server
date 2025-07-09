# SonarQube MCP Server - API Reference

## Tool Definitions

### Core Analysis Tools

#### `get_issues`
**Description**: Get all issues with optional filtering capabilities
**Parameters**:
```typescript
{
  projectKey?: string;     // Project key (optional, uses default if not provided)
  types?: string[];        // Issue types: CODE_SMELL, BUG, VULNERABILITY, SECURITY_HOTSPOT
  severities?: string[];   // Severities: INFO, MINOR, MAJOR, CRITICAL, BLOCKER
  statuses?: string[];     // Statuses: OPEN, CONFIRMED, REOPENED, RESOLVED, CLOSED
  branch?: string;         // Git branch to analyze
  pullRequest?: string;    // Pull request number (e.g., "636")
}
```
**Response Format**:
```
Found {count} issues {branch info}:

**{SEVERITY}** - {TYPE}
Rule: {rule_key}
Component: {file_path}
Line: {line_number}
Message: {issue_description}
Status: {status}
Created: {date}
---
{additional_issues}
```

#### `get_code_smells`
**Description**: Get code smell issues specifically
**Parameters**:
```typescript
{
  projectKey?: string;
  branch?: string;
  pullRequest?: string;
}
```
**Response Format**:
```
Found {count} code smells:

**{SEVERITY}** - {component}:{line}
Rule: {rule_key}
Message: {message}
Status: {status}
---
{additional_smells}
```

#### `get_bugs`
**Description**: Get bug issues specifically
**Parameters**:
```typescript
{
  projectKey?: string;
  branch?: string;
  pullRequest?: string;
}
```
**Response Format**:
```
Found {count} bugs:

**{SEVERITY}** - {component}:{line}
Rule: {rule_key}
Message: {message}
Status: {status}
---
{additional_bugs}
```

#### `get_vulnerabilities`
**Description**: Get vulnerability issues specifically
**Parameters**:
```typescript
{
  projectKey?: string;
  branch?: string;
  pullRequest?: string;
}
```
**Response Format**:
```
Found {count} vulnerabilities:

**{SEVERITY}** - {component}:{line}
Rule: {rule_key}
Message: {message}
Status: {status}
---
{additional_vulnerabilities}
```

#### `get_security_hotspots`
**Description**: Get security hotspot issues specifically
**Parameters**:
```typescript
{
  projectKey?: string;
  branch?: string;
  pullRequest?: string;
}
```
**Response Format**:
```
Found {count} security hotspots:

**{SEVERITY}** - {component}:{line}
Rule: {rule_key}
Message: {message}
Status: {status}
---
{additional_hotspots}
```

### Metrics and Coverage Tools

#### `get_coverage`
**Description**: Get code coverage metrics
**Parameters**:
```typescript
{
  projectKey?: string;
  branch?: string;
  pullRequest?: string;
}
```
**Response Format**:
```
Coverage Report for {project} {branch info}:

Overall Coverage: {percentage}%
Line Coverage: {percentage}%
Branch Coverage: {percentage}%
Uncovered Lines: {count}
Uncovered Conditions: {count}
```

#### `get_metrics`
**Description**: Get various quality metrics
**Parameters**:
```typescript
{
  projectKey?: string;
  metricKeys?: string[];   // Specific metrics to retrieve
  branch?: string;
  pullRequest?: string;
}
```
**Available Metric Keys**:
- `coverage` - Code coverage percentage
- `line_coverage` - Line coverage percentage
- `branch_coverage` - Branch coverage percentage
- `uncovered_lines` - Number of uncovered lines
- `uncovered_conditions` - Number of uncovered conditions
- `ncloc` - Number of lines of code
- `complexity` - Cyclomatic complexity
- `cognitive_complexity` - Cognitive complexity
- `duplicated_lines_density` - Duplicated lines percentage
- `sqale_index` - Technical debt in minutes
- `reliability_rating` - Reliability rating (A-E)
- `security_rating` - Security rating (A-E)
- `sqale_rating` - Maintainability rating (A-E)

**Response Format**:
```
Metrics for {project}:

**{metric_key}**: {value} (Period: {period_value})
**{metric_key}**: {value}
...
```

### Quality and Project Tools

#### `get_project_status`
**Description**: Get quality gate status
**Parameters**:
```typescript
{
  projectKey?: string;
  branch?: string;
  pullRequest?: string;
}
```
**Response Format**:
```
Project Status:

Quality Gate: {PASSED/FAILED/ERROR}
Conditions:
- {metric_key}: {actual_value} ({PASSED/FAILED})
- {metric_key}: {actual_value} ({PASSED/FAILED})
...
```

#### `get_components`
**Description**: Get project components (files)
**Parameters**:
```typescript
{
  projectKey?: string;
  branch?: string;
  pullRequest?: string;
}
```
**Response Format**:
```
Project Components ({count} files):

**{file_name}** ({qualifier})
Key: {component_key}
Path: {file_path}
---
{additional_components}
```

### Debug and Discovery Tools

#### `get_branches`
**Description**: List all available branches (debugging tool)
**Parameters**:
```typescript
{
  projectKey?: string;
}
```
**Response Format**:
```
Available Branches:

**{branch_name}** ({type})
Status: {quality_gate_status}
Main: {Yes/No}
Last Analysis: {date}
---
{additional_branches}
```

#### `get_pull_requests`
**Description**: List all available pull requests (debugging tool)
**Parameters**:
```typescript
{
  projectKey?: string;
}
```
**Response Format**:
```
Available Pull Requests:

**PR #{key}** - {title}
Branch: {source_branch}
Base: {target_branch}
Status: {quality_gate_status}
Last Analysis: {date}
---
{additional_prs}
```

## SonarQube API Endpoints Used

### Issue Management
- `GET /api/issues/search` - Search for issues
  - Parameters: `componentKeys`, `types`, `severities`, `statuses`, `branch`, `pullRequest`
  - Used by: `get_issues`, `get_code_smells`, `get_bugs`, `get_vulnerabilities`, `get_security_hotspots`

### Metrics and Coverage
- `GET /api/measures/component` - Get component metrics
  - Parameters: `component`, `metricKeys`, `branch`, `pullRequest`
  - Used by: `get_metrics`, `get_coverage`

### Quality Gates
- `GET /api/qualitygates/project_status` - Get quality gate status
  - Parameters: `projectKey`, `branch`, `pullRequest`
  - Used by: `get_project_status`

### Project Structure
- `GET /api/components/tree` - Get project components
  - Parameters: `component`, `qualifiers`, `branch`, `pullRequest`
  - Used by: `get_components`

### Branch Management
- `GET /api/project_branches/list` - List project branches
  - Parameters: `project`
  - Used by: `get_branches`

### Pull Request Management
- `GET /api/project_pull_requests/list` - List project pull requests
  - Parameters: `project`
  - Used by: `get_pull_requests`

## Error Responses

### Authentication Errors
```json
{
  "error": {
    "code": -32603,
    "message": "MCP error -32603: Error calling SonarQube API: Authentication failed. Please check your SonarQube token."
  }
}
```

### Authorization Errors
```json
{
  "error": {
    "code": -32603,
    "message": "MCP error -32603: Error calling SonarQube API: Access denied. Please check your permissions."
  }
}
```

### Resource Not Found
```json
{
  "error": {
    "code": -32603,
    "message": "MCP error -32603: Error calling SonarQube API: Resource not found. Please check your project key."
  }
}
```

### Connection Errors
```json
{
  "error": {
    "code": -32603,
    "message": "MCP error -32603: Error calling SonarQube API: Cannot connect to SonarQube server at {url}. Please check the URL and ensure the server is running."
  }
}
```

### Invalid Tool
```json
{
  "error": {
    "code": -32601,
    "message": "Unknown tool: {tool_name}"
  }
}
```

## Parameter Validation Rules

### Project Key
- Optional for all tools
- Falls back to `SONARQUBE_PROJECT_KEY` environment variable
- Must be a valid SonarQube project key format

### Branch Parameter
- Optional string parameter
- Used for branch-specific analysis
- Mutually exclusive with `pullRequest`

### Pull Request Parameter
- Optional string parameter
- Should be numeric (e.g., "636", "1234")
- Used for PR-specific analysis
- Mutually exclusive with `branch`

### Issue Type Filtering
Valid values for `types` parameter:
- `CODE_SMELL`
- `BUG`
- `VULNERABILITY`
- `SECURITY_HOTSPOT`

### Severity Filtering
Valid values for `severities` parameter:
- `INFO`
- `MINOR`
- `MAJOR`
- `CRITICAL`
- `BLOCKER`

### Status Filtering
Valid values for `statuses` parameter:
- `OPEN`
- `CONFIRMED`
- `REOPENED`
- `RESOLVED`
- `CLOSED`

## Rate Limiting and Performance

### Current Limitations
- No built-in rate limiting
- No response caching
- Fixed page size of 500 items
- Synchronous API calls

### Performance Characteristics
- Typical response time: 200-500ms
- Memory usage: ~50MB + response data
- Network dependent latency
- CPU usage: Low (I/O bound)

### Best Practices
- Use specific filters to reduce response size
- Avoid frequent polling
- Cache results when possible
- Use debug tools sparingly

## Usage Examples

### Basic Issue Analysis
```javascript
// Get all critical issues
{
  "tool": "get_issues",
  "parameters": {
    "severities": ["CRITICAL", "BLOCKER"]
  }
}

// Get code smells for specific branch
{
  "tool": "get_code_smells",
  "parameters": {
    "branch": "feature/new-feature"
  }
}

// Get vulnerabilities for pull request
{
  "tool": "get_vulnerabilities",
  "parameters": {
    "pullRequest": "636"
  }
}
```

### Coverage and Metrics
```javascript
// Get coverage report
{
  "tool": "get_coverage",
  "parameters": {
    "branch": "develop"
  }
}

// Get specific metrics
{
  "tool": "get_metrics",
  "parameters": {
    "metricKeys": ["coverage", "complexity", "duplicated_lines_density"]
  }
}
```

### Quality Gate Analysis
```javascript
// Check quality gate status
{
  "tool": "get_project_status",
  "parameters": {
    "pullRequest": "636"
  }
}
```

### Discovery and Debugging
```javascript
// List available branches
{
  "tool": "get_branches",
  "parameters": {}
}

// List available pull requests
{
  "tool": "get_pull_requests",
  "parameters": {}
}
```

This API reference provides comprehensive documentation for all available tools, parameters, and expected responses.