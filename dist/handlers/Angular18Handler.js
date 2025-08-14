"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Angular18Handler = void 0;
const BaseVersionHandler_1 = require("./BaseVersionHandler");
class Angular18Handler extends BaseVersionHandler_1.BaseVersionHandler {
    constructor() {
        super(...arguments);
        this.version = '18';
    }
    getRequiredNodeVersion() { return '>=18.19.1'; }
    getRequiredTypeScriptVersion() { return '>=5.4.0 <5.5.0'; }
    async applyVersionSpecificChanges(projectPath, options) {
        console.log('Applying Angular 18 specific changes...');
    }
    getBreakingChanges() {
        return [
            this.createBreakingChange('ng18-material3', 'dependency', 'medium', 'Material 3 support', 'Angular Material updated with Material Design 3', 'Review Material component designs for visual changes')
        ];
    }
}
exports.Angular18Handler = Angular18Handler;
//# sourceMappingURL=Angular18Handler.js.map