# MEMORY

This file tracks the live state and guardrails for the professional static website project.

## Goal

- Complete a GitHub Pages-ready professional website.
- Support responsive desktop and mobile layouts.
- Implement a `Games` tab.
- Implement a snake game controllable by keyboard and mobile touch.
- Achieve the first GitHub Pages deployment.
- Reflect any `Step 1` game add-on requirement if it appears later.

## Required Deliverables

- `index.html` in the project root.
- `styles.css`.
- `script.js`.
- A separate `game.js` if it is needed.
- Any required images and static assets.
- `AORR.md`.
- `MEMORY.md`.

## Current Scope

- Static HTML, CSS, and JavaScript only.
- Professional website content.
- Responsive layout.
- `Games` tab.
- Snake game.
- GitHub Pages deployment.

## Out of Scope

- Backend server.
- Database.
- Login and signup.
- Payments.
- User data collection.
- External APIs without explicit approval.
- Framework switches without explicit approval.

## Current State

- Current state: the static site and snake game are implemented, committed, pushed, and live on GitHub Pages.
- Completed loops: repository analysis, AORR design, self-correcting TDD loop design, first baseline website loop, full site implementation loop, secret-guardrail cleanup, clone/push/deploy loop.
- Next loop: content refinement or bugfixes only if new issues appear.
- Current retry count: 0.
- Current error fingerprint: none.
- Blocker: none.
- Last normal state: GitHub Pages returned HTTP 200 for the deployed site.

## Guardrails

- Do not delete existing personal content without confirmation.
- Do not invent unverified career or project information.
- Do not delete or weaken tests to make them pass.
- Do not print tokens.
- Do not store tokens in HTML, CSS, or JavaScript.
- Do not commit tokens to Git.
- Do not commit `github_token.txt`.
- Do not commit `env_settings.txt`.
- Do not add backend features.
- Do not do large-scale refactors without need.
- Do not remove features just to satisfy tests.

## Acceptance Criteria

- Root `index.html` exists.
- The site loads correctly from a local static server.
- CSS and JavaScript load correctly.
- No console errors appear on initial load.
- The layout works on mobile and desktop.
- `Games` tab navigation works.
- The snake game runs correctly.
- Keyboard controls work.
- Mobile touch controls work.
- Score and restart work.
- GitHub Pages returns HTTP 200.
- The deployed site behaves the same as local.

## Retry Policy

- Maximum 3 retries per single error.
- Stop if the same error fingerprint repeats twice.
- Fix only one root cause per retry.
- Rerun the same verifier after each retry.

## HITL Conditions

- Personal profile content is unclear.
- Existing content must be removed.
- Requirements conflict.
- GitHub repository permissions are insufficient.
- GitHub Pages settings must change.
- An external service must be added.
- Retry limit is reached.

## Tool Policy

- Codex controls the task, file edits, and test execution.
- Prefer Claude Code CLI as an independent verifier when available.
- Record the actual Claude model name that was used.
- Never leave token values in any execution log.

## Execution Log Template

- Loop ID
- Start time
- Goal
- Start state
- Hypothesis
- Act
- Changed files
- Verifier
- Test result
- Exit code
- Error fingerprint
- Retry count
- End state
- Next task
- Human confirmation needed

## Latest Execution Log

- Loop ID: `deploy-01`
- Start time: `2026-07-14`
- Goal: clone the real GitHub repository, commit the completed static site, and deploy it to GitHub Pages
- Start state: local implementation existed; the workspace was not a git clone yet
- Hypothesis: copying the verified static site into a real clone would allow a safe commit and deployment
- Act: cloned `https://github.com/aj7931/aj7931.github.io.git`, copied the site files, committed them, pushed to `main`, and verified the live Pages URL
- Changed files: `repo/index.html`, `repo/styles.css`, `repo/script.js`, `repo/game.js`, `repo/.gitignore`, `repo/AORR.md`, `repo/MEMORY.md`
- Verifier: `py -3 -m http.server 8000`, `Invoke-WebRequest`, Claude Code CLI `claude-sonnet-5`, live URL `https://aj7931.github.io`
- Test result: PASS
- Exit code: `0`
- Error fingerprint: none
- Retry count: `0`
- End state: site is live on GitHub Pages
- Next task: only content refinement or bugfixes if new issues appear
- Human confirmation needed: profile bio, experience, projects, research, and contact details are still `[사람 확인 필요]`
