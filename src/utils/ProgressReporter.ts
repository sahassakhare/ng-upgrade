import * as chalk from 'chalk';
import ora from 'ora';
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

export class ProgressReporter extends EventEmitter {
  private spinner: ora.Ora;
  private progress!: UpgradeProgress;
  private startTime: number;
  private stepStartTimes: Map<string, number> = new Map();

  constructor() {
    super();
    this.spinner = ora();
    this.startTime = Date.now();
  }

  /**
   * Initialize progress tracking
   */
  initializeProgress(currentVersion: string, targetVersion: string, steps: string[]): void {
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
  displayProgressOverview(): void {
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
  startStep(stepName: string, message?: string): void {
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
  completeStep(stepName: string, message?: string): void {
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
  failStep(stepName: string, error: string): void {
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
  skipStep(stepName: string, reason: string): void {
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
  updateMessage(message: string): void {
    this.spinner.text = chalk.cyan(message);
  }

  /**
   * Display detailed progress
   */
  private updateProgressDisplay(): void {
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
  private displayProgressBar(): void {
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
  displayUpgradePath(versions: string[]): void {
    console.log(chalk.bold('\n📋 Upgrade Path:\n'));
    
    const path = versions.map((v, i) => {
      if (i === 0) return chalk.yellow(v);
      if (i === versions.length - 1) return chalk.green(v);
      return chalk.white(v);
    }).join(chalk.gray(' → '));
    
    console.log(`   ${path}\n`);
  }

  /**
   * Display step details
   */
  displayStepDetails(stepName: string, details: string[]): void {
    console.log(chalk.bold(`\n📝 ${stepName}:`));
    details.forEach(detail => {
      console.log(chalk.gray(`   • ${detail}`));
    });
    console.log();
  }

  /**
   * Display summary
   */
  displaySummary(): void {
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
  warn(message: string): void {
    console.log(chalk.yellow(`⚠ ${message}`));
  }

  /**
   * Display info
   */
  info(message: string): void {
    console.log(chalk.blue(`ℹ ${message}`));
  }

  /**
   * Display success
   */
  success(message: string): void {
    console.log(chalk.green(`✓ ${message}`));
  }

  /**
   * Display error
   */
  error(message: string): void {
    console.log(chalk.red(`✗ ${message}`));
  }

  /**
   * Get step duration
   */
  private getStepDuration(stepName: string): string {
    const startTime = this.stepStartTimes.get(stepName);
    if (!startTime) return '';
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    return this.formatTime(duration);
  }

  /**
   * Format time in seconds to human readable
   */
  private formatTime(seconds: number): string {
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
  stop(): void {
    this.spinner.stop();
  }

  /**
   * Get current progress
   */
  getProgress(): UpgradeProgress {
    return this.progress;
  }
}