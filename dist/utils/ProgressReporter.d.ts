import { EventEmitter } from 'events';
export interface ProgressStep {
    name: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';
    message?: string;
    startTime?: number;
    endTime?: number;
    subSteps?: ProgressStep[];
}
export interface UpgradeProgress {
    currentVersion: string;
    targetVersion: string;
    totalSteps: number;
    completedSteps: number;
    currentStep: string;
    percentage: number;
    estimatedTimeRemaining?: string;
    steps: ProgressStep[];
}
export declare class ProgressReporter extends EventEmitter {
    private spinner;
    private progress;
    private startTime;
    private stepStartTimes;
    constructor();
    /**
     * Initialize progress tracking
     */
    initializeProgress(currentVersion: string, targetVersion: string, steps: string[]): void;
    /**
     * Display progress overview
     */
    displayProgressOverview(): void;
    /**
     * Start a major upgrade step
     */
    startStep(stepName: string, message?: string): void;
    /**
     * Complete a major upgrade step
     */
    completeStep(stepName: string, message?: string): void;
    /**
     * Mark step as failed
     */
    failStep(stepName: string, error: string): void;
    /**
     * Skip a step
     */
    skipStep(stepName: string, reason: string): void;
    /**
     * Update progress message
     */
    updateMessage(message: string): void;
    /**
     * Display detailed progress
     */
    private updateProgressDisplay;
    /**
     * Display visual progress bar
     */
    private displayProgressBar;
    /**
     * Display version upgrade path
     */
    displayUpgradePath(versions: string[]): void;
    /**
     * Display step details
     */
    displayStepDetails(stepName: string, details: string[]): void;
    /**
     * Display summary
     */
    displaySummary(): void;
    /**
     * Display warning
     */
    warn(message: string): void;
    /**
     * Display info
     */
    info(message: string): void;
    /**
     * Display success
     */
    success(message: string): void;
    /**
     * Display error
     */
    error(message: string): void;
    /**
     * Get step duration
     */
    private getStepDuration;
    /**
     * Format time in seconds to human readable
     */
    private formatTime;
    /**
     * Stop spinner
     */
    stop(): void;
    /**
     * Get current progress
     */
    getProgress(): UpgradeProgress;
}
//# sourceMappingURL=ProgressReporter.d.ts.map