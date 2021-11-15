/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/App.tsx
 */
import React, { useEffect } from 'react';

import { HashRouter } from 'react-router-dom';
import Routers from './routers';

import './scss/App.scss';
import { observer } from 'mobx-react';

function App() {
	useEffect(() => {
		// axios
		// 	.post('/')
		// 	.then((res) => {
		// 		console.log('成功', res);
		// 	})
		// 	.catch((e: any) => {
		// 		console.log('失败', e);
		// 	});
		// const axios = axiosInstance({
		// 	baseURL: Config.serverURL || '',
		// 	headers: UserStore.me != null ? { Authorization: `Bearer ${UserStore.me?.accessToken || ''}` } : {},
		// });
	}, []);

	return (
		<HashRouter>
			<Routers />
		</HashRouter>
	);
}

export default observer(App);
