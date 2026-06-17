# GitHub Publish

The project is already initialized as a local Git repository with the first commit.

## Current Local Commit

- Branch: `master`
- Commit message: `Initial Nuvoro Market MVP`

## If The GitHub Repository Already Exists

Use the repository URL from GitHub and run:

```bash
git remote add origin https://github.com/YOUR_USERNAME_OR_ORG/nuvoro-market.git
git branch -M main
git push -u origin main
```

If GitHub says the remote already has files, create a branch instead:

```bash
git checkout -b initial-mvp
git remote add origin https://github.com/YOUR_USERNAME_OR_ORG/nuvoro-market.git
git push -u origin initial-mvp
```

Then open a pull request from `initial-mvp` into the default branch.

## If The Repository Does Not Exist Yet

Create a new empty GitHub repository named `nuvoro-market`, then run the commands above.

Do not initialize the GitHub repository with a README, license or `.gitignore` if you want the first push to be clean.

## Codex Connector Note

In this Codex session, the GitHub connector was available, but `nuvoro-market` was not found in installed or public repository search. Once the repository exists or the GitHub app has access to it, Codex can use `owner/name` to write files or inspect the repository directly.
