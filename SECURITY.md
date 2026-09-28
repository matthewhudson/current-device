# Security Policy

## Supported Versions

| Version | Supported |
| --- | --- |
| 2.x | Yes |
| 0.10.x and earlier | No |

## Reporting a Vulnerability

Please report vulnerabilities privately through GitHub's
[security advisories](https://github.com/matthewhudson/current-device/security/advisories/new)
("Report a vulnerability" on the Security tab), not in a public issue.

You should get a first reply within a week. Fixes are released as a patch
version and announced in the [changelog](CHANGELOG.md) and the GitHub release
notes.

current-device runs in the browser, reads `navigator.userAgent` and a few other
`window` properties, and writes CSS classes to `<html>` and the `device`
global. It makes no network requests and stores nothing.
