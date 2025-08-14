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
    async applyVersionSpecificChanges(projectPath, options) {
        console.log('Applying Angular 20 specific changes...');
    }
    getBreakingChanges() {
        return [
            this.createBreakingChange('ng20-incremental-hydration', 'api', 'medium', 'Incremental hydration stable', 'Advanced SSR with incremental hydration', 'Opt-in feature for SSR applications')
        ];
    }
}
exports.Angular20Handler = Angular20Handler;
//# sourceMappingURL=Angular20Handler.js.map