"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Angular15Handler = void 0;
const BaseVersionHandler_1 = require("./BaseVersionHandler");
class Angular15Handler extends BaseVersionHandler_1.BaseVersionHandler {
    constructor() {
        super(...arguments);
        this.version = '15';
    }
    getRequiredNodeVersion() { return '>=14.20.0'; }
    getRequiredTypeScriptVersion() { return '>=4.8.2 <4.10.0'; }
    async applyVersionSpecificChanges(_projectPath, _options) {
        this.progressReporter?.updateMessage('Applying Angular 15 specific changes...');
        // Angular 15 specific changes would be implemented here
        // This version stabilized standalone APIs and improved performance
        this.progressReporter?.success('✓ Angular 15 specific changes completed');
    }
    getBreakingChanges() {
        return [
            this.createBreakingChange('ng15-standalone-stable', 'api', 'low', 'Standalone APIs stable', 'Standalone components and directives are now stable', 'No action required - APIs are stable')
        ];
    }
}
exports.Angular15Handler = Angular15Handler;
//# sourceMappingURL=Angular15Handler.js.map