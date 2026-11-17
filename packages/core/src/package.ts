import * as semver from 'semver';

export interface PackageReference {
	name: string;
	version: string;
	id?: number;
	relation?: string;
	hash?: number | string;
}

export interface Package {
	name: string;
	version: string;
	license?: string;
	url?: string;
	description?: string;
	author?: string;
	dependencies: PackageReference[];
	conflicts: PackageReference[];
	downloadSize?: bigint;
	installSize: bigint;
	reason?: string;
}

export interface CreateTreeOptions {
	onWarning?(text: string): void;
	matchVersion?(version: string, range: string): boolean;
}

export function createTree(packages: Package[], options: CreateTreeOptions = {}) {
	const { matchVersion = semver.satisfies, onWarning } = options;

	const map = new Map<string, Package[]>();

	for (const pkg of packages) {
		const versions = map.getOrInsertComputed(pkg.name, () => []);
		versions.push(pkg);
	}

	for (const pkg of packages) {
		for (const dep of pkg.dependencies) {
			const candidates = map.get(dep.name) || [];
			if (!candidates.length) onWarning?.(`missing dependency '${dep.name}' for '${pkg.name}'`);
		}
	}
}
