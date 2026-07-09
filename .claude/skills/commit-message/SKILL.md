---
name: commit-message
description: Generate a commit message from the current git changes, following this repo's commit style. Use when the user wants a commit message drafted before committing, e.g. "/commit-message" or "write me a commit message".
argument-hint: Optional hint about the change (e.g. "fix login bug")
---

## Your task

1. Run `git status`, and `git diff --staged` (if nothing is staged, use `git diff` instead) to see what changed.
2. Run `git log -10 --oneline` to learn this repository's commit message style/conventions.
3. Draft a concise commit message (1-2 sentences) that explains *why* the change was made, not just what changed. If $ARGUMENTS is provided, use it as context/hint about the intent of the change.
4. Output the drafted commit message as plain text for the user to review. Do NOT run `git commit` yourself — only commit if the user explicitly asks you to, using the drafted message.
