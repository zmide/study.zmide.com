/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/routers/index.tsx
 */
import { observer } from 'mobx-react';
import { Router, Route, Routes } from 'react-router-dom';
import { UserStore } from '../stores';

import routes from './routes';

function Index() {
	return (
		<>
			<Routes>
				{/* <Redirect to="/login" from="/" exact /> */}

				{routes.map((item: any, index: number) => {
					return <Route key={index} path={item.path} element={item.component} />;
				})}
			</Routes>
		</>
	);
}
export default observer(Index);
