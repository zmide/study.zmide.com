/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/routers/index.tsx
 */
import { observer } from 'mobx-react';
import { Route, Routes } from 'react-router-dom';
import { UserStore } from 'stores';

import routes from './routes';

function Index() {
	return (
		<>
			<Routes>
				{routes.map((item: any, indexKey: number) => {
					if (item?.login && !UserStore?.me) {
						// 未登陆直接不渲染路由
						return null;
					}
					if (item?.childs) {
						return (
							<Route key={indexKey} path={item.path} element={item.component}>
								{item?.childs.map((childItem: any, childIndexKey: number) => {
									return (
										<Route
											key={'childs_' + childIndexKey}
											path={item.path + childItem.path}
											index={childItem?.index}
											element={childItem.component}
										/>
									);
								})}
							</Route>
						);
					}
					return <Route key={indexKey} path={item.path} element={item.component} />;
				})}
			</Routes>
		</>
	);
}
export default observer(Index);
