"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Angular14Handler = void 0;
const BaseVersionHandler_1 = require("./BaseVersionHandler");
class Angular14Handler extends BaseVersionHandler_1.BaseVersionHandler {
    constructor() {
        super(...arguments);
        this.version = '14';
    }
    getRequiredNodeVersion() {
        return '>=14.15.0';
    }
    getRequiredTypeScriptVersion() {
        return '>=4.7.2 <4.8.0';
    }
    async applyVersionSpecificChanges(_projectPath, _options) {
        this.progressReporter?.updateMessage('Applying Angular 14 specific changes...');
        // Angular 14 specific changes would be implemented here
        this.progressReporter?.success('Angular 14 upgrade steps completed');
    }
    getBreakingChanges() {
        return [
            this.createBreakingChange('ng14-standalone-components', 'api', 'medium', 'Standalone components introduced', 'New way to create components without NgModules', 'Standalone components are optional - existing NgModule approach still works')
        ];
    }
}
exports.Angular14Handler = Angular14Handler;
//# sourceMappingURL=Angular14Handler.js.map