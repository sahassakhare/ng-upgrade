import { CheckpointManager } from './CheckpointManager';
import { Checkpoint } from '../types';
export interface RollbackOptions {
    preserveChanges?: string[];
    backupBeforeRollback?: boolean;
    validateAfterRollback?: boolean;
}
export interface RollbackResult {
    success: boolean;
    checkpoint: Checkpoint;
    preservedFiles?: string[];
    warnings?: string[];
    error?: string;
}
export declare class RollbackEngine {
    private checkpointManager;
    constructor(checkpointManager: CheckpointManager);
    /**
     * Rollback to specific checkpoint
     */
    rollbackToCheckpoint(checkpointId: string, options?: RollbackOptions): Promise<RollbackResult>;
    /**
     * Rollback to last known good state
     */
    rollbackToLastGood(): Promise<RollbackResult>;
    /**
     * Progressive rollback (rollback one step at a time)
     */
    progressiveRollback(targetCheckpointId?: string): Promise<RollbackResult[]>;
    /**
     * Selective rollback (rollback specific changes only)
     */
    selectiveRollback(checkpointId: string, filesToRollback: string[]): Promise<RollbackResult>;
    /**
     * Get rollback history
     */
    getRollbackHistory(): Promise<Array<{
        checkpoint: Checkpoint;
        rollbackTime: Date;
        reason: string;
    }>>;
    /**
     * Verify rollback feasibility
     */
    verifyRollbackFeasibility(checkpointId: string): Promise<{
        feasible: boolean;
        issues: string[];
        warnings: string[];
    }>;
    /**
     * Create rollback plan
     */
    createRollbackPlan(checkpointId: string): Promise<{
        steps: string[];
        estimatedTime: number;
        risks: string[];
        mitigations: string[];
    }>;
    /**
     * Preserve specific files before rollback
     */
    private preserveFiles;
    /**
     * Restore preserved files after rollback
     */
    private restorePreservedFiles;
    /**
     * Validate rollback success
     */
    private validateRollback;
    /**
     * Auto-rollback on failure
     */
    setupAutoRollback(checkpointId: string, validationCommand?: string): Promise<void>;
    /**
     * Cleanup rollback artifacts
     */
    cleanupRollbackArtifacts(): Promise<void>;
}
//# sourceMappingURL=RollbackEngine.d.ts.map