import { execSync } from 'child_process';
export function getCurrentBranch(workingDir) {
    const searchDirs = [
        workingDir || process.cwd(),
        process.env.PWD,
        process.env.INIT_CWD,
        process.cwd()
    ].filter(Boolean);
    for (const dir of searchDirs) {
        try {
            const branch = execSync('git rev-parse --abbrev-ref HEAD', {
                encoding: 'utf8',
                cwd: dir,
                stdio: ['pipe', 'pipe', 'pipe']
            }).trim();
            // If we're in detached HEAD state, branch will be 'HEAD'
            if (branch === 'HEAD') {
                continue;
            }
            console.error(`Found git branch: ${branch} in ${dir}`);
            return branch;
        }
        catch (error) {
            // Try next directory
            continue;
        }
    }
    console.warn('Could not detect git branch in any directory');
    return null;
}
export function getRepositoryRoot() {
    try {
        const repoRoot = execSync('git rev-parse --show-toplevel', {
            encoding: 'utf8',
            cwd: process.cwd(),
            stdio: ['pipe', 'pipe', 'pipe']
        }).trim();
        return repoRoot;
    }
    catch (error) {
        console.warn('Could not detect git repository root:', error instanceof Error ? error.message : String(error));
        return null;
    }
}
export function isGitRepository(workingDir) {
    const searchDirs = [
        workingDir || process.cwd(),
        process.env.PWD,
        process.env.INIT_CWD,
        process.cwd()
    ].filter(Boolean);
    for (const dir of searchDirs) {
        try {
            execSync('git rev-parse --git-dir', {
                stdio: ['pipe', 'pipe', 'pipe'],
                cwd: dir
            });
            return true;
        }
        catch (error) {
            continue;
        }
    }
    return false;
}
//# sourceMappingURL=git-utils.js.map