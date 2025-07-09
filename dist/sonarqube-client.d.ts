import { SonarQubeConfig, SonarQubeIssue, SonarQubeMetrics, SonarQubeCoverage } from './types.js';
export declare class SonarQubeClient {
    private client;
    private config;
    constructor(config: SonarQubeConfig);
    private addBranchToParams;
    getIssues(projectKey?: string, types?: string[], severities?: string[], statuses?: string[], branch?: string, pullRequest?: string): Promise<SonarQubeIssue[]>;
    getCodeSmells(projectKey?: string, branch?: string, pullRequest?: string): Promise<SonarQubeIssue[]>;
    getBugs(projectKey?: string, branch?: string, pullRequest?: string): Promise<SonarQubeIssue[]>;
    getVulnerabilities(projectKey?: string, branch?: string, pullRequest?: string): Promise<SonarQubeIssue[]>;
    getSecurityHotspots(projectKey?: string, branch?: string, pullRequest?: string): Promise<SonarQubeIssue[]>;
    getMetrics(projectKey?: string, metricKeys?: string[], branch?: string, pullRequest?: string): Promise<SonarQubeMetrics>;
    getCoverage(projectKey?: string, branch?: string, pullRequest?: string): Promise<SonarQubeCoverage>;
    getProjectStatus(projectKey?: string, branch?: string, pullRequest?: string): Promise<any>;
    getComponents(projectKey?: string, branch?: string, pullRequest?: string): Promise<any>;
    getBranches(projectKey?: string): Promise<any>;
    getPullRequests(projectKey?: string): Promise<any>;
}
//# sourceMappingURL=sonarqube-client.d.ts.map