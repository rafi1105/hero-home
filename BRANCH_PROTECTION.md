# Branch Protection Guide

This document explains how to protect the `main` branch from force pushes, deletions, and ensure code quality through required checks.

## Overview

Branch protection rules help maintain code quality and prevent accidental changes to important branches. For this repository, we recommend protecting the `main` branch with the following settings.

## Automated Configuration (Recommended)

This repository includes a `.github/settings.yml` file that can automatically configure branch protection rules using the [GitHub Settings App](https://github.com/apps/settings).

### Setup Steps:

1. Install the [GitHub Settings App](https://github.com/apps/settings) on your repository
2. The app will automatically apply the settings from `.github/settings.yml`
3. Settings include:
   - Prevention of force pushes
   - Prevention of branch deletion
   - Required status checks (CI must pass)
   - Required pull request reviews (1 approval)
   - Linear history enforcement
   - Conversation resolution before merge

## Manual Configuration

If you prefer to configure branch protection manually, follow these steps:

### 1. Navigate to Branch Protection Settings

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Select **Branches** from the left sidebar
4. Click **Add branch protection rule**

### 2. Configure Protection Rules

#### Basic Settings:
- **Branch name pattern**: `main`

#### Protection Rules to Enable:

##### ✅ Require a pull request before merging
- ☑️ Require approvals: **1**
- ☑️ Dismiss stale pull request approvals when new commits are pushed
- ☑️ Require review from Code Owners (optional, requires CODEOWNERS file)

##### ✅ Require status checks to pass before merging
- ☑️ Require branches to be up to date before merging
- Add status check: **ci** (from GitHub Actions workflow)

##### ✅ Require conversation resolution before merging
- Ensures all PR comments are resolved

##### ✅ Require linear history
- Prevents merge commits, enforces clean history

##### ✅ Do not allow bypassing the above settings
- Consider enabling based on team size

##### ✅ Rules applied to administrators
- Consider your team's workflow

##### ✅ Restrict who can push to matching branches
- Leave empty to allow all team members with write access

##### ✅ Allow force pushes: **OFF** ❌
- **Important**: Keep this disabled to prevent force pushes

##### ✅ Allow deletions: **OFF** ❌
- **Important**: Keep this disabled to prevent branch deletion

### 3. Save Changes

Click **Create** or **Save changes** at the bottom of the page.

## Required Status Checks

The repository includes a CI workflow (`.github/workflows/ci.yml`) that runs:

### Client Checks:
- ESLint code linting
- Vite production build

### Server Checks:
- Node.js syntax validation

These checks must pass before code can be merged to `main`.

## CI Workflow

The CI workflow runs automatically on:
- All pushes to `main` branch
- All pull requests targeting `main` branch

The workflow tests against Node.js versions 18.x and 20.x to ensure compatibility.

## Benefits of Branch Protection

1. **Prevents Accidents**: No accidental force pushes or branch deletions
2. **Code Quality**: Ensures code is reviewed and passes all checks
3. **Clean History**: Linear history makes debugging easier
4. **Team Collaboration**: Encourages discussion through required reviews
5. **Automated Checks**: CI must pass before merge, catching issues early

## Troubleshooting

### Status Check Not Appearing
- Ensure the CI workflow has run at least once
- The status check name must exactly match: `ci`
- Check the Actions tab to see if workflows are running

### Need to Override Protection
- Repository administrators can temporarily disable rules if needed
- Use with caution and re-enable immediately after

### Updating Rules
- Edit `.github/settings.yml` and push changes (if using GitHub Settings App)
- Or update manually through GitHub UI Settings → Branches

## Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Settings App](https://github.com/probot/settings)

## Questions?

If you have questions about branch protection or need help setting it up, please:
1. Check the GitHub documentation linked above
2. Review the `.github/settings.yml` file in this repository
3. Contact the repository maintainers
