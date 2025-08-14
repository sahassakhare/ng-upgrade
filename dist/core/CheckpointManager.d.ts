import { Checkpoint } from '../types';
export declare class CheckpointManager {
    private projectPath;
    private checkpointsDir;
    private metadataFile;
    constructor(projectPath: string);
    /**
     * Initialize checkpoint management system
     */
    initialize(): Promise<void>;
    /**
     * Create a new checkpoint
     */
    createCheckpoint(id: string, description: string): Promise<Checkpoint>;
    /**
     * Restore from a checkpoint
     */
    restoreFromCheckpoint(checkpointId: string): Promise<void>;
    /**
     * List all available checkpoints
     */
    listCheckpoints(): Promise<Checkpoint[]>;
    /**
     * Get specific checkpoint
     */
    getCheckpoint(checkpointId: string): Promise<Checkpoint | null>;
    /**
     * Delete a checkpoint
     */
    deleteCheckpoint(checkpointId: string): Promise<void>;
    /**
     * Clean up old checkpoints (keep only last N)
     */
    cleanupOldCheckpoints(keepCount?: number): Promise<void>;
    /**
     * Get checkpoint size information
     */
    getCheckpointSize(checkpointId: string): Promise<number>;
    /**
     * Validate checkpoint integrity
     */
    validateCheckpoint(checkpointId: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    /**
     * Copy project files to checkpoint directory
     */
    private copyProjectFiles;
    /**
     * Restore project files from checkpoint
     */
    private restoreProjectFiles;
    /**
     * Restore dependencies from checkpoint
     */
    private restoreDependencies;
    /**
     * Generate checkpoint metadata
     */
    private generateCheckpointMetadata;
    /**
     * Save checkpoint metadata
     */
    private saveCheckpointMetadata;
    /**
     * Get current Angular version from project
     */
    private getCurrentAngularVersion;
    /**
     * Get project configuration
     */
    private getProjectConfiguration;
    /**
     * Get build status
     */
    private getBuildStatus;
    /**
     * Get test status
     */
    private getTestStatus;
    /**
     * Calculate directory size
     */
    private getDirectorySize;
    /**
     * Check if file should be excluded from checkpoint
     */
    private shouldExcludeFile;
}
//# sourceMappingURL=CheckpointManager.d.ts.map