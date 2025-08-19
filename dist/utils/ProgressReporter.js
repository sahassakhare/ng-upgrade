"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressReporter = void 0;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const events_1 = require("events");
class ProgressReporter extends events_1.EventEmitter {
    spinner;
    progress;
    startTime;
    stepStartTimes = new Map();
    constructor() {
        super();
        this.spinner = (0, ora_1.default)();
        this.startTime = Date.now();
    }
    /**
     * Initialize progress tracking
     */
    initializeProgress(currentVersion, targetVersion, steps) {
        this.progress = {
            currentVersion,
            targetVersion,
            totalSteps: steps.length,
            completedSteps: 0,
            currentStep: '',
            percentage: 0,
            steps: steps.map(name => ({
                name,
                status: 'pending'
            }))
        };
        this.displayProgressOverview();
    }
    /**
     * Display progress overview
     */
    displayProgressOverview() {
        console.clear();
        console.log(chalk_1.default.bold.cyan('\n🚀 Angular Multi-Version Upgrade Orchestrator\n'));
        console.log(chalk_1.default.gray('━'.repeat(60)));
        console.log(chalk_1.default.white(`📦 Current Version: ${chalk_1.default.yellow(this.progress.currentVersion)}`));
        console.log(chalk_1.default.white(`🎯 Target Version:  ${chalk_1.default.green(this.progress.targetVersion)}`));
        console.log(chalk_1.default.gray('━'.repeat(60)));
        console.log();
    }
    /**
     * Start a major upgrade step
     */
    startStep(stepName, message) {
        this.progress.currentStep = stepName;
        this.stepStartTimes.set(stepName, Date.now());
        const step = this.progress.steps.find(s => s.name === stepName);
        if (step) {
            step.status = 'in-progress';
            step.startTime = Date.now();
            step.message = message;
        }
        this.spinner.start(chalk_1.default.cyan(message || `Processing: ${stepName}`));
        this.updateProgressDisplay();
        this.emit('step-started', { step: stepName, message });
    }
    /**
     * Complete a major upgrade step
     */
    completeStep(stepName, message) {
        const step = this.progress.steps.find(s => s.name === stepName);
        if (step) {
            step.status = 'completed';
            step.endTime = Date.now();
            step.message = message || 'Completed successfully';
        }
        this.progress.completedSteps++;
        this.progress.percentage = Math.round((this.progress.completedSteps / this.progress.totalSteps) * 100);
        const duration = this.getStepDuration(stepName);
        this.spinner.succeed(chalk_1.default.green(`✓ ${stepName} ${chalk_1.default.gray(`(${duration})`)}`));
        if (message) {
            console.log(chalk_1.default.gray(`  └─ ${message}`));
        }
        this.updateProgressDisplay();
        this.emit('step-completed', { step: stepName, message });
    }
    /**
     * Mark step as failed
     */
    failStep(stepName, error) {
        const step = this.progress.steps.find(s => s.name === stepName);
        if (step) {
            step.status = 'failed';
            step.endTime = Date.now();
            step.message = error;
        }
        this.spinner.fail(chalk_1.default.red(`✗ ${stepName} failed`));
        console.log(chalk_1.default.red(`  └─ ${error}`));
        this.updateProgressDisplay();
        this.emit('step-failed', { step: stepName, error });
    }
    /**
     * Skip a step
     */
    skipStep(stepName, reason) {
        const step = this.progress.steps.find(s => s.name === stepName);
        if (step) {
            step.status = 'skipped';
            step.message = reason;
        }
        console.log(chalk_1.default.yellow(`⊘ ${stepName} skipped`));
        console.log(chalk_1.default.gray(`  └─ ${reason}`));
        this.progress.completedSteps++;
        this.progress.percentage = Math.round((this.progress.completedSteps / this.progress.totalSteps) * 100);
        this.updateProgressDisplay();
        this.emit('step-skipped', { step: stepName, reason });
    }
    /**
     * Update progress message
     */
    updateMessage(message) {
        this.spinner.text = chalk_1.default.cyan(message);
    }
    /**
     * Display detailed progress
     */
    updateProgressDisplay() {
        // Calculate estimated time remaining
        const elapsedTime = Date.now() - this.startTime;
        const averageStepTime = elapsedTime / Math.max(this.progress.completedSteps, 1);
        const remainingSteps = this.progress.totalSteps - this.progress.completedSteps;
        const estimatedRemaining = Math.round((remainingSteps * averageStepTime) / 1000);
        this.progress.estimatedTimeRemaining = this.formatTime(estimatedRemaining);
        // Display progress bar
        this.displayProgressBar();
    }
    /**
     * Display visual progress bar
     */
    displayProgressBar() {
        const barLength = 40;
        const filledLength = Math.round((this.progress.percentage / 100) * barLength);
        const emptyLength = barLength - filledLength;
        const progressBar = chalk_1.default.green('█'.repeat(filledLength)) + chalk_1.default.gray('░'.repeat(emptyLength));
        console.log();
        console.log(chalk_1.default.bold('Progress:'));
        console.log(`${progressBar} ${chalk_1.default.bold(`${this.progress.percentage}%`)}`);
        console.log(chalk_1.default.gray(`Steps: ${this.progress.completedSteps}/${this.progress.totalSteps}`));
        if (this.progress.estimatedTimeRemaining && this.progress.completedSteps > 0) {
            console.log(chalk_1.default.gray(`Estimated time remaining: ${this.progress.estimatedTimeRemaining}`));
        }
        console.log();
    }
    /**
     * Display version upgrade path
     */
    displayUpgradePath(versions) {
        console.log(chalk_1.default.bold('\n📋 Upgrade Path:\n'));
        const path = versions.map((v, i) => {
            if (i === 0)
                return chalk_1.default.yellow(v);
            if (i === versions.length - 1)
                return chalk_1.default.green(v);
            return chalk_1.default.white(v);
        }).join(chalk_1.default.gray(' → '));
        console.log(`   ${path}\n`);
    }
    /**
     * Display step details
     */
    displayStepDetails(stepName, details) {
        console.log(chalk_1.default.bold(`\n📝 ${stepName}:`));
        details.forEach(detail => {
            console.log(chalk_1.default.gray(`   • ${detail}`));
        });
        console.log();
    }
    /**
     * Display summary
     */
    displaySummary() {
        const totalTime = this.formatTime(Math.round((Date.now() - this.startTime) / 1000));
        console.log(chalk_1.default.gray('\n' + '━'.repeat(60)));
        console.log(chalk_1.default.bold.green('\n✨ Upgrade Complete!\n'));
        console.log(chalk_1.default.white('Summary:'));
        console.log(chalk_1.default.gray(`• Total time: ${totalTime}`));
        console.log(chalk_1.default.gray(`• Steps completed: ${this.progress.completedSteps}/${this.progress.totalSteps}`));
        const failedSteps = this.progress.steps.filter(s => s.status === 'failed');
        const skippedSteps = this.progress.steps.filter(s => s.status === 'skipped');
        if (failedSteps.length > 0) {
            console.log(chalk_1.default.red(`• Failed steps: ${failedSteps.length}`));
            failedSteps.forEach(step => {
                console.log(chalk_1.default.red(`  - ${step.name}: ${step.message}`));
            });
        }
        if (skippedSteps.length > 0) {
            console.log(chalk_1.default.yellow(`• Skipped steps: ${skippedSteps.length}`));
        }
        console.log(chalk_1.default.gray('\n' + '━'.repeat(60)));
    }
    /**
     * Display warning
     */
    warn(message) {
        console.log(chalk_1.default.yellow(`⚠ ${message}`));
    }
    /**
     * Display info
     */
    info(message) {
        console.log(chalk_1.default.blue(`ℹ ${message}`));
    }
    /**
     * Display success
     */
    success(message) {
        console.log(chalk_1.default.green(`✓ ${message}`));
    }
    /**
     * Display error
     */
    error(message) {
        console.log(chalk_1.default.red(`✗ ${message}`));
    }
    /**
     * Get step duration
     */
    getStepDuration(stepName) {
        const startTime = this.stepStartTimes.get(stepName);
        if (!startTime)
            return '';
        const duration = Math.round((Date.now() - startTime) / 1000);
        return this.formatTime(duration);
    }
    /**
     * Format time in seconds to human readable
     */
    formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds}s`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes < 60) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }
    /**
     * Stop spinner
     */
    stop() {
        this.spinner.stop();
    }
    /**
     * Get current progress
     */
    getProgress() {
        return this.progress;
    }
}
exports.ProgressReporter = ProgressReporter;
//# sourceMappingURL=ProgressReporter.js.map