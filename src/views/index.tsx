/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/views/index.tsx
 */
import * as React from 'react';
import { Loader } from 'rsuite';

import HomeView from './home/index';
// import ControlView from './control/index';
// import NotFound from './NotFound';

const ControlView = React.lazy(() => import('./control'));
const NotFoundView = React.lazy(() => import('./NotFound'));

const Suspense = (props: any) => {
	return (
		<React.Suspense fallback={<Loader center backdrop content="loading..." />}>{props?.children}</React.Suspense>
	);
};

const HomeScreen = <HomeView />; // 首页

const ControlScreen = (
	<Suspense>
		<ControlView />
	</Suspense>
); // 控制页面

const NotFoundScreen = (
	<Suspense>
		<NotFoundView />
	</Suspense>
); // 错误默认页面

export { HomeScreen, ControlScreen, NotFoundScreen };
