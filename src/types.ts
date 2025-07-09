export interface SonarQubeConfig {
  url: string;
  token: string;
  projectKey: string;
}

export interface SonarQubeIssue {
  key: string;
  rule: string;
  severity: 'INFO' | 'MINOR' | 'MAJOR' | 'CRITICAL' | 'BLOCKER';
  component: string;
  project: string;
  line?: number;
  hash?: string;
  textRange?: {
    startLine: number;
    endLine: number;
    startOffset: number;
    endOffset: number;
  };
  flows?: any[];
  status: 'OPEN' | 'CONFIRMED' | 'REOPENED' | 'RESOLVED' | 'CLOSED';
  message: string;
  effort?: string;
  debt?: string;
  tags?: string[];
  creationDate: string;
  updateDate: string;
  type: 'CODE_SMELL' | 'BUG' | 'VULNERABILITY' | 'SECURITY_HOTSPOT';
}

export interface SonarQubeMetrics {
  component: {
    key: string;
    name: string;
    qualifier: string;
    measures?: Array<{
      metric: string;
      value: string;
      periods?: Array<{
        index: number;
        value: string;
      }>;
    }>;
  };
}

export interface SonarQubeCoverage {
  component: string;
  coverage: number;
  lineCoverage: number;
  branchCoverage: number;
  uncoveredLines: number;
  uncoveredConditions: number;
}

export interface SonarQubeSearchResponse {
  total: number;
  p: number;
  ps: number;
  paging: {
    pageIndex: number;
    pageSize: number;
    total: number;
  };
  effortTotal: number;
  issues: SonarQubeIssue[];
  components: any[];
  rules: any[];
  users: any[];
  languages: any[];
  facets: any[];
}