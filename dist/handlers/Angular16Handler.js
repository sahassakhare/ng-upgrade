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
    async applyVersionSpecificChanges(projectPath, options) {
        console.log('Applying Angular 16 specific changes...');
    }
    getBreakingChanges() {
        return [
            this.createBreakingChange('ng16-required-inputs', 'api', 'medium', 'Required inputs introduced', 'New required inputs API available', 'Optional feature - existing inputs continue to work')
        ];
    }
}
exports.Angular16Handler = Angular16Handler;
//# sourceMappingURL=Angular16Handler.js.map