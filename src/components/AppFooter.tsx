/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/components/AppFooter.tsx
 */
import config from 'config';
import React from 'react';
import { Divider } from 'rsuite';

export default function AppFooter() {
	return (
		<div className="footer">
			<div className="layout footer_row">
				<div className="footer_left">
					<a target="_blank" href="http://beian.miit.gov.cn/?u=so.jszkk.com" rel="noreferrer">
						蜀ICP备 18009530号-6
					</a>
					<p style={{ marginTop: 5 }}>
						<a target="_blank" href="https://github.com/zmide?u=so.jszkk.com" rel="noreferrer">
							@逐梦工作室
						</a>{' '}
						提供技术支持
					</p>
				</div>
				<div style={{ flex: 1 }} />
				<div className="footer_right">
					<p>
						友情链接{' '}
						<a target="_blank" href="http://shitidaquan.com/?u=so.jszkk.com" rel="noreferrer">
							试题大全
						</a>
					</p>
					<p>
						<a target="_blank" href={'https://github.com/zmide/study.zmide.com'} rel="noreferrer">
							GitHub 项目主页
						</a>
						{' | '}
						<a
							target="_blank"
							href={config?.docsURL || 'https://docsso.jszkk.com/?u=so.jszkk.com'}
							rel="noreferrer"
						>
							开发文档
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
