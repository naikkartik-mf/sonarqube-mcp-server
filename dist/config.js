export function loadConfig() {
    const config = {
        url: process.env.SONARQUBE_URL || 'http://localhost:9000',
        token: process.env.SONARQUBE_TOKEN || '',
        projectKey: process.env.SONARQUBE_PROJECT_KEY || ''
    };
    if (!config.token) {
        throw new Error('SONARQUBE_TOKEN environment variable is required');
    }
    if (!config.projectKey) {
        console.warn('SONARQUBE_PROJECT_KEY not set - project key will need to be provided in tool calls');
    }
    return config;
}
export function validateConfig(config) {
    if (!config.url) {
        throw new Error('SonarQube URL is required');
    }
    if (!config.token) {
        throw new Error('SonarQube token is required');
    }
    try {
        new URL(config.url);
    }
    catch (error) {
        throw new Error(`Invalid SonarQube URL: ${config.url}`);
    }
}
//# sourceMappingURL=config.js.map