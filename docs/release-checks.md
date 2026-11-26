# Focused release checks

Every push to main builds and publishes automatically after its selected checks pass. No repeated chat monitoring is needed. The Actions summary names each selected unit file/browser flow and the number of changed images.

- Unit selection follows local source references transitively, plus feature-specific coverage.
- UI changes run UI units and a representative desktop/mobile gameplay flow.
- Trainer changes run shared-pool and sheet browser checks. Battle changes run battle/capture/party checks.
- Changed image assets are decoded individually; unchanged catalogues are skipped. Metadata coverage tests remain available.
- Dependency/runtime engine/shared data changes and unknown source changes conservatively select full checks.
- Release query-tag changes and package version/test-command changes alone do not invalidate unrelated coverage. Actual dependency edits still do.
- Dependencies and the generated simulator are cached by dependency content/build script, not game version. Site staging always runs so the uploaded artifact matches the commit.
- Manual full regression: Actions → Publish Gymbound → Run workflow → enable Full checks. This retains all previous unit and browser coverage, including the unblocked offline/PWA test. Ordinary functional browsers block service workers and use controlled sheet fixtures.

Local usage: `node scripts/select-checks.mjs --files /tmp/changed-files.json`, then `npm run test:changed`, `npm run stage`, and `npm run test:browser:changed`. With a Git checkout use `--base <commit>`; add `--full` for a complete check. Selected commands fail on missing tests or nonzero test exits; deployment is gated on success.
