# Automated Build-Run-Test-Push Workflow

This document describes the automated workflow implemented in this project based on the guidelines in `.windsurf/rules/build-run-test-push.md`.

## Overview

The workflow automates the following steps:

1. Terminates any existing Node.js processes running the development script
2. Executes `npm run dev` to start the development server
3. Builds the project with `npm run build`
4. If the build succeeds, runs the project in production mode with `npm run start`
5. Tests the project with `npm test` (which runs Cypress tests)
6. If all tests pass, pushes the changes to the repository
7. Creates a backup branch with a timestamp and the commit message

## Implementation

The workflow is implemented in the `scripts/build-run-test-push.sh` script and can be executed with:

```bash
npm run workflow
```

This command is defined in `package.json` and runs the shell script.

## Script Details

The script includes the following functions:

### Process Management

- `terminate_dev_processes()`: Finds and terminates any running Node.js processes related to the development server
- `start_dev_server()`: Starts the development server with `npm run dev`
- `cleanup()`: Ensures all processes are properly terminated when the script exits

### Build and Test

- `build_project()`: Builds the project with `npm run build`
- `run_project()`: Starts the production server with `npm run start`
- `test_project()`: Runs tests with `npm test`

### Git Operations

- `push_changes()`: Commits and pushes changes to the repository
- `create_backup_branch()`: Creates a backup branch with a timestamp and the commit message

## Error Handling

The script includes error handling to:

- Stop the workflow if the build fails
- Stop the workflow if tests fail
- Clean up processes when the script exits (using a trap)

## Use Cases

This workflow is particularly useful for:

1. **Development Cycle Automation**: Automates the entire development cycle from building to testing to pushing changes
2. **Quality Assurance**: Ensures that code is only pushed if it builds and passes tests
3. **Backup Creation**: Automatically creates backup branches after successful builds
4. **Process Management**: Properly manages Node.js processes to prevent port conflicts

## Integration with GitHub Actions

This local workflow complements the GitHub Actions workflows defined in:

- `.github/workflows/build-and-deploy.yml`
- `.github/workflows/backup-after-build.yml`

While the GitHub Actions workflows handle CI/CD on the remote repository, this local workflow automates the development process on your local machine.

## Customization

You can customize the workflow by editing the `scripts/build-run-test-push.sh` script. Some possible customizations include:

- Changing the commit message format
- Adding additional tests or build steps
- Modifying the backup branch naming convention
- Adding notifications (e.g., desktop notifications when the workflow completes)

## Troubleshooting

If you encounter issues with the workflow:

1. **Process Termination Issues**: If the script fails to terminate existing processes, you may need to manually kill them with `pkill -f "npm run dev"` or `pkill -f "next dev"`
2. **Port Conflicts**: If you see errors about ports already being in use, ensure no other instances of the development or production server are running
3. **Git Authentication**: Ensure your git credentials are properly configured for pushing changes

## Related Documentation

- [README.md](README.md) - Main project documentation
- [DEPENDENCY-MANAGEMENT.md](DEPENDENCY-MANAGEMENT.md) - Information about managing dependencies
- [BACKUP-WORKFLOW.md](BACKUP-WORKFLOW.md) - Details about the backup branch creation process
