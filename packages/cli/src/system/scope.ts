import type { PackageManager, PackageManagerName, ScopeLike } from '@spamalot/core';
import { Npm } from '@spamalot/npm';
import * as fs from 'node:fs';
import * as os from 'node:os';
import type { UserScope } from '../scope.js';
import { isRoot } from './utils.js';

/**
 * A manager from an optional backend package.
 * The package is imported when the manager is loaded, so a missing backend fails like any other manager.
 */
function optionalManager(name: PackageManagerName, importBackend: () => Promise<{ default: PackageManager }>): PackageManager {
	let backend: PackageManager | undefined;

	function loaded(): PackageManager {
		if (!backend) throw new Error(`${name} is not loaded`);
		return backend;
	}

	return {
		name,
		async load(options) {
			backend = (await importBackend()).default;
			await backend.load(options);
		},
		query: (...filters) => loaded().query(...filters),
		transaction: init => loaded().transaction(init),
	};
}

export function* packageManagers() {
	yield optionalManager('dnf', () => import('@spamalot/dnf'));
	yield optionalManager('flatpak', () => import('@spamalot/flatpak'));
	if (fs.existsSync('/usr/lib/package-lock.json')) yield new Npm('/usr/lib');
}

export const system = {
	type: 'system',
	get name() {
		return os.homedir();
	},
	get writable() {
		return isRoot();
	},
	packageManagers,
	get contains(): UserScope[] {
		// @todo
		return [];
	},
} as const satisfies ScopeLike;
