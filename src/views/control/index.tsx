/*
 * @Author: Bin
 * @Date: 2021-11-16
 * @FilePath: /so.jszkk.com/src/views/control/index.tsx
 */

import React, { useState, useEffect } from 'react';
import { AppHead, AppFooter } from 'components';
import { Navbar, Nav, Divider, Sidenav } from 'rsuite';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function Index(props: any) {
	const navigate = useNavigate();
	const location = useLocation();
	const [pageKey, setpageKey] = useState<string>();
	useEffect(() => {
		if (location) {
			const pathname = location.pathname.replace('/control/', '').replace('/control', '');
			if (!pathname) {
				navigate('statistics', {
					replace: true,
				});
			}
			setpageKey(pathname);
		}
	}, [location, navigate]);

	return (
		<div className="container">
			<AppHead />
			<div className="context control">
				<div className="layout content">
					<Nav
						vertical
						style={{ width: 180 }}
						onSelect={(eventKey) => {
							//console.log('切换页面', eventKey);
							// setpageKey(eventKey);
							navigate(eventKey, {
								replace: true,
							});
						}}
						activeKey={pageKey}
					>
						<Nav.Item eventKey="statistics">使用统计</Nav.Item>
						<Nav.Item eventKey="appkeys">应用密钥</Nav.Item>
					</Nav>

					<div className="content_app">
						<Outlet />
					</div>
				</div>
			</div>
			<AppFooter />
		</div>
	);
}
