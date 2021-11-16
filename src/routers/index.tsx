/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/routers/index.tsx
 */
import { observer } from 'mobx-react';
import { Router, Route, Routes } from 'react-router-dom';


import routes from './routes';

function Index() {
	return (
		<>
			<Routes>
				{routes.map((item: any, indexKey: number) => {
					return <Route key={indexKey} path={item.path} element={item.component} />;
				})}
			</Routes>
		</>
	);
}
export default observer(Index);
