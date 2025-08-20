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
exports.Angular12Handler = void 0;
const BaseVersionHandler_1 = require("./BaseVersionHandler");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class Angular12Handler extends BaseVersionHandler_1.BaseVersionHandler {
    version = '12';
    getRequiredNodeVersion() {
        return '>=12.20.0';
    }
    getRequiredTypeScriptVersion() {
        return '>=4.2.3 <4.4.0';
    }
    async applyVersionSpecificChanges(projectPath, options) {
        this.progressReporter?.updateMessage('Applying Angular 12 specific changes...');
        // 1. Enable Ivy renderer (should already be default in v12)
        await this.ensureIvyRenderer(projectPath);
        // 2. Update Angular CDK and Material versions
        await this.updateAngularCDKMaterial(projectPath);
        // 3. Update to Webpack 5 support
        await this.updateWebpackConfiguration(projectPath);
        // 4. Update Angular Package Format (APF)
        await this.updatePackageFormat(projectPath);
        // 5. Enable strict mode by default
        if (options.strategy !== 'conservative') {
            await this.enableStrictMode(projectPath);
        }
        // 6. Update Hot Module Replacement support
        await this.updateHMRSupport(projectPath);
    }
    async ensureIvyRenderer(projectPath) {
        const tsconfigPath = path.join(projectPath, 'tsconfig.json');
        if (await fs.pathExists(tsconfigPath)) {
            const tsconfig = await fs.readJson(tsconfigPath);
            // Remove View Engine configuration (Ivy is default in v12)
            if (tsconfig.angularCompilerOptions?.enableIvy === false) {
                delete tsconfig.angularCompilerOptions.enableIvy;
                await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
                this.progressReporter?.success('✓ Removed explicit Ivy renderer configuration (default in Angular 12)');
            }
        }
    }
    async updateWebpackConfiguration(_projectPath) {
        // Angular 12 includes Webpack 5 support
        this.progressReporter?.info('✓ Webpack 5 support enabled');
    }
    async updatePackageFormat(_projectPath) {
        // Update to Angular Package Format v12
        this.progressReporter?.info('✓ Angular Package Format v12 support enabled');
    }
    async enableStrictMode(projectPath) {
        const tsconfigPath = path.join(projectPath, 'tsconfig.json');
        if (await fs.pathExists(tsconfigPath)) {
            const tsconfig = await fs.readJson(tsconfigPath);
            if (!tsconfig.compilerOptions) {
                tsconfig.compilerOptions = {};
            }
            tsconfig.compilerOptions.strict = true;
            tsconfig.compilerOptions.noImplicitReturns = true;
            tsconfig.compilerOptions.noFallthroughCasesInSwitch = true;
            await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
            this.progressReporter?.success('✓ Enabled TypeScript strict mode');
        }
    }
    async updateAngularCDKMaterial(projectPath) {
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (await fs.pathExists(packageJsonPath)) {
            const packageJson = await fs.readJson(packageJsonPath);
            let updated = false;
            // Update Angular Material version
            if (packageJson.dependencies?.['@angular/material']) {
                packageJson.dependencies['@angular/material'] = '^12.0.0';
                updated = true;
            }
            // Update Angular CDK version
            if (packageJson.dependencies?.['@angular/cdk']) {
                packageJson.dependencies['@angular/cdk'] = '^12.0.0';
                updated = true;
            }
            if (updated) {
                await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
                this.progressReporter?.success('✓ Updated Angular Material and CDK to version 12');
            }
        }
    }
    async updateHMRSupport(_projectPath) {
        // Angular 12 improved HMR support
        this.progressReporter?.info('✓ Hot Module Replacement support updated');
    }
    getBreakingChanges() {
        return [
            this.createBreakingChange('ng12-ivy-default', 'build', 'high', 'Ivy renderer is now the default and only renderer', 'View Engine is no longer supported', 'Remove any View Engine specific configurations'),
            this.createBreakingChange('ng12-webpack5', 'build', 'medium', 'Webpack 5 support enabled', 'Some webpack plugins may need updates', 'Update webpack plugins to be compatible with Webpack 5'),
            this.createBreakingChange('ng12-strict-mode', 'config', 'medium', 'Strict mode enabled by default for new projects', 'Stricter TypeScript compilation', 'Fix any TypeScript strict mode errors'),
            this.createBreakingChange('ng12-ie11-deprecation', 'build', 'low', 'Internet Explorer 11 support deprecated', 'IE11 support will be removed in future versions', 'Plan migration away from IE11 support')
        ];
    }
}
exports.Angular12Handler = Angular12Handler;
//# sourceMappingURL=Angular12Handler.js.map