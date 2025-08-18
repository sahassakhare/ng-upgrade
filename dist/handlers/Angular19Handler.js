"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Angular19Handler = void 0;
const BaseVersionHandler_1 = require("./BaseVersionHandler");
class Angular19Handler extends BaseVersionHandler_1.BaseVersionHandler {
    constructor() {
        super(...arguments);
        this.version = '19';
    }
    getRequiredNodeVersion() { return '>=18.19.1'; }
    getRequiredTypeScriptVersion() { return '>=5.5.0 <5.6.0'; }
    async applyVersionSpecificChanges(_projectPath, _options) {
        this.progressReporter?.updateMessage('Applying Angular 19 specific changes...');
        // Angular 19 specific changes would be implemented here
        // This version introduced zoneless change detection, event replay, and hybrid rendering capabilities
        this.progressReporter?.success('✓ Angular 19 specific changes completed');
    }
    getBreakingChanges() {
        return [
            this.createBreakingChange('ng19-zoneless', 'api', 'high', 'Zoneless change detection available', 'Optional zoneless change detection', 'Zoneless detection is opt-in - Zone.js continues to work')
        ];
    }
}
exports.Angular19Handler = Angular19Handler;
//# sourceMappingURL=Angular19Handler.js.map