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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressReporter = void 0;
const chalk = __importStar(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const events_1 = require("events");
class ProgressReporter extends events_1.EventEmitter {
    constructor() {
        super();
        this.stepStartTimes = new Map();
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
        console.log(chalk.bold.cyan('\n🚀 Angular Multi-Version Upgrade Orchestrator\n'));
        console.log(chalk.gray('━'.repeat(60)));
        console.log(chalk.white(`📦 Current Version: ${chalk.yellow(this.progress.currentVersion)}`));
        console.log(chalk.white(`🎯 Target Version:  ${chalk.green(this.progress.targetVersion)}`));
        console.log(chalk.gray('━'.repeat(60)));
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
        this.spinner.start(chalk.cyan(message || `Processing: ${stepName}`));
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
        this.spinner.succeed(chalk.green(`✓ ${stepName} ${chalk.gray(`(${duration})`)}`));
        if (message) {
            console.log(chalk.gray(`  └─ ${message}`));
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
        this.spinner.fail(chalk.red(`✗ ${stepName} failed`));
        console.log(chalk.red(`  └─ ${error}`));
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
        console.log(chalk.yellow(`⊘ ${stepName} skipped`));
        console.log(chalk.gray(`  └─ ${reason}`));
        this.progress.completedSteps++;
        this.progress.percentage = Math.round((this.progress.completedSteps / this.progress.totalSteps) * 100);
        this.updateProgressDisplay();
        this.emit('step-skipped', { step: stepName, reason });
    }
    /**
     * Update progress message
     */
    updateMessage(message) {
        this.spinner.text = chalk.cyan(message);
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
        const progressBar = chalk.green('█'.repeat(filledLength)) + chalk.gray('░'.repeat(emptyLength));
        console.log();
        console.log(chalk.bold('Progress:'));
        console.log(`${progressBar} ${chalk.bold(`${this.progress.percentage}%`)}`);
        console.log(chalk.gray(`Steps: ${this.progress.completedSteps}/${this.progress.totalSteps}`));
        if (this.progress.estimatedTimeRemaining && this.progress.completedSteps > 0) {
            console.log(chalk.gray(`Estimated time remaining: ${this.progress.estimatedTimeRemaining}`));
        }
        console.log();
    }
    /**
     * Display version upgrade path
     */
    displayUpgradePath(versions) {
        console.log(chalk.bold('\n📋 Upgrade Path:\n'));
        const path = versions.map((v, i) => {
            if (i === 0)
                return chalk.yellow(v);
            if (i === versions.length - 1)
                return chalk.green(v);
            return chalk.white(v);
        }).join(chalk.gray(' → '));
        console.log(`   ${path}\n`);
    }
    /**
     * Display step details
     */
    displayStepDetails(stepName, details) {
        console.log(chalk.bold(`\n📝 ${stepName}:`));
        details.forEach(detail => {
            console.log(chalk.gray(`   • ${detail}`));
        });
        console.log();
    }
    /**
     * Display summary
     */
    displaySummary() {
        const totalTime = this.formatTime(Math.round((Date.now() - this.startTime) / 1000));
        console.log(chalk.gray('\n' + '━'.repeat(60)));
        console.log(chalk.bold.green('\n✨ Upgrade Complete!\n'));
        console.log(chalk.white('Summary:'));
        console.log(chalk.gray(`• Total time: ${totalTime}`));
        console.log(chalk.gray(`• Steps completed: ${this.progress.completedSteps}/${this.progress.totalSteps}`));
        const failedSteps = this.progress.steps.filter(s => s.status === 'failed');
        const skippedSteps = this.progress.steps.filter(s => s.status === 'skipped');
        if (failedSteps.length > 0) {
            console.log(chalk.red(`• Failed steps: ${failedSteps.length}`));
            failedSteps.forEach(step => {
                console.log(chalk.red(`  - ${step.name}: ${step.message}`));
            });
        }
        if (skippedSteps.length > 0) {
            console.log(chalk.yellow(`• Skipped steps: ${skippedSteps.length}`));
        }
        console.log(chalk.gray('\n' + '━'.repeat(60)));
    }
    /**
     * Display warning
     */
    warn(message) {
        console.log(chalk.yellow(`⚠ ${message}`));
    }
    /**
     * Display info
     */
    info(message) {
        console.log(chalk.blue(`ℹ ${message}`));
    }
    /**
     * Display success
     */
    success(message) {
        console.log(chalk.green(`✓ ${message}`));
    }
    /**
     * Display error
     */
    error(message) {
        console.log(chalk.red(`✗ ${message}`));
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