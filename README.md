# spamalot

For when you need to manage packages from a dozen different ecosystems alongside a bunch of git repositories

| Package                                 | Description                                                      |
| --------------------------------------- | ---------------------------------------------------------------- |
| [`@spamalot/core`](packages/core)       | Package, manager, transaction, and scope abstractions            |
| [`@spamalot/npm`](packages/npm)         | npm registry APIs, lockfile parsing, and the npm package manager |
| [`@spamalot/dnf`](packages/dnf)         | The dnf package manager, using libdnf                            |
| [`@spamalot/flatpak`](packages/flatpak) | The Flatpak package manager, using girbind                       |
| [`@spamalot/cli`](packages/cli)         | The `spam` command                                               |

The CLI depends on the dnf and Flatpak backends optionally, and skips any backend that isn't installed.
