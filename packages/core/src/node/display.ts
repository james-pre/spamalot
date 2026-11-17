import { styleText, type InspectColor } from 'node:util';
import type { PackageManagerName } from '../manager.js';
import type { Package } from '../package.js';

export const packageManagerColors = {
	dnf: 'blue',
	flatpak: 'cyanBright',
	npm: 'red',
	yarn: 'red',
} satisfies Record<PackageManagerName, InspectColor>;

export function formatPackage(dep: Package & { from: PackageManagerName }) {
	return `- ${styleText(packageManagerColors[dep.from], dep.from)}/${dep.name} ${styleText('dim', dep.version || '(unknown version)')}`;
}

export function formatPackageSummary(deps: Iterable<Package & { from: PackageManagerName }>, packageManagers?: PackageManagerName[]) {
	return (
		(Object.entries(Object.groupBy(deps, dep => dep.from)) as [PackageManagerName, Package[]][])
			.filter(([from]) => !packageManagers || packageManagers.includes(from))
			.map(([from, dependencies]) => `${dependencies.length} ${styleText(packageManagerColors[from], from)}`)
			.join(', ') || styleText('dim', '(no dependencies)')
	);
}
