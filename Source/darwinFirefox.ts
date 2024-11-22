/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { DarwinFinderBase } from "./darwinFinderBase";
import { Quality } from "./index";
import { sort } from "./util";

/**
 * Finds the Firefox browser on OS X.
 */
export class DarwinFirefoxBrowserFinder extends DarwinFinderBase {
	/**
	 * @override
	 */
	protected wellKnownPaths = [
		{
			path: "/Applications/Firefox.app/Contents/MacOS/firefox",
			quality: Quality.Stable,
		},
		{
			path: "/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox",
			quality: Quality.Dev,
		},
		{
			path: "/Applications/Firefox Nightly.app/Contents/MacOS/firefox",
			quality: Quality.Canary,
		},
	];

	protected override async findAllInner() {
		const suffixes = ["/Contents/MacOS/firefox"];

		const defaultPaths = ["/Applications/Firefox.app"];

		const installations = await this.findLaunchRegisteredApps(
			"Firefox[A-Za-z ]*.app",
			defaultPaths,
			suffixes,
		);

		return sort(
			installations,
			this.createPriorities([
				{
					name: "Firefox.app",
					weight: 0,
					quality: Quality.Stable,
				},
				{
					name: "Firefox Nightly.app",
					weight: 1,
					quality: Quality.Canary,
				},
				{
					name: "Firefox Developer Edition.app",
					weight: 2,
					quality: Quality.Dev,
				},
			]),
		);
	}

	protected getPreferredPath() {
		return this.env.FIREFOX_PATH;
	}
}
