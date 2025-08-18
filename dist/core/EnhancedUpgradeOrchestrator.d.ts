import { EventEmitter } from 'events';
import { UpgradeOptions, UpgradeResult, Checkpoint } from '../types';
/**
 * Enhanced Upgrade Orchestrator with better UX features:
 * - Automatic dependency installation
 * - Progress reporting with visual feedback
 * - File content preservation
 */
export declare class EnhancedUpgradeOrchestrator extends EventEmitter {
    private projectPath;
    private versionHandlers;
    private checkpointManager;
    private pathCalculator;
    private projectAnalyzer;
    private validator;
    private rollbackEngine;
    private progressReporter;
    private dependencyInstaller;
    private currentCheckpoint?;
    constructor(projectPath: string);
    /**
     * Enhanced orchestration with better progress reporting and dependency management
     */
    orchestrateUpgrade(options: UpgradeOptions): Promise<UpgradeResult>;
    /**
     * Execute a single upgrade step
     */
    private executeUpgradeStep;
    /**
     * Validate prerequisites for the upgrade path
     */
    private validatePrerequisites;
    /**
     * Determine if a checkpoint should be created
     */
    private shouldCreateCheckpoint;
    /**
     * Parse version string to AngularVersion object
     */
    private parseVersion;
    /**
     * Rollback to a specific checkpoint
     */
    rollbackToCheckpoint(checkpointId: string): Promise<void>;
    /**
     * Get all available checkpoints
     */
    getCheckpoints(): Promise<Checkpoint[]>;
}
//# sourceMappingURL=EnhancedUpgradeOrchestrator.d.ts.map