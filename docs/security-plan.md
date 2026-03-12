# GHAS Security Remediation Plan

**Date:** 2026-03-12
**Repository:** equinor/procosys-js-frontend
**Total open alerts:** 90+ Dependabot, 3 Code Scanning, 0 Secret Scanning

---

## Summary

| Severity | Alert Count | Unique Packages |
|----------|-------------|-----------------|
| Critical | 7           | 5 (`elliptic`, `pbkdf2`, `sha.js`, `cipher-base`, `form-data`) |
| High     | 40+         | 14 (`axios`, `tar`, `serialize-javascript`, `minimatch`, `ip`, `path-to-regexp`, `immutable`, `rollup`, `node-forge`, `glob`, `cross-spawn`, `webpack-dev-middleware`, `webpack-dev-server` (medium but grouped here)) |
| Medium   | 25+         | 14 (`vite`, `react-router`, `lodash`, `prismjs`, `store2`, `js-yaml`, `bn.js`, `ajv`, `esbuild`, `nanoid`, `@babel/*`, `http-proxy-middleware`, `webpack-dev-server`) |
| Low      | 10+         | 8 (`elliptic` (low variant), `brace-expansion`, `on-headers`, `snyk`, `min-document`, `vite` (low variants), `@tootallnate/once`, `webpack`) |
| Code Scanning | 3      | Tainted format string, missing workflow permissions (x2) |

---

## Phase 1: Critical Vulnerabilities (Immediate)

### 1.1 Update `elliptic`

- **Alerts:** #105, #90
- **Severity:** Critical
- **Issue:** Private key extraction in ECDSA upon signing a malformed input
- **Current version:** `6.5.7` (direct dep in `package.json:108`, resolution in `package.json:201`)
- **Action:** Update to latest patched version in both `dependencies` and `resolutions`
- **Note:** Verify whether `elliptic` is actually imported by application code or is only a transitive-dep resolution override. If the latter, move it to `resolutions` only and remove from `dependencies`.

### 1.2 Fix `pbkdf2` (2 CVEs)

- **Alerts:** #163 (CVE-2025-6547), #121 (CVE-2025-6545)
- **Severity:** Critical
- **Issue:** Silently disregards Uint8Array input returning static keys; returns predictable zero-filled memory for non-normalized algos
- **Current version:** Transitive (via `browserify-sign@4.2.2` at `package.json:103`)
- **Action:** Update `browserify-sign` to latest version, or add `pbkdf2` to `resolutions`/`pnpm.overrides` with the patched version
- **Note:** `browserify-sign` is a Node.js crypto polyfill. Investigate whether it is needed at all in this browser frontend that uses `@azure/msal-browser`.

### 1.3 Fix `sha.js`

- **Alerts:** #127 (CVE-2025-9288)
- **Severity:** Critical
- **Issue:** Missing type checks leading to hash rewind and passing on crafted data
- **Current version:** Transitive (likely via `browserify-sign` or `crypto-browserify`)
- **Action:** Add `sha.js` to `resolutions`/`pnpm.overrides` with the patched version, or update `browserify-sign`

### 1.4 Fix `cipher-base`

- **Alerts:** #126 (CVE-2025-9287)
- **Severity:** Critical
- **Issue:** Missing type checks leading to hash rewind and passing on crafted data
- **Current version:** Transitive (likely via `browserify-sign` or `crypto-browserify`)
- **Action:** Add `cipher-base` to `resolutions`/`pnpm.overrides` with the patched version, or update `browserify-sign`

### 1.5 Fix `form-data`

- **Alerts:** #125 (CVE-2025-7783)
- **Severity:** Critical
- **Issue:** Uses unsafe random function for choosing multipart boundary
- **Current version:** Transitive (likely via `axios` or test tooling)
- **Action:** Add `form-data` to `resolutions`/`pnpm.overrides` with patched version. Updating `axios` (Phase 2) may also resolve this transitively.

---

## Phase 2: High-Severity Direct Dependencies (This Sprint)

### 2.1 Update `axios`

- **Alerts:** #168/#169 (CVE-2026-25639), #131/#95 (CVE-2025-58754), #110/#92 (CVE-2025-27152)
- **Severity:** High (3 distinct CVEs)
- **Issue:** DoS via `__proto__` key in mergeConfig; DoS via lack of data size check; SSRF + credential leakage via absolute URL
- **Current version:** `1.7.4` (direct dep at `package.json:100`)
- **Action:** Update to latest `1.x` (currently `>=1.8.x`)
- **Impact:** `axios` is used throughout the app for API calls. Run full test suite after update.

### 2.2 Update `tar`

- **Alerts:** #197/#196, #193/#192, #166/#165, #156/#155, #153/#152, #151/#150 (6 distinct CVEs)
- **Severity:** High
- **Issue:** Multiple path traversal, symlink poisoning, arbitrary file overwrite vulnerabilities
- **Current version:** `6.2.1` (direct dep at `package.json:151`, resolution at `package.json:174`)
- **Action:** Update to latest `6.x` or `7.x` in both `dependencies` and `resolutions`
- **Note:** Likely a resolution override only (not imported by app code). Verify and consider moving to `resolutions` only.

### 2.3 Update `serialize-javascript`

- **Alerts:** #190/#189
- **Severity:** High
- **Issue:** RCE via RegExp.flags and Date.prototype.toISOString()
- **Current version:** `6.0.2` (direct dep at `package.json:148`, resolution at `package.json:204`)
- **Action:** Update to latest patched version in both `dependencies` and `resolutions`

### 2.4 Update `minimatch`

- **Alerts:** #188/#187/#186/#185/#184/#183/#182/#181/#180/#178/#177/#176 (3 distinct CVEs)
- **Severity:** High
- **Issue:** Multiple ReDoS vulnerabilities (matchOne backtracking, extglob backtracking, wildcard backtracking)
- **Current version:** `3.0.5` (direct dep at `package.json:123`)
- **Action:** Update to `>=3.1.2` or consider migrating to `5.x` or `picomatch`

### 2.5 Update `ip`

- **Alerts:** #97/#88 (CVE-2024-29415)
- **Severity:** High
- **Issue:** SSRF improper categorization in isPublic
- **Current version:** `2.0.1` (direct dep at `package.json:115`, resolution at `package.json:186`)
- **Action:** Update to `>=2.0.2` in both `dependencies` and `resolutions`

### 2.6 Update `path-to-regexp`

- **Alerts:** #100 (CVE-2024-52798)
- **Severity:** High
- **Issue:** ReDoS
- **Current version:** `8.0.0` (direct dep at `package.json:127`)
- **Action:** Update to `>=8.2.0`

### 2.7 Fix high-severity transitive dependencies

| Package | Alert(s) | CVE | Action |
|---------|----------|-----|--------|
| `immutable` | #195 | CVE-2026-29063 | Add resolution override or update Storybook |
| `rollup` | #179 | CVE-2026-27606 | Update `vite` (see Phase 3) |
| `node-forge` | #141, #140 | CVE-2025-66031, CVE-2025-12816 | Add resolution override |
| `glob` | #138 | CVE-2025-64756 | Add resolution override |
| `cross-spawn` | #99 | CVE-2024-21538 | Add resolution override |
| `webpack-dev-middleware` | #96 | CVE-2024-29180 | Update dev tooling |

---

## Phase 3: Medium Severity + Dev Tooling (Next Sprint)

### 3.1 Update `vite`

- **Alerts:** #132, #129, #128, #116, #113, #112, #111, #109, #102 (8+ CVEs)
- **Severity:** Medium (multiple `server.fs.deny` bypasses)
- **Current version:** `^4.5.0` (devDependency at `package.json:77`)
- **Action:** Update to `^4.5.14` minimum. Ideally migrate to `vite ^5.x` or `^6.x`.
- **Note:** This will also resolve the `rollup` high-severity alert (#179).

### 3.2 Update `react-router-dom`

- **Alerts:** #147 (CVE-2025-68470)
- **Severity:** Medium
- **Issue:** Unexpected external redirect via untrusted paths
- **Current version:** `6.0.0` (direct dep at `package.json:141`)
- **Action:** Update to latest `6.x`

### 3.3 Update `prismjs`

- **Alerts:** #106/#91 (CVE-2024-53382)
- **Severity:** Medium
- **Issue:** DOM Clobbering vulnerability
- **Current version:** `1.27.0` (direct dep at `package.json:129`, resolution at `package.json:169`)
- **Action:** Update to latest patched version

### 3.4 Other medium-severity updates

| Package | Alert(s) | Action |
|---------|----------|--------|
| `lodash` | #154 | Add resolution for patched version |
| `webpack-dev-server` | #118, #117 | Update dev dependency |
| `store2` | #103 | Add resolution or update parent |
| `js-yaml` | #135, #134 | Add resolution override |
| `bn.js` | #175, #174 | Add resolution override |
| `ajv` | #172, #171 | Add resolution override |
| `http-proxy-middleware` | #115, #114 | Add resolution override |
| `@babel/runtime`, `@babel/helpers` | #108, #107 | Update Babel packages |
| `esbuild` | #104 | Update via `vite` update |
| `nanoid` | #101 | Add resolution override |

---

## Phase 4: Code Scanning Issues

### 4.1 Tainted format string in PlantContext

- **Alert:** #3
- **File:** `src/core/PlantContext.tsx:113`
- **Issue:** User-controlled `plantId` (from URL path) is interpolated into a template literal in an exception message. This is a tainted format string.
- **Action:** Sanitize `plantId` before including it in the error message, or use a structured error object instead of string interpolation:
  ```typescript
  // Before (vulnerable):
  throw new InvalidParameterException(
      `Available plants: ${user.plants}, PlantID: ${plantId} does not exist. , plantInPath: ${plantInPath}`
  );

  // After (safe):
  throw new InvalidParameterException(
      'PlantID does not exist',
      { plantId: String(plantId), plantInPath: String(plantInPath) }
  );
  ```

### 4.2 Missing workflow permissions in `prettier.yml`

- **Alert:** #2
- **File:** `.github/workflows/prettier.yml:11`
- **Action:** Add explicit permissions block:
  ```yaml
  permissions:
    contents: write
  ```

### 4.3 Missing workflow permissions in `ci-build.yml`

- **Alert:** #1
- **File:** `.github/workflows/ci-build.yml:8`
- **Action:** Add explicit permissions block:
  ```yaml
  permissions:
    contents: read
  ```

---

## Phase 5: Structural Cleanup

### 5.1 Audit `resolutions` block

The `package.json` `resolutions` block contains 45 entries, many of which are manual vulnerability patches. After completing Phases 1-3:
- Remove resolutions where the parent dependency now pulls in the patched version natively
- Migrate remaining overrides from `resolutions` (Yarn-style) to `pnpm.overrides` if using pnpm as the primary package manager

### 5.2 Audit "resolution-only" direct dependencies

Several packages in `dependencies` appear to be listed solely to force version resolution rather than being imported by application code. Candidates to investigate:
- `tar` -- Node.js archive tool, unlikely needed in browser frontend
- `elliptic` -- Low-level crypto, likely pulled by `browserify-sign`
- `ip` -- Node.js IP utility
- `browserify-sign` -- Node.js crypto polyfill (may be unnecessary with `@azure/msal-browser`)
- `serialize-javascript` -- Typically a build tool dependency
- `minimatch` -- Typically a build/test tool dependency

**Action:** For each, check if it is `import`ed anywhere in `src/`. If not, remove from `dependencies` and keep only in `resolutions`/`pnpm.overrides`.

### 5.3 Consider removing `snyk`

`snyk` is listed as a devDependency (`package.json:70`) but GHAS/Dependabot is already providing vulnerability scanning. The `snyk` CLI itself has a low-severity alert (#123). Consider removing it to reduce attack surface and avoid duplicate scanning.

---

## Verification Steps

After each phase:
1. Run `pnpm install` and verify lockfile updates cleanly
2. Run `pnpm build` (TypeScript type check)
3. Run `pnpm bundle` (Vite production build)
4. Run tests if available
5. Verify Dependabot alerts auto-close on GitHub after push
6. Review any new alerts introduced by version bumps
