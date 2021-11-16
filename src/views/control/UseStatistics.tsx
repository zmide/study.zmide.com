/*
 * @Author: Bin
 * @Date: 2021-11-16
 * @FilePath: /so.jszkk.com/src/views/control/UseStatistics.tsx
 */
import React from 'react';
import { Panel, FlexboxGrid, Col } from 'rsuite';

export default function UseStatistics() {
	return (
		<div>
			<FlexboxGrid>
				<FlexboxGrid.Item as={Col} colspan={24} md={6}>
					<Panel header="上传题目数" bordered>
						<p>-999</p>
					</Panel>
				</FlexboxGrid.Item>
				<FlexboxGrid.Item as={Col} colspan={24} md={6}>
					<Panel header="应用密钥数" bordered>
						<p>-999</p>
					</Panel>
				</FlexboxGrid.Item>
			</FlexboxGrid>
		</div>
	);
}
