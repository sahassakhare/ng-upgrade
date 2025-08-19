"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckpointManager = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const uuid_1 = require("uuid");
class CheckpointManager {
    projectPath;
    checkpointsDir;
    metadataFile;
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.checkpointsDir = path.join(projectPath, '.ng-upgrade', 'checkpoints');
        this.metadataFile = path.join(projectPath, '.ng-upgrade', 'checkpoints.json');
    }
    /**
     * Initialize checkpoint management system
     */
    async initialize() {
        await fs.ensureDir(this.checkpointsDir);
        if (!await fs.pathExists(this.metadataFile)) {
            await fs.writeJson(this.metadataFile, { checkpoints: [] }, { spaces: 2 });
        }
    }
    /**
     * Create a new checkpoint
     */
    async createCheckpoint(id, description) {
        await this.initialize();
        const timestamp = new Date();
        const checkpointId = id || (0, uuid_1.v4)();
        const checkpointPath = path.join(this.checkpointsDir, checkpointId);
        // Create checkpoint directory
        await fs.ensureDir(checkpointPath);
        // Copy project files (excluding node_modules and other build artifacts)
        await this.copyProjectFiles(checkpointPath);
        // Generate metadata
        const metadata = await this.generateCheckpointMetadata();
        const checkpoint = {
            id: checkpointId,
            version: await this.getCurrentAngularVersion(),
            timestamp,
            description,
            path: checkpointPath,
            metadata
        };
        // Save checkpoint metadata
        await this.saveCheckpointMetadata(checkpoint);
        return checkpoint;
    }
    /**
     * Restore from a checkpoint
     */
    async restoreFromCheckpoint(checkpointId) {
        const checkpoint = await this.getCheckpoint(checkpointId);
        if (!checkpoint) {
            throw new Error(`Checkpoint ${checkpointId} not found`);
        }
        // Backup current state before restoration
        await this.createCheckpoint('pre-restore', `Before restoring to ${checkpoint.id}`);
        // Restore project files
        await this.restoreProjectFiles(checkpoint.path);
        // Restore package.json and dependencies
        await this.restoreDependencies(checkpoint.path);
    }
    /**
     * List all available checkpoints
     */
    async listCheckpoints() {
        await this.initialize();
        try {
            const metadata = await fs.readJson(this.metadataFile);
            return metadata.checkpoints || [];
        }
        catch (error) {
            return [];
        }
    }
    /**
     * Get specific checkpoint
     */
    async getCheckpoint(checkpointId) {
        const checkpoints = await this.listCheckpoints();
        return checkpoints.find(cp => cp.id === checkpointId) || null;
    }
    /**
     * Delete a checkpoint
     */
    async deleteCheckpoint(checkpointId) {
        const checkpoint = await this.getCheckpoint(checkpointId);
        if (!checkpoint) {
            throw new Error(`Checkpoint ${checkpointId} not found`);
        }
        // Remove checkpoint directory
        await fs.remove(checkpoint.path);
        // Remove from metadata
        const metadata = await fs.readJson(this.metadataFile);
        metadata.checkpoints = metadata.checkpoints.filter((cp) => cp.id !== checkpointId);
        await fs.writeJson(this.metadataFile, metadata, { spaces: 2 });
    }
    /**
     * Clean up old checkpoints (keep only last N)
     */
    async cleanupOldCheckpoints(keepCount = 5) {
        const checkpoints = await this.listCheckpoints();
        if (checkpoints.length <= keepCount) {
            return;
        }
        // Sort by timestamp (newest first)
        checkpoints.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        // Delete old checkpoints
        const toDelete = checkpoints.slice(keepCount);
        for (const checkpoint of toDelete) {
            await this.deleteCheckpoint(checkpoint.id);
        }
    }
    /**
     * Get checkpoint size information
     */
    async getCheckpointSize(checkpointId) {
        const checkpoint = await this.getCheckpoint(checkpointId);
        if (!checkpoint) {
            return 0;
        }
        return this.getDirectorySize(checkpoint.path);
    }
    /**
     * Validate checkpoint integrity
     */
    async validateCheckpoint(checkpointId) {
        const checkpoint = await this.getCheckpoint(checkpointId);
        if (!checkpoint) {
            return { valid: false, errors: ['Checkpoint not found'] };
        }
        const errors = [];
        // Check if checkpoint directory exists
        if (!await fs.pathExists(checkpoint.path)) {
            errors.push('Checkpoint directory not found');
        }
        // Check if essential files exist
        const essentialFiles = ['package.json', 'angular.json', 'tsconfig.json'];
        for (const file of essentialFiles) {
            const filePath = path.join(checkpoint.path, file);
            if (!await fs.pathExists(filePath)) {
                errors.push(`Essential file missing: ${file}`);
            }
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
    /**
     * Copy project files to checkpoint directory
     */
    async copyProjectFiles(checkpointPath) {
        const excludePatterns = [
            'node_modules',
            'dist',
            '.angular',
            '.ng-upgrade',
            'coverage',
            '.nyc_output',
            '*.log',
            '.DS_Store',
            'Thumbs.db'
        ];
        // Copy all files except excluded patterns
        const files = await fs.readdir(this.projectPath);
        for (const file of files) {
            if (!this.shouldExcludeFile(file, excludePatterns)) {
                const sourcePath = path.join(this.projectPath, file);
                const destPath = path.join(checkpointPath, file);
                const stat = await fs.stat(sourcePath);
                if (stat.isDirectory()) {
                    await fs.copy(sourcePath, destPath, {
                        filter: (src) => {
                            const relativePath = path.relative(this.projectPath, src);
                            return !this.shouldExcludeFile(relativePath, excludePatterns);
                        }
                    });
                }
                else {
                    await fs.copy(sourcePath, destPath);
                }
            }
        }
    }
    /**
     * Restore project files from checkpoint
     */
    async restoreProjectFiles(checkpointPath) {
        const excludePatterns = ['node_modules', '.ng-upgrade'];
        // Get current files that should be removed
        const currentFiles = await fs.readdir(this.projectPath);
        for (const file of currentFiles) {
            if (!this.shouldExcludeFile(file, excludePatterns)) {
                const filePath = path.join(this.projectPath, file);
                await fs.remove(filePath);
            }
        }
        // Copy files from checkpoint
        const checkpointFiles = await fs.readdir(checkpointPath);
        for (const file of checkpointFiles) {
            const sourcePath = path.join(checkpointPath, file);
            const destPath = path.join(this.projectPath, file);
            await fs.copy(sourcePath, destPath);
        }
    }
    /**
     * Restore dependencies from checkpoint
     */
    async restoreDependencies(checkpointPath) {
        const packageJsonPath = path.join(checkpointPath, 'package.json');
        const lockFilePath = path.join(checkpointPath, 'package-lock.json');
        if (await fs.pathExists(packageJsonPath)) {
            await fs.copy(packageJsonPath, path.join(this.projectPath, 'package.json'));
        }
        if (await fs.pathExists(lockFilePath)) {
            await fs.copy(lockFilePath, path.join(this.projectPath, 'package-lock.json'));
        }
        // Reinstall dependencies
        try {
            (0, child_process_1.execSync)('npm ci', { cwd: this.projectPath, stdio: 'inherit' });
        }
        catch (error) {
            // Dependencies will need to be restored manually
        }
    }
    /**
     * Generate checkpoint metadata
     */
    async generateCheckpointMetadata() {
        const packageJsonPath = path.join(this.projectPath, 'package.json');
        let dependencies = {};
        if (await fs.pathExists(packageJsonPath)) {
            const packageJson = await fs.readJson(packageJsonPath);
            dependencies = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };
        }
        const projectSize = await this.getDirectorySize(this.projectPath);
        return {
            projectSize,
            dependencies,
            configuration: await this.getProjectConfiguration(),
            buildStatus: await this.getBuildStatus(),
            testStatus: await this.getTestStatus()
        };
    }
    /**
     * Save checkpoint metadata
     */
    async saveCheckpointMetadata(checkpoint) {
        const metadata = await fs.readJson(this.metadataFile);
        metadata.checkpoints = metadata.checkpoints || [];
        metadata.checkpoints.push(checkpoint);
        await fs.writeJson(this.metadataFile, metadata, { spaces: 2 });
    }
    /**
     * Get current Angular version from project
     */
    async getCurrentAngularVersion() {
        try {
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            const packageJson = await fs.readJson(packageJsonPath);
            const coreVersion = packageJson.dependencies?.['@angular/core'] ||
                packageJson.devDependencies?.['@angular/core'] ||
                'unknown';
            return coreVersion.replace(/[\^~]/, '');
        }
        catch {
            return 'unknown';
        }
    }
    /**
     * Get project configuration
     */
    async getProjectConfiguration() {
        try {
            const angularJsonPath = path.join(this.projectPath, 'angular.json');
            if (await fs.pathExists(angularJsonPath)) {
                return await fs.readJson(angularJsonPath);
            }
        }
        catch {
            // Ignore errors
        }
        return {};
    }
    /**
     * Get build status
     */
    async getBuildStatus() {
        try {
            (0, child_process_1.execSync)('npm run build', { cwd: this.projectPath, stdio: 'pipe' });
            return 'success';
        }
        catch {
            return 'failed';
        }
    }
    /**
     * Get test status
     */
    async getTestStatus() {
        try {
            (0, child_process_1.execSync)('npm test -- --watch=false', { cwd: this.projectPath, stdio: 'pipe' });
            return 'success';
        }
        catch {
            return 'failed';
        }
    }
    /**
     * Calculate directory size
     */
    async getDirectorySize(dirPath) {
        let size = 0;
        try {
            const files = await fs.readdir(dirPath);
            for (const file of files) {
                const filePath = path.join(dirPath, file);
                const stat = await fs.stat(filePath);
                if (stat.isDirectory()) {
                    size += await this.getDirectorySize(filePath);
                }
                else {
                    size += stat.size;
                }
            }
        }
        catch {
            // Ignore errors for inaccessible directories
        }
        return size;
    }
    /**
     * Check if file should be excluded from checkpoint
     */
    shouldExcludeFile(filePath, excludePatterns) {
        return excludePatterns.some(pattern => {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                return regex.test(filePath);
            }
            return filePath.includes(pattern);
        });
    }
}
exports.CheckpointManager = CheckpointManager;
//# sourceMappingURL=CheckpointManager.js.map