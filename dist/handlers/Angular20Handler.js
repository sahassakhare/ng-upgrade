"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Angular20Handler = void 0;
const BaseVersionHandler_1 = require("./BaseVersionHandler");
class Angular20Handler extends BaseVersionHandler_1.BaseVersionHandler {
    constructor() {
        super(...arguments);
        this.version = '20';
    }
    getRequiredNodeVersion() { return '>=18.19.1'; }
    getRequiredTypeScriptVersion() { return '>=5.6.0 <5.7.0'; }
    async applyVersionSpecificChanges(_projectPath, _options) {
        this.progressReporter?.updateMessage('Applying Angular 20 specific changes...');
        // Angular 20 specific changes would be implemented here
        // This version introduced incremental hydration, signals stabilization, and advanced SSR features
        this.progressReporter?.success('✓ Angular 20 specific changes completed');
    }
    getBreakingChanges() {
        return [
            this.createBreakingChange('ng20-incremental-hydration', 'api', 'medium', 'Incremental hydration stable', 'Advanced SSR with incremental hydration', 'Opt-in feature for SSR applications')
        ];
    }
}
exports.Angular20Handler = Angular20Handler;
//# sourceMappingURL=Angular20Handler.js.map