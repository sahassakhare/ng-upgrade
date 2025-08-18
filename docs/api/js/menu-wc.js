'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Angular Multi-Version Upgrade Orchestrator</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Angular12Handler.html" data-type="entity-link" >Angular12Handler</a>
                            </li>
                            <li class="link">
                                <a href="classes/Angular13Handler.html" data-type="entity-link" >Angular13Handler</a>
                            </li>
                            <li class="link">
                                <a href="classes/Angular14Handler.html" data-type="entity-link" >Angular14Handler</a>
                            </li>
                            <li class="link">
                                <a href="classes/Angular15Handler.html" data-type="entity-link" >Angular15Handler</a>
                            </li>
                            <li class="link">
                                <a href="classes/Angular16Handler.html" data-type="entity-link" >Angular16Handler</a>
                            </li>
                            <li class="link">
                                <a href="classes/Angular17Handler.html" data-type="entity-link" >Angular17Handler</a>
                            </li>
                            <li class="link">
                                <a href="classes/Angular18Handler.html" data-type="entity-link" >Angular18Handler</a>
                            </li>
                            <li class="link">
                                <a href="classes/Angular19Handler.html" data-type="entity-link" >Angular19Handler</a>
                            </li>
                            <li class="link">
                                <a href="classes/Angular20Handler.html" data-type="entity-link" >Angular20Handler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AngularSchematicsRunner.html" data-type="entity-link" >AngularSchematicsRunner</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApprovalEngine.html" data-type="entity-link" >ApprovalEngine</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseVersionHandler.html" data-type="entity-link" >BaseVersionHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CheckpointManager.html" data-type="entity-link" >CheckpointManager</a>
                            </li>
                            <li class="link">
                                <a href="classes/CodeTransformer.html" data-type="entity-link" >CodeTransformer</a>
                            </li>
                            <li class="link">
                                <a href="classes/ComplianceEngine.html" data-type="entity-link" >ComplianceEngine</a>
                            </li>
                            <li class="link">
                                <a href="classes/DependencyInstaller.html" data-type="entity-link" >DependencyInstaller</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnhancedUpgradeOrchestrator.html" data-type="entity-link" >EnhancedUpgradeOrchestrator</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnterpriseMonitoringEngine.html" data-type="entity-link" >EnterpriseMonitoringEngine</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnterpriseMonitoringSystem.html" data-type="entity-link" >EnterpriseMonitoringSystem</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnterpriseRollbackEngine.html" data-type="entity-link" >EnterpriseRollbackEngine</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnterpriseSecurityValidator.html" data-type="entity-link" >EnterpriseSecurityValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnterpriseUpgradeOrchestrator.html" data-type="entity-link" >EnterpriseUpgradeOrchestrator</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnterpriseValidationFramework.html" data-type="entity-link" >EnterpriseValidationFramework</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileContentPreserver.html" data-type="entity-link" >FileContentPreserver</a>
                            </li>
                            <li class="link">
                                <a href="classes/HybridVersionHandler.html" data-type="entity-link" >HybridVersionHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProgressReporter.html" data-type="entity-link" >ProgressReporter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectAnalyzer.html" data-type="entity-link" >ProjectAnalyzer</a>
                            </li>
                            <li class="link">
                                <a href="classes/RollbackEngine.html" data-type="entity-link" >RollbackEngine</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpgradeOrchestrator.html" data-type="entity-link" >UpgradeOrchestrator</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpgradePathCalculator.html" data-type="entity-link" >UpgradePathCalculator</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidatorFramework.html" data-type="entity-link" >ValidatorFramework</a>
                            </li>
                            <li class="link">
                                <a href="classes/VersionHandlerRegistry.html" data-type="entity-link" >VersionHandlerRegistry</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AccessibilityCheck.html" data-type="entity-link" >AccessibilityCheck</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AccessibilityValidationResult.html" data-type="entity-link" >AccessibilityValidationResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Alert.html" data-type="entity-link" >Alert</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AlertingConfig.html" data-type="entity-link" >AlertingConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AngularVersion.html" data-type="entity-link" >AngularVersion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApprovalConfig.html" data-type="entity-link" >ApprovalConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApprovalRequest.html" data-type="entity-link" >ApprovalRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApprovalResult.html" data-type="entity-link" >ApprovalResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuditTrail.html" data-type="entity-link" >AuditTrail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BreakingChange.html" data-type="entity-link" >BreakingChange</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BrowserResult.html" data-type="entity-link" >BrowserResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BundleSizeAnalysis.html" data-type="entity-link" >BundleSizeAnalysis</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Checkpoint.html" data-type="entity-link" >Checkpoint</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CheckpointMetadata.html" data-type="entity-link" >CheckpointMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CodeMetrics.html" data-type="entity-link" >CodeMetrics</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CodeSecurityReport.html" data-type="entity-link" >CodeSecurityReport</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CodeTransformation.html" data-type="entity-link" >CodeTransformation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ComplianceCheck.html" data-type="entity-link" >ComplianceCheck</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ComplianceConfig.html" data-type="entity-link" >ComplianceConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ComplianceReport.html" data-type="entity-link" >ComplianceReport</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ComplianceRequirement.html" data-type="entity-link" >ComplianceRequirement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ComplianceRequirement-1.html" data-type="entity-link" >ComplianceRequirement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ComplianceValidationResult.html" data-type="entity-link" >ComplianceValidationResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CrossBrowserValidationResult.html" data-type="entity-link" >CrossBrowserValidationResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Dashboard.html" data-type="entity-link" >Dashboard</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DashboardSection.html" data-type="entity-link" >DashboardSection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DependencyAnalysis.html" data-type="entity-link" >DependencyAnalysis</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DependencyConflict.html" data-type="entity-link" >DependencyConflict</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DependencyUpdate.html" data-type="entity-link" >DependencyUpdate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DependencyUpdate-1.html" data-type="entity-link" >DependencyUpdate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnterpriseConfig.html" data-type="entity-link" >EnterpriseConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnterpriseUpgradeOptions.html" data-type="entity-link" >EnterpriseUpgradeOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnterpriseUpgradeResult.html" data-type="entity-link" >EnterpriseUpgradeResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnterpriseValidationConfig.html" data-type="entity-link" >EnterpriseValidationConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnvironmentConfig.html" data-type="entity-link" >EnvironmentConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnvironmentResult.html" data-type="entity-link" >EnvironmentResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ErrorPattern.html" data-type="entity-link" >ErrorPattern</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FunctionalValidationResult.html" data-type="entity-link" >FunctionalValidationResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HealthScore.html" data-type="entity-link" >HealthScore</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HealthStatus.html" data-type="entity-link" >HealthStatus</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IncidentResponseConfig.html" data-type="entity-link" >IncidentResponseConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IntegrationCheck.html" data-type="entity-link" >IntegrationCheck</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IntegrationValidationResult.html" data-type="entity-link" >IntegrationValidationResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoadMetric.html" data-type="entity-link" >LoadMetric</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoadTestingConfig.html" data-type="entity-link" >LoadTestingConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoadTestResult.html" data-type="entity-link" >LoadTestResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoadTimeMetrics.html" data-type="entity-link" >LoadTimeMetrics</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetricValue.html" data-type="entity-link" >MetricValue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Migration.html" data-type="entity-link" >Migration</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MigrationAction.html" data-type="entity-link" >MigrationAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MigrationPlan.html" data-type="entity-link" >MigrationPlan</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MonitoringConfig.html" data-type="entity-link" >MonitoringConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MonitoringConfig-1.html" data-type="entity-link" >MonitoringConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MonitoringDashboard.html" data-type="entity-link" >MonitoringDashboard</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MonitoringReport.html" data-type="entity-link" >MonitoringReport</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MonitoringSession.html" data-type="entity-link" >MonitoringSession</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PerformanceBaseline.html" data-type="entity-link" >PerformanceBaseline</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PerformanceMetrics.html" data-type="entity-link" >PerformanceMetrics</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PerformanceThreshold.html" data-type="entity-link" >PerformanceThreshold</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PerformanceThreshold-1.html" data-type="entity-link" >PerformanceThreshold</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PerformanceValidationResult.html" data-type="entity-link" >PerformanceValidationResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Prerequisite.html" data-type="entity-link" >Prerequisite</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProductionResult.html" data-type="entity-link" >ProductionResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgressIssue.html" data-type="entity-link" >ProgressIssue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgressReport.html" data-type="entity-link" >ProgressReport</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgressStep.html" data-type="entity-link" >ProgressStep</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProjectAnalysis.html" data-type="entity-link" >ProjectAnalysis</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegressionAnalysis.html" data-type="entity-link" >RegressionAnalysis</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RiskAssessment.html" data-type="entity-link" >RiskAssessment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RiskFactor.html" data-type="entity-link" >RiskFactor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RollbackConfig.html" data-type="entity-link" >RollbackConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RollbackOptions.html" data-type="entity-link" >RollbackOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RollbackResult.html" data-type="entity-link" >RollbackResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SecurityConfig.html" data-type="entity-link" >SecurityConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SecurityReport.html" data-type="entity-link" >SecurityReport</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SecurityStandard.html" data-type="entity-link" >SecurityStandard</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SecurityValidationResult.html" data-type="entity-link" >SecurityValidationResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SLACompliance.html" data-type="entity-link" >SLACompliance</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SLAValidation.html" data-type="entity-link" >SLAValidation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TestResult.html" data-type="entity-link" >TestResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ThirdPartyLibrary.html" data-type="entity-link" >ThirdPartyLibrary</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TimeRange.html" data-type="entity-link" >TimeRange</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TransformationHandler.html" data-type="entity-link" >TransformationHandler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpgradeMonitoringConfig.html" data-type="entity-link" >UpgradeMonitoringConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpgradeOptions.html" data-type="entity-link" >UpgradeOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpgradePath.html" data-type="entity-link" >UpgradePath</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpgradeProgress.html" data-type="entity-link" >UpgradeProgress</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpgradeResult.html" data-type="entity-link" >UpgradeResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpgradeStep.html" data-type="entity-link" >UpgradeStep</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserExperienceMetrics.html" data-type="entity-link" >UserExperienceMetrics</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ValidationResult.html" data-type="entity-link" >ValidationResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ValidationStep.html" data-type="entity-link" >ValidationStep</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ValidationSuite.html" data-type="entity-link" >ValidationSuite</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VersionHandler.html" data-type="entity-link" >VersionHandler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VulnerabilityReport.html" data-type="entity-link" >VulnerabilityReport</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});