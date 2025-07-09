import axios from 'axios';
export class SonarQubeClient {
    client;
    config;
    constructor(config) {
        this.config = config;
        this.client = axios.create({
            baseURL: `${config.url}/api`,
            auth: {
                username: config.token,
                password: ''
            },
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        this.client.interceptors.response.use((response) => response, (error) => {
            if (error.response?.status === 401) {
                throw new Error('Authentication failed. Please check your SonarQube token.');
            }
            if (error.response?.status === 403) {
                throw new Error('Access denied. Please check your permissions.');
            }
            if (error.response?.status === 404) {
                throw new Error('Resource not found. Please check your project key.');
            }
            if (error.code === 'ECONNREFUSED') {
                throw new Error(`Cannot connect to SonarQube server at ${this.config.url}. Please check the URL and ensure the server is running.`);
            }
            throw new Error(`SonarQube API error: ${error.message}`);
        });
    }
    addBranchToParams(params, branch) {
        if (branch) {
            // Check if it's a pull request (starts with PR- or is numeric)
            if (branch.startsWith('PR-') || /^\d+$/.test(branch)) {
                const prKey = branch.startsWith('PR-') ? branch.substring(3) : branch;
                params.pullRequest = prKey;
                console.error(`Adding pullRequest parameter: ${prKey}`);
            }
            else {
                params.branch = branch;
                console.error(`Adding branch parameter: ${branch}`);
            }
        }
        return params;
    }
    async getIssues(projectKey, types, severities, statuses, branch, pullRequest) {
        const key = projectKey || this.config.projectKey;
        if (!key) {
            throw new Error('Project key is required. Please provide it as a parameter or set SONARQUBE_PROJECT_KEY environment variable.');
        }
        let params = {
            componentKeys: key,
            ps: 500 // page size
        };
        if (types && types.length > 0) {
            params.types = types.join(',');
        }
        if (severities && severities.length > 0) {
            params.severities = severities.join(',');
        }
        if (statuses && statuses.length > 0) {
            params.statuses = statuses.join(',');
        }
        // Add branch or PR parameter
        if (pullRequest) {
            params.pullRequest = pullRequest;
            console.error(`Adding pullRequest parameter: ${pullRequest}`);
        }
        else if (branch) {
            params.branch = branch;
            console.error(`Adding branch parameter: ${branch}`);
        }
        try {
            const response = await this.client.get('/issues/search', { params });
            return response.data.issues;
        }
        catch (error) {
            throw new Error(`Failed to fetch issues: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async getCodeSmells(projectKey, branch, pullRequest) {
        return this.getIssues(projectKey, ['CODE_SMELL'], undefined, undefined, branch, pullRequest);
    }
    async getBugs(projectKey, branch, pullRequest) {
        return this.getIssues(projectKey, ['BUG'], undefined, undefined, branch, pullRequest);
    }
    async getVulnerabilities(projectKey, branch, pullRequest) {
        return this.getIssues(projectKey, ['VULNERABILITY'], undefined, undefined, branch, pullRequest);
    }
    async getSecurityHotspots(projectKey, branch, pullRequest) {
        return this.getIssues(projectKey, ['SECURITY_HOTSPOT'], undefined, undefined, branch, pullRequest);
    }
    async getMetrics(projectKey, metricKeys, branch, pullRequest) {
        let params = {
            component: projectKey || this.config.projectKey
        };
        if (metricKeys && metricKeys.length > 0) {
            params.metricKeys = metricKeys.join(',');
        }
        else {
            params.metricKeys = [
                'coverage',
                'line_coverage',
                'branch_coverage',
                'uncovered_lines',
                'uncovered_conditions',
                'ncloc',
                'complexity',
                'cognitive_complexity',
                'duplicated_lines_density',
                'sqale_index',
                'reliability_rating',
                'security_rating',
                'sqale_rating'
            ].join(',');
        }
        // Add branch or PR parameter
        if (pullRequest) {
            params.pullRequest = pullRequest;
            console.error(`Adding pullRequest parameter: ${pullRequest}`);
        }
        else if (branch) {
            params.branch = branch;
            console.error(`Adding branch parameter: ${branch}`);
        }
        const response = await this.client.get('/measures/component', { params });
        return response.data;
    }
    async getCoverage(projectKey, branch, pullRequest) {
        const metrics = await this.getMetrics(projectKey, [
            'coverage',
            'line_coverage',
            'branch_coverage',
            'uncovered_lines',
            'uncovered_conditions'
        ], branch, pullRequest);
        const getMetricValue = (metricKey) => {
            const metric = metrics.component.measures?.find(m => m.metric === metricKey);
            return metric ? parseFloat(metric.value) : 0;
        };
        return {
            component: metrics.component.key,
            coverage: getMetricValue('coverage'),
            lineCoverage: getMetricValue('line_coverage'),
            branchCoverage: getMetricValue('branch_coverage'),
            uncoveredLines: getMetricValue('uncovered_lines'),
            uncoveredConditions: getMetricValue('uncovered_conditions')
        };
    }
    async getProjectStatus(projectKey, branch, pullRequest) {
        let params = {
            projectKey: projectKey || this.config.projectKey
        };
        // Add branch or PR parameter
        if (pullRequest) {
            params.pullRequest = pullRequest;
            console.error(`Adding pullRequest parameter: ${pullRequest}`);
        }
        else if (branch) {
            params.branch = branch;
            console.error(`Adding branch parameter: ${branch}`);
        }
        const response = await this.client.get('/qualitygates/project_status', { params });
        return response.data;
    }
    async getComponents(projectKey, branch, pullRequest) {
        let params = {
            component: projectKey || this.config.projectKey,
            qualifiers: 'FIL',
            ps: 500
        };
        // Add branch or PR parameter
        if (pullRequest) {
            params.pullRequest = pullRequest;
            console.error(`Adding pullRequest parameter: ${pullRequest}`);
        }
        else if (branch) {
            params.branch = branch;
            console.error(`Adding branch parameter: ${branch}`);
        }
        const response = await this.client.get('/components/tree', { params });
        return response.data;
    }
    async getBranches(projectKey) {
        try {
            const response = await this.client.get('/project_branches/list', {
                params: {
                    project: projectKey || this.config.projectKey
                }
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch branches: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async getPullRequests(projectKey) {
        try {
            const response = await this.client.get('/project_pull_requests/list', {
                params: {
                    project: projectKey || this.config.projectKey
                }
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch pull requests: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
//# sourceMappingURL=sonarqube-client.js.map