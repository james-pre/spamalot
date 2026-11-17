import type { PackageManager, PackageManagerName } from './manager.js';

/**
 * Spam keeps track of stuff in three kinds of scopes:
 * - system: Shared across users, system-wide, you get the idea. Think of stuff in `/usr/bin` and `/etc`.
 * - user: Globally available for a user. For example, `~/.config`.
 * - local: This is for things like git repositories
 *
 * What is there is keep track of?
 * - config
 * - cache
 * - packages
 * - sources
 */

export const sourceControlTools = ['git'] as const;

export type SourceControlTool = (typeof sourceControlTools)[number];

export interface GetPackageOptions {
	onManagerFail?(from: PackageManagerName, error: Error): void;
}

export interface ScopeLike {
	readonly type: string;
	readonly name: string;
	readonly writable: boolean;

	readonly contains?: ScopeLike[];
	packageManagers(): IterableIterator<PackageManager> | PackageManager[];

	/**
	 * Local scopes should have source control.
	 * (they don't have to though)
	 */
	readonly sourceControl?: SourceControlTool;
}

export async function* getPackages(scope: ScopeLike, opts: GetPackageOptions = {}) {
	for (const manager of scope.packageManagers()) {
		try {
			await manager.load({ write: false });

			for (const pkg of await manager.query('installed')) yield Object.assign(pkg, { from: manager.name } as const);
		} catch (err: any) {
			//  user probably doesn't have dnf
			opts.onManagerFail?.(manager.name, err);
		}
	}
}
