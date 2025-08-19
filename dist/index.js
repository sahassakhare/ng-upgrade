"use strict";
// Main entry point for the Angular Multi-Version Upgrade Orchestrator
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.AngularSchematicsRunner = exports.ProgressReporter = exports.FileContentPreserver = exports.DependencyInstaller = exports.RollbackEngine = exports.ValidatorFramework = exports.ProjectAnalyzer = exports.UpgradePathCalculator = exports.CheckpointManager = exports.VersionHandlerRegistry = exports.EnhancedUpgradeOrchestrator = exports.UpgradeOrchestrator = void 0;
// Core orchestration components
var UpgradeOrchestrator_1 = require("./core/UpgradeOrchestrator");
Object.defineProperty(exports, "UpgradeOrchestrator", { enumerable: true, get: function () { return UpgradeOrchestrator_1.UpgradeOrchestrator; } });
var EnhancedUpgradeOrchestrator_1 = require("./core/EnhancedUpgradeOrchestrator");
Object.defineProperty(exports, "EnhancedUpgradeOrchestrator", { enumerable: true, get: function () { return EnhancedUpgradeOrchestrator_1.EnhancedUpgradeOrchestrator; } });
var VersionHandlerRegistry_1 = require("./core/VersionHandlerRegistry");
Object.defineProperty(exports, "VersionHandlerRegistry", { enumerable: true, get: function () { return VersionHandlerRegistry_1.VersionHandlerRegistry; } });
var CheckpointManager_1 = require("./core/CheckpointManager");
Object.defineProperty(exports, "CheckpointManager", { enumerable: true, get: function () { return CheckpointManager_1.CheckpointManager; } });
var UpgradePathCalculator_1 = require("./core/UpgradePathCalculator");
Object.defineProperty(exports, "UpgradePathCalculator", { enumerable: true, get: function () { return UpgradePathCalculator_1.UpgradePathCalculator; } });
var ProjectAnalyzer_1 = require("./core/ProjectAnalyzer");
Object.defineProperty(exports, "ProjectAnalyzer", { enumerable: true, get: function () { return ProjectAnalyzer_1.ProjectAnalyzer; } });
var ValidatorFramework_1 = require("./core/ValidatorFramework");
Object.defineProperty(exports, "ValidatorFramework", { enumerable: true, get: function () { return ValidatorFramework_1.ValidatorFramework; } });
var RollbackEngine_1 = require("./core/RollbackEngine");
Object.defineProperty(exports, "RollbackEngine", { enumerable: true, get: function () { return RollbackEngine_1.RollbackEngine; } });
// Enterprise components - temporarily commented out for build fix
// export { EnterpriseUpgradeOrchestrator } from './enterprise/EnterpriseUpgradeOrchestrator';
// export { EnterpriseValidationFramework } from './enterprise/EnterpriseValidationFramework';
// export { EnterpriseMonitoringSystem } from './enterprise/EnterpriseMonitoringSystem';
// Utility components
var DependencyInstaller_1 = require("./utils/DependencyInstaller");
Object.defineProperty(exports, "DependencyInstaller", { enumerable: true, get: function () { return DependencyInstaller_1.DependencyInstaller; } });
var FileContentPreserver_1 = require("./utils/FileContentPreserver");
Object.defineProperty(exports, "FileContentPreserver", { enumerable: true, get: function () { return FileContentPreserver_1.FileContentPreserver; } });
var ProgressReporter_1 = require("./utils/ProgressReporter");
Object.defineProperty(exports, "ProgressReporter", { enumerable: true, get: function () { return ProgressReporter_1.ProgressReporter; } });
var AngularSchematicsRunner_1 = require("./utils/AngularSchematicsRunner");
Object.defineProperty(exports, "AngularSchematicsRunner", { enumerable: true, get: function () { return AngularSchematicsRunner_1.AngularSchematicsRunner; } });
// Version handlers (including Angular 20)
__exportStar(require("./handlers"), exports);
__exportStar(require("./transformers/CodeTransformer"), exports);
__exportStar(require("./types"), exports);
// Default export for main orchestrator
var UpgradeOrchestrator_2 = require("./core/UpgradeOrchestrator");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return UpgradeOrchestrator_2.UpgradeOrchestrator; } });
//# sourceMappingURL=index.js.map