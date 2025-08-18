"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Angular16Handler = void 0;
const BaseVersionHandler_1 = require("./BaseVersionHandler");
class Angular16Handler extends BaseVersionHandler_1.BaseVersionHandler {
    constructor() {
        super(...arguments);
        this.version = '16';
    }
    getRequiredNodeVersion() { return '>=16.14.0'; }
    getRequiredTypeScriptVersion() { return '>=4.9.3 <5.1.0'; }
    async applyVersionSpecificChanges(_projectPath, _options) {
        this.progressReporter?.updateMessage('Applying Angular 16 specific changes...');
        // Angular 16 specific changes would be implemented here
        // This version introduced required inputs, router data as input, and new control flow syntax
        this.progressReporter?.success('✓ Angular 16 specific changes completed');
    }
    getBreakingChanges() {
        return [
            this.createBreakingChange('ng16-required-inputs', 'api', 'medium', 'Required inputs introduced', 'New required inputs API available', 'Optional feature - existing inputs continue to work')
        ];
    }
}
exports.Angular16Handler = Angular16Handler;
//# sourceMappingURL=Angular16Handler.js.map