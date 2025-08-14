"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Angular13Handler = void 0;
const BaseVersionHandler_1 = require("./BaseVersionHandler");
class Angular13Handler extends BaseVersionHandler_1.BaseVersionHandler {
    constructor() {
        super(...arguments);
        this.version = '13';
    }
    getRequiredNodeVersion() {
        return '>=12.20.0';
    }
    getRequiredTypeScriptVersion() {
        return '>=4.4.2 <4.6.0';
    }
    async applyVersionSpecificChanges(projectPath, options) {
        console.log('Applying Angular 13 specific changes...');
        // Angular 13 specific changes would be implemented here
    }
    getBreakingChanges() {
        return [
            this.createBreakingChange('ng13-view-engine-removal', 'build', 'critical', 'View Engine completely removed', 'All applications must use Ivy renderer', 'Ensure all dependencies are Ivy-compatible'),
            this.createBreakingChange('ng13-angular-package-format', 'build', 'medium', 'Angular Package Format changes', 'Libraries must use new package format', 'Update library build configurations')
        ];
    }
}
exports.Angular13Handler = Angular13Handler;
//# sourceMappingURL=Angular13Handler.js.map