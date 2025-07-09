#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import { SonarQubeClient } from './sonarqube-client.js';
import { loadConfig, validateConfig } from './config.js';
import * as dotenv from 'dotenv';

dotenv.config();

let config;
try {
  config = loadConfig();
  validateConfig(config);
} catch (error) {
  console.error('Configuration error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const server = new Server({
  name: 'sonarqube-mcp-server',
  version: '1.0.0',
  capabilities: {
    tools: {},
  },
});

const sonarClient = new SonarQubeClient(config);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_issues',
        description: 'Get all issues (bugs, vulnerabilities, code smells) from SonarQube',
        inputSchema: {
          type: 'object',
          properties: {
            projectKey: {
              type: 'string',
              description: 'Project key (optional, uses default if not provided)',
            },
            types: {
              type: 'array',
              items: { type: 'string' },
              description: 'Issue types to filter by (CODE_SMELL, BUG, VULNERABILITY, SECURITY_HOTSPOT)',
            },
            severities: {
              type: 'array',
              items: { type: 'string' },
              description: 'Severities to filter by (INFO, MINOR, MAJOR, CRITICAL, BLOCKER)',
            },
            statuses: {
              type: 'array',
              items: { type: 'string' },
              description: 'Statuses to filter by (OPEN, CONFIRMED, REOPENED, RESOLVED, CLOSED)',
            },
            branch: {
              type: 'string',
              description: 'Git branch to analyze (optional, uses default branch if not provided)',
            },
            pullRequest: {
              type: 'string',
              description: 'Pull request number to analyze (e.g., "636" for PR #636)',
            },
          },
        },
      },
      {
        name: 'get_code_smells',
        description: 'Get code smells from SonarQube',
        inputSchema: {
          type: 'object',
          properties: {
            projectKey: {
              type: 'string',
              description: 'Project key (optional, uses default if not provided)',
            },
            branch: {
              type: 'string',
              description: 'Git branch to analyze (optional, uses default branch if not provided)',
            },
            pullRequest: {
              type: 'string',
              description: 'Pull request number to analyze (e.g., "636" for PR #636)',
            },
          },
        },
      },
      {
        name: 'get_bugs',
        description: 'Get bugs from SonarQube',
        inputSchema: {
          type: 'object',
          properties: {
            projectKey: {
              type: 'string',
              description: 'Project key (optional, uses default if not provided)',
            },
            branch: {
              type: 'string',
              description: 'Git branch to analyze (optional, uses default branch if not provided)',
            },
            pullRequest: {
              type: 'string',
              description: 'Pull request number to analyze (e.g., "636" for PR #636)',
            },
          },
        },
      },
      {
        name: 'get_vulnerabilities',
        description: 'Get vulnerabilities from SonarQube',
        inputSchema: {
          type: 'object',
          properties: {
            projectKey: {
              type: 'string',
              description: 'Project key (optional, uses default if not provided)',
            },
            branch: {
              type: 'string',
              description: 'Git branch to analyze (optional, uses default branch if not provided)',
            },
            pullRequest: {
              type: 'string',
              description: 'Pull request number to analyze (e.g., "636" for PR #636)',
            },
          },
        },
      },
      {
        name: 'get_security_hotspots',
        description: 'Get security hotspots from SonarQube',
        inputSchema: {
          type: 'object',
          properties: {
            projectKey: {
              type: 'string',
              description: 'Project key (optional, uses default if not provided)',
            },
            branch: {
              type: 'string',
              description: 'Git branch to analyze (optional, uses default branch if not provided)',
            },
            pullRequest: {
              type: 'string',
              description: 'Pull request number to analyze (e.g., "636" for PR #636)',
            },
          },
        },
      },
      {
        name: 'get_coverage',
        description: 'Get code coverage metrics from SonarQube',
        inputSchema: {
          type: 'object',
          properties: {
            projectKey: {
              type: 'string',
              description: 'Project key (optional, uses default if not provided)',
            },
            branch: {
              type: 'string',
              description: 'Git branch to analyze (optional, uses default branch if not provided)',
            },
            pullRequest: {
              type: 'string',
              description: 'Pull request number to analyze (e.g., "636" for PR #636)',
            },
          },
        },
      },
      {
        name: 'get_metrics',
        description: 'Get various metrics from SonarQube (complexity, duplications, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            projectKey: {
              type: 'string',
              description: 'Project key (optional, uses default if not provided)',
            },
            metricKeys: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific metrics to retrieve (optional)',
            },
            branch: {
              type: 'string',
              description: 'Git branch to analyze (optional, uses default branch if not provided)',
            },
            pullRequest: {
              type: 'string',
              description: 'Pull request number to analyze (e.g., "636" for PR #636)',
            },
          },
        },
      },
      {
        name: 'get_project_status',
        description: 'Get quality gate status for the project',
        inputSchema: {
          type: 'object',
          properties: {
            projectKey: {
              type: 'string',
              description: 'Project key (optional, uses default if not provided)',
            },
            branch: {
              type: 'string',
              description: 'Git branch to analyze (optional, uses default branch if not provided)',
            },
            pullRequest: {
              type: 'string',
              description: 'Pull request number to analyze (e.g., "636" for PR #636)',
            },
          },
        },
      },
      {
        name: 'get_components',
        description: 'Get project components (files) from SonarQube',
        inputSchema: {
          type: 'object',
          properties: {
            projectKey: {
              type: 'string',
              description: 'Project key (optional, uses default if not provided)',
            },
            branch: {
              type: 'string',
              description: 'Git branch to analyze (optional, uses default branch if not provided)',
            },
            pullRequest: {
              type: 'string',
              description: 'Pull request number to analyze (e.g., "636" for PR #636)',
            },
          },
        },
      },
      {
        name: 'get_branches',
        description: 'List all available branches in SonarQube for the project (debugging tool)',
        inputSchema: {
          type: 'object',
          properties: {
            projectKey: {
              type: 'string',
              description: 'Project key (optional, uses default if not provided)',
            },
          },
        },
      },
      {
        name: 'get_pull_requests',
        description: 'List all available pull requests in SonarQube for the project (debugging tool)',
        inputSchema: {
          type: 'object',
          properties: {
            projectKey: {
              type: 'string',
              description: 'Project key (optional, uses default if not provided)',
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_issues': {
        const issues = await sonarClient.getIssues(
          args?.projectKey as string,
          args?.types as string[],
          args?.severities as string[],
          args?.statuses as string[],
          args?.branch as string,
          args?.pullRequest as string
        );
        return {
          content: [
            {
              type: 'text',
              text: `Found ${issues.length} issues${args?.branch ? ` (Branch: ${args.branch})` : ''}:\n\n${issues.map(issue => 
                `**${issue.severity}** - ${issue.type}\n` +
                `Rule: ${issue.rule}\n` +
                `Component: ${issue.component}\n` +
                `Line: ${issue.line || 'N/A'}\n` +
                `Message: ${issue.message}\n` +
                `Status: ${issue.status}\n` +
                `Created: ${new Date(issue.creationDate).toLocaleDateString()}\n`
              ).join('\n---\n')}`,
            },
          ],
        };
      }

      case 'get_code_smells': {
        const codeSmells = await sonarClient.getCodeSmells(args?.projectKey as string, args?.branch as string, args?.pullRequest as string);
        return {
          content: [
            {
              type: 'text',
              text: `Found ${codeSmells.length} code smells:\n\n${codeSmells.map(issue => 
                `**${issue.severity}** - ${issue.component}:${issue.line || 'N/A'}\n` +
                `Rule: ${issue.rule}\n` +
                `Message: ${issue.message}\n` +
                `Status: ${issue.status}\n`
              ).join('\n---\n')}`,
            },
          ],
        };
      }

      case 'get_bugs': {
        const bugs = await sonarClient.getBugs(args?.projectKey as string, args?.branch as string, args?.pullRequest as string);
        return {
          content: [
            {
              type: 'text',
              text: `Found ${bugs.length} bugs:\n\n${bugs.map(issue => 
                `**${issue.severity}** - ${issue.component}:${issue.line || 'N/A'}\n` +
                `Rule: ${issue.rule}\n` +
                `Message: ${issue.message}\n` +
                `Status: ${issue.status}\n`
              ).join('\n---\n')}`,
            },
          ],
        };
      }

      case 'get_vulnerabilities': {
        const vulnerabilities = await sonarClient.getVulnerabilities(args?.projectKey as string, args?.branch as string, args?.pullRequest as string);
        return {
          content: [
            {
              type: 'text',
              text: `Found ${vulnerabilities.length} vulnerabilities:\n\n${vulnerabilities.map(issue => 
                `**${issue.severity}** - ${issue.component}:${issue.line || 'N/A'}\n` +
                `Rule: ${issue.rule}\n` +
                `Message: ${issue.message}\n` +
                `Status: ${issue.status}\n`
              ).join('\n---\n')}`,
            },
          ],
        };
      }

      case 'get_security_hotspots': {
        const hotspots = await sonarClient.getSecurityHotspots(args?.projectKey as string, args?.branch as string, args?.pullRequest as string);
        return {
          content: [
            {
              type: 'text',
              text: `Found ${hotspots.length} security hotspots:\n\n${hotspots.map(issue => 
                `**${issue.severity}** - ${issue.component}:${issue.line || 'N/A'}\n` +
                `Rule: ${issue.rule}\n` +
                `Message: ${issue.message}\n` +
                `Status: ${issue.status}\n`
              ).join('\n---\n')}`,
            },
          ],
        };
      }

      case 'get_coverage': {
        const coverage = await sonarClient.getCoverage(args?.projectKey as string, args?.branch as string, args?.pullRequest as string);
        return {
          content: [
            {
              type: 'text',
              text: `Coverage Report for ${coverage.component}${args?.branch ? ` (Branch: ${args.branch})` : ''}:\n\n` +
                `Overall Coverage: ${coverage.coverage.toFixed(2)}%\n` +
                `Line Coverage: ${coverage.lineCoverage.toFixed(2)}%\n` +
                `Branch Coverage: ${coverage.branchCoverage.toFixed(2)}%\n` +
                `Uncovered Lines: ${coverage.uncoveredLines}\n` +
                `Uncovered Conditions: ${coverage.uncoveredConditions}`,
            },
          ],
        };
      }

      case 'get_metrics': {
        const metrics = await sonarClient.getMetrics(args?.projectKey as string, args?.metricKeys as string[], args?.branch as string, args?.pullRequest as string);
        return {
          content: [
            {
              type: 'text',
              text: `Metrics for ${metrics.component.key}:\n\n${metrics.component.measures?.map(metric => 
                `**${metric.metric}**: ${metric.value}${metric.periods ? ` (Period: ${metric.periods[0]?.value})` : ''}`
              ).join('\n') || 'No metrics available'}`,
            },
          ],
        };
      }

      case 'get_project_status': {
        const status = await sonarClient.getProjectStatus(args?.projectKey as string, args?.branch as string, args?.pullRequest as string);
        return {
          content: [
            {
              type: 'text',
              text: `Project Status:\n\n` +
                `Quality Gate: ${status.projectStatus.status}\n` +
                `Conditions:\n${status.projectStatus.conditions?.map((condition: any) => 
                  `- ${condition.metricKey}: ${condition.actualValue} (${condition.status})`
                ).join('\n') || 'No conditions'}`,
            },
          ],
        };
      }

      case 'get_components': {
        const components = await sonarClient.getComponents(args?.projectKey as string, args?.branch as string, args?.pullRequest as string);
        return {
          content: [
            {
              type: 'text',
              text: `Project Components (${components.components.length} files):\n\n${components.components.map((comp: any) => 
                `**${comp.name}** (${comp.qualifier})\n` +
                `Key: ${comp.key}\n` +
                `Path: ${comp.path}\n`
              ).join('\n---\n')}`,
            },
          ],
        };
      }

      case 'get_branches': {
        const branches = await sonarClient.getBranches(args?.projectKey as string);
        return {
          content: [
            {
              type: 'text',
              text: `Available Branches:\n\n${branches.branches?.map((branch: any) => 
                `**${branch.name}** (${branch.type})\n` +
                `Status: ${branch.status?.qualityGateStatus || 'N/A'}\n` +
                `Main: ${branch.isMain ? 'Yes' : 'No'}\n` +
                `Last Analysis: ${branch.analysisDate ? new Date(branch.analysisDate).toLocaleDateString() : 'Never'}\n`
              ).join('\n---\n') || 'No branches found'}`,
            },
          ],
        };
      }

      case 'get_pull_requests': {
        const pullRequests = await sonarClient.getPullRequests(args?.projectKey as string);
        return {
          content: [
            {
              type: 'text',
              text: `Available Pull Requests:\n\n${pullRequests.pullRequests?.map((pr: any) => 
                `**PR #${pr.key}** - ${pr.title}\n` +
                `Branch: ${pr.branch}\n` +
                `Base: ${pr.base}\n` +
                `Status: ${pr.status?.qualityGateStatus || 'N/A'}\n` +
                `Last Analysis: ${pr.analysisDate ? new Date(pr.analysisDate).toLocaleDateString() : 'Never'}\n`
              ).join('\n---\n') || 'No pull requests found'}`,
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    throw new McpError(
      ErrorCode.InternalError,
      `Error calling SonarQube API: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('SonarQube MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});