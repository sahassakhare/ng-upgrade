import { TransformationHandler } from '../core/VersionHandlerRegistry';
import { BreakingChange } from '../types';
export declare class CodeTransformer implements TransformationHandler {
    readonly type = "code";
    apply(projectPath: string, change: BreakingChange): Promise<void>;
    private applyApiTransformation;
    private applyTemplateTransformation;
    private applyConfigTransformation;
    private applyStyleTransformation;
    private applyBuildTransformation;
    private applyDependencyTransformation;
    private applyCodeTransformation;
    private applyRegexTransformation;
    private applyAstTransformation;
    private applyFileTransformation;
    private transformFile;
    private findFiles;
    private shouldSkipDirectory;
    private matchesPattern;
}
//# sourceMappingURL=CodeTransformer.d.ts.map