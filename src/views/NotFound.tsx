/*
 * @Author: Bin
 * @Date: 2021-11-16
 * @FilePath: /so.jszkk.com/src/views/NotFound.tsx
 */
import React from 'react';
import { AppHead, AppFooter } from 'components';
import { Button } from 'rsuite';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<div className="container">
			<AppHead />
			<div className="context" style={{ flexDirection: 'column' }}>
				<p style={{ marginBottom: 20 }}>哦豁，这个页面被妖怪吃掉了</p>
				<Button
					onClick={() => {
						navigate(-1);
					}}
				>
					返回
				</Button>
			</div>
			<AppFooter />
		</div>
	);
}
