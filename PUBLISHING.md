# NPM Publishing Guide

This document outlines the process for publishing the Angular Multi-Version Upgrade Orchestrator to npm.

## Prerequisites

### 1. NPM Account Setup
- Create an account at [npmjs.com](https://www.npmjs.com/)
- Enable two-factor authentication (2FA)
- Generate an access token with publish permissions

### 2. GitHub Repository Setup
- Ensure repository is public or you have npm Pro/Teams
- Add the following secrets to your GitHub repository:
  - `NPM_TOKEN`: Your npm access token

## Publishing Methods

### Method 1: Automated Publishing via GitHub Releases

1. **Create a Release**:
   ```bash
   # Tag the current commit
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Create GitHub Release**:
   - Go to your repository on GitHub
   - Click "Releases" → "Create a new release"
   - Select the tag you just created
   - Fill in release notes
   - Click "Publish release"

3. **Automated Publishing**:
   - The GitHub Action will automatically trigger
   - It will build, test, and publish to npm
   - Check the Actions tab for progress

### Method 2: Manual Publishing via GitHub Actions

1. **Go to Actions Tab**:
   - Navigate to your repository's Actions tab
   - Select "Publish to NPM" workflow

2. **Run Workflow**:
   - Click "Run workflow"
   - Choose the version bump type:
     - `patch`: 1.0.0 → 1.0.1 (bug fixes)
     - `minor`: 1.0.0 → 1.1.0 (new features)
     - `major`: 1.0.0 → 2.0.0 (breaking changes)
     - Or specify exact version like `1.2.3`

3. **Monitor Progress**:
   - The workflow will run all tests and checks
   - If successful, it will publish to npm
   - A git tag will be created automatically

### Method 3: Local Publishing

```bash
# 1. Ensure you're logged into npm
npm login

# 2. Run pre-publish checks
npm run build
npm run test
npm run lint

# 3. Update version
npm version patch  # or minor/major

# 4. Publish
npm publish --access public

# 5. Push tags
git push origin --tags
```

## Release Checklist

### Pre-Release
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version bumped appropriately
- [ ] CHANGELOG.md updated with new features/fixes
- [ ] Breaking changes documented
- [ ] Dependencies updated and security audited

### Release Process
- [ ] Create and push git tag
- [ ] Create GitHub release with release notes
- [ ] Verify npm package publication
- [ ] Test package installation: `npm install -g ng-upgrade-orchestrator`
- [ ] Verify CLI works: `ng-upgrade --help`

### Post-Release
- [ ] Update documentation if needed
- [ ] Announce release on relevant channels
- [ ] Monitor for issues and feedback
- [ ] Prepare next version planning

## Version Strategy

Follow [Semantic Versioning (SemVer)](https://semver.org/):

- **MAJOR**: Breaking changes, incompatible API changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

## Rollback Process

If a release has issues:

1. **Deprecate problematic version**:
   ```bash
   npm deprecate ng-upgrade-orchestrator@1.0.1 "Please upgrade to 1.0.2"
   ```

2. **Publish fixed version**:
   ```bash
   npm version patch
   npm publish
   ```

3. **Update documentation** with migration notes

## Package Validation

Before publishing, validate the package contents:

```bash
# See what files will be included
npm pack --dry-run

# Create tarball for inspection
npm pack
tar -tzf ng-upgrade-orchestrator-*.tgz
```

## Troubleshooting

### Common Issues

1. **Authentication errors**:
   - Verify npm token is valid
   - Check token permissions include publish
   - Ensure 2FA is properly configured

2. **Package name conflicts**:
   - Choose a unique package name
   - Check availability: `npm view <package-name>`

3. **Build failures**:
   - Ensure all dependencies are properly installed
   - Check TypeScript compilation
   - Verify all paths in package.json are correct

4. **Test failures**:
   - Run tests locally first
   - Check for environment-specific issues
   - Ensure all test dependencies are included

### Support

For publishing issues:
- Check [npm documentation](https://docs.npmjs.com/)
- Review GitHub Actions logs
- Contact npm support if needed

## Security Considerations

- Never commit npm tokens to version control
- Use GitHub secrets for automation
- Enable package provenance for supply chain security
- Regularly audit dependencies for vulnerabilities
- Keep access tokens minimal and time-limited

## Monitoring

After publishing, monitor:
- Download statistics on npm
- GitHub issues for bug reports
- Security advisories
- Community feedback and feature requests