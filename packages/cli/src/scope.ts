import type { PackageManager, ScopeLike } from '@spamalot/core';
import { Npm } from '@spamalot/npm';
import * as fs from 'node:fs';
import * as os from 'node:os';
import { basename, join } from 'node:path';
import { isRoot, processHasUid } from './system/utils.js';

export class LocalScope implements ScopeLike {
	readonly type = 'local';
	readonly name: string;
	protected readonly ownerName?: string;
	protected readonly ownerUid: number;
	protected readonly ownerGid: number;

	get writable() {
		return isRoot() || this.ownerName == os.userInfo().username || processHasUid(this.ownerUid) || processHasUid(this.ownerGid);
	}

	constructor(readonly path: string) {
		if (path.startsWith('/home/')) this.ownerName = path.split('/')[2];
		const stats = fs.statSync(path);
		this.ownerUid = stats.uid;
		this.ownerGid = stats.gid;

		this.name = basename(this.path);
	}

	packageManagers() {
		const pms: PackageManager[] = [];
		if (fs.existsSync(join(this.path, 'package.json'))) pms.push(new Npm(this.path));
		return pms;
	}

	get sourceControl() {
		if (fs.existsSync(join(this.path, '.git'))) return 'git' as const;
	}
}

export class UserScope implements ScopeLike {
	readonly type = 'user';

	get writable() {
		return isRoot() || this.name == os.userInfo().username;
	}

	constructor(readonly name: string) {}

	packageManagers() {
		// @todo
		return [];
	}

	get contains(): LocalScope[] {
		// @todo
		return [];
	}
}
