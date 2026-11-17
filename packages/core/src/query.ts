export type QueryCmp =
	| 'eq'
	| 'neq'
	| 'gt'
	| 'gte'
	| 'lt'
	| 'lte'
	| 'exact'
	| 'not_exact'
	| 'iexact'
	| 'not_iexact'
	| 'contains'
	| 'not_contains'
	| 'icontains'
	| 'not_icontains'
	| 'startswith'
	| 'istartswith'
	| 'endswith'
	| 'iendswith'
	| 'regex'
	| 'iregex'
	| 'glob'
	| 'not_glob'
	| 'iglob'
	| 'not_iglob';

export type QueryFilterFlags =
	| 'available'
	| 'downgradable'
	| 'downgrades'
	| 'duplicates'
	| 'installed'
	| 'installonly'
	| 'leaves'
	| 'leaves_groups'
	| 'priority'
	| 'reboot_suggested'
	| 'recent'
	| 'unneeded'
	| 'upgradable'
	| 'upgrades'
	| 'userinstalled'
	| 'versionlock';

type ValuedKeys =
	| 'arch'
	| 'conflicts'
	| 'description'
	| 'enhances'
	| 'epoch'
	| 'file'
	| 'from_repo_id'
	| 'location'
	| 'name'
	| 'obsoletes'
	| 'provides'
	| 'recommends'
	| 'release'
	| 'repo_id'
	| 'requires'
	| 'suggests'
	| 'summary'
	| 'supplements'
	| 'url'
	| 'version';

export type QueryFilter =
	| QueryFilterFlags
	| [ValuedKeys, QueryCmp, value: string | string[]]
	| ['recent', timestamp?: number | bigint | Date]
	| ['advisories', ...[filter: 'name' | 'packages' | 'reference' | 'severity' | 'type', QueryCmp, value: string | string[]][]];

export function doQueryCmp(actual: string, cmp: QueryCmp, expected: string): boolean {
	const a = actual ?? '';
	switch (cmp) {
		case 'eq':
		case 'exact':
			return a === expected;
		case 'neq':
		case 'not_exact':
			return a !== expected;
		case 'iexact':
			return a.toLowerCase() === expected.toLowerCase();
		case 'not_iexact':
			return a.toLowerCase() !== expected.toLowerCase();
		case 'contains':
			return a.includes(expected);
		case 'not_contains':
			return !a.includes(expected);
		case 'icontains':
			return a.toLowerCase().includes(expected.toLowerCase());
		case 'not_icontains':
			return !a.toLowerCase().includes(expected.toLowerCase());
		case 'startswith':
			return a.startsWith(expected);
		case 'istartswith':
			return a.toLowerCase().startsWith(expected.toLowerCase());
		case 'endswith':
			return a.endsWith(expected);
		case 'iendswith':
			return a.toLowerCase().endsWith(expected.toLowerCase());
		case 'gt':
			return a > expected;
		case 'gte':
			return a >= expected;
		case 'lt':
			return a < expected;
		case 'lte':
			return a <= expected;
		case 'regex':
			return new RegExp(expected).test(a);
		case 'iregex':
			return new RegExp(expected, 'i').test(a);
		default:
			throw new Error(`Unsupported comparison '${cmp}' for flatpak query`);
	}
}
