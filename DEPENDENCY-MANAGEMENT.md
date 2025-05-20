# Dependency Management

This document provides guidelines for managing dependencies in this project.

## Package.json and Package-lock.json Synchronization

The `package.json` and `package-lock.json` files must be kept in sync to ensure consistent builds across different environments. When these files get out of sync, you may encounter errors like:

```
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync.
```

### How to Fix Synchronization Issues

If you encounter synchronization issues, you can use the provided script to fix them:

```bash
npm run sync-deps
```

This script will:
1. Remove the `node_modules` directory and `package-lock.json` file
2. Run `npm install` to regenerate the `package-lock.json` file based on the current `package.json`

After running this script, commit the updated `package-lock.json` file:

```bash
git add package-lock.json
git commit -m "chore: update package-lock.json to match package.json"
git push
```

### Automated Fixes in CI/CD

Our GitHub Actions workflow is configured to automatically handle package.json and package-lock.json mismatches:

1. It first tries to use `npm ci` for faster, more reliable builds
2. If that fails due to a mismatch, it falls back to `npm install` to update the package-lock.json file
3. If running on the main branch, it automatically commits the updated package-lock.json file

This ensures that our CI/CD pipeline can continue to build and deploy even when there are dependency mismatches.

## Best Practices

1. **Always commit both files together**: When updating dependencies, make sure to commit both `package.json` and `package-lock.json` in the same commit.

2. **Use exact versions**: Consider using exact versions (without `^` or `~`) for critical dependencies to ensure consistent behavior.

3. **Regular updates**: Regularly update dependencies to get security fixes and new features.

4. **Test after updates**: Always test your application after updating dependencies to ensure everything still works as expected.

5. **Review lockfile changes**: When reviewing PRs, pay attention to changes in the lockfile to catch unexpected dependency changes.

## Troubleshooting

If you encounter other dependency-related issues:

1. **Clear npm cache**: `npm cache clean --force`
2. **Remove node_modules**: `rm -rf node_modules`
3. **Reinstall dependencies**: `npm install`
4. **Check for conflicting dependencies**: `npm ls`
5. **Update npm**: `npm install -g npm@latest`
