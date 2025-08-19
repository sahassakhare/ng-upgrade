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
exports.CodeTransformer = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class CodeTransformer {
    type = 'code';
    async apply(projectPath, change) {
        console.log(`Applying transformation for: ${change.description}`);
        switch (change.type) {
            case 'api':
                await this.applyApiTransformation(projectPath, change);
                break;
            case 'template':
                await this.applyTemplateTransformation(projectPath, change);
                break;
            case 'config':
                await this.applyConfigTransformation(projectPath, change);
                break;
            case 'style':
                await this.applyStyleTransformation(projectPath, change);
                break;
            case 'build':
                await this.applyBuildTransformation(projectPath, change);
                break;
            case 'dependency':
                await this.applyDependencyTransformation(projectPath, change);
                break;
            default:
                console.warn(`Unknown transformation type: ${change.type}`);
        }
    }
    async applyApiTransformation(projectPath, change) {
        // Apply API-related transformations
        if (change.migration.transform) {
            await this.applyCodeTransformation(projectPath, change.migration.transform);
        }
    }
    async applyTemplateTransformation(projectPath, change) {
        // Apply template-related transformations
        const templateFiles = await this.findFiles(projectPath, '**/*.html');
        for (const file of templateFiles) {
            if (change.migration.transform) {
                await this.transformFile(file, change.migration.transform);
            }
        }
    }
    async applyConfigTransformation(projectPath, change) {
        // Apply configuration transformations
        const configFiles = ['angular.json', 'tsconfig.json', 'package.json'];
        for (const configFile of configFiles) {
            const filePath = path.join(projectPath, configFile);
            if (await fs.pathExists(filePath) && change.migration.transform) {
                await this.transformFile(filePath, change.migration.transform);
            }
        }
    }
    async applyStyleTransformation(projectPath, change) {
        // Apply style-related transformations
        const styleFiles = await this.findFiles(projectPath, '**/*.{css,scss,sass,less}');
        for (const file of styleFiles) {
            if (change.migration.transform) {
                await this.transformFile(file, change.migration.transform);
            }
        }
    }
    async applyBuildTransformation(projectPath, change) {
        // Apply build-related transformations
        const buildFiles = ['angular.json', 'webpack.config.js', 'tsconfig.json'];
        for (const buildFile of buildFiles) {
            const filePath = path.join(projectPath, buildFile);
            if (await fs.pathExists(filePath) && change.migration.transform) {
                await this.transformFile(filePath, change.migration.transform);
            }
        }
    }
    async applyDependencyTransformation(projectPath, change) {
        // Apply dependency-related transformations
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (await fs.pathExists(packageJsonPath) && change.migration.transform) {
            await this.transformFile(packageJsonPath, change.migration.transform);
        }
    }
    async applyCodeTransformation(projectPath, transform) {
        switch (transform.type) {
            case 'regex':
                await this.applyRegexTransformation(projectPath, transform);
                break;
            case 'ast':
                await this.applyAstTransformation(projectPath, transform);
                break;
            case 'file':
                await this.applyFileTransformation(projectPath, transform);
                break;
            default:
                console.warn(`Unknown transformation type: ${transform.type}`);
        }
    }
    async applyRegexTransformation(projectPath, transform) {
        const files = transform.filePaths || await this.findFiles(projectPath, '**/*.ts');
        for (const file of files) {
            await this.transformFile(file, transform);
        }
    }
    async applyAstTransformation(projectPath, transform) {
        // AST-based transformations would be implemented here
        // For now, this is a placeholder
        console.log('AST transformation not yet implemented');
    }
    async applyFileTransformation(projectPath, transform) {
        // File-level transformations
        if (transform.filePaths) {
            for (const filePath of transform.filePaths) {
                const fullPath = path.join(projectPath, filePath);
                if (await fs.pathExists(fullPath)) {
                    await this.transformFile(fullPath, transform);
                }
            }
        }
    }
    async transformFile(filePath, transform) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            if (transform.pattern && transform.replacement) {
                const pattern = typeof transform.pattern === 'string'
                    ? new RegExp(transform.pattern, 'g')
                    : transform.pattern;
                const newContent = content.replace(pattern, transform.replacement);
                if (newContent !== content) {
                    await fs.writeFile(filePath, newContent);
                    console.log(`✓ Transformed: ${filePath}`);
                }
            }
        }
        catch (error) {
            console.error(`Failed to transform file ${filePath}:`, error);
        }
    }
    async findFiles(projectPath, pattern) {
        // Simple file finding - in production this would use glob
        const files = [];
        const findFilesRecursive = async (dir) => {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
                    await findFilesRecursive(fullPath);
                }
                else if (entry.isFile() && this.matchesPattern(entry.name, pattern)) {
                    files.push(fullPath);
                }
            }
        };
        await findFilesRecursive(projectPath);
        return files;
    }
    shouldSkipDirectory(dirName) {
        const skipDirs = ['node_modules', 'dist', '.angular', '.git', 'coverage'];
        return skipDirs.includes(dirName);
    }
    matchesPattern(fileName, pattern) {
        // Simple pattern matching - in production this would use proper glob matching
        if (pattern.includes('**/*.ts')) {
            return fileName.endsWith('.ts');
        }
        if (pattern.includes('**/*.html')) {
            return fileName.endsWith('.html');
        }
        if (pattern.includes('**/*.{css,scss,sass,less}')) {
            return /\.(css|scss|sass|less)$/.test(fileName);
        }
        return false;
    }
}
exports.CodeTransformer = CodeTransformer;
//# sourceMappingURL=CodeTransformer.js.map