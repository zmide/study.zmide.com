/*
 * @Author: Bin
 * @Date: 2021-11-16
 * @FilePath: /so.jszkk.com/src/views/control/ApplicationKey.tsx
 */
import { axios } from 'api';
import React, { useState } from 'react';
import { Button, Divider, Row, Modal, Form, Message, toaster } from 'rsuite';

export default function ApplicationKey() {
	const [createAppKeyConfig, setcreateAppKeyConfig] = useState<any>({
		showModal: false,
		netLoading: false,
	});
	const __APIcreateAppKey = (name: string, website: string) => {
		if (createAppKeyConfig?.netLoading) {
			return;
		}
		if (!name || !website) {
			toaster.push(<Message>应用名称或网站地址未输入。</Message>);
			return;
		}
		setcreateAppKeyConfig({
			...createAppKeyConfig,
			netLoading: true,
		});

		const msgTitle = '生成应用密钥';
		const params = {
			name,
			website,
		};

		axios
			.post('/api/appsecret/generate', params, {})
			.then((res: any) => {
				setcreateAppKeyConfig({
					...createAppKeyConfig,
					netLoading: false,
				});

				const { data } = res;

				if (data?.code !== 200 || !data?.data) {
					toaster.push(<Message>{data?.msg || msgTitle + '失败，请稍后重试！'}</Message>);
				} else {
					// console.log('成功', data);

					toaster.push(<Message>{msgTitle + '成功。'}</Message>);

					// 成功，关闭弹窗，刷新列表数据，清空编辑框数据
					setcreateAppKeyConfig({
						showModal: false,
						netLoading: false,
					});
				}
			})
			.catch((error: any) => {
				setcreateAppKeyConfig({
					...createAppKeyConfig,
					netLoading: false,
				});
				toaster.push(<Message>{error + '' || msgTitle + '失败，请稍后重试！'}</Message>);
			});
	};

	return (
		<div>
			<div>
				<Row style={{ display: 'flex', padding: 10 }}>
					<h4 style={{ fontWeight: 300 }}>应用密钥</h4>
					<div style={{ flex: 1 }} />
					<Button
						appearance="primary"
						onClick={() => {
							setcreateAppKeyConfig({
								...createAppKeyConfig,
								showModal: true,
							});
						}}
					>
						创建密钥
					</Button>
				</Row>
				<Divider style={{ margin: 0 }} />
			</div>
			<p style={{ padding: '10px 0' }}>
				生成的应用密钥可用于调用 <a>全能搜题 API</a> 。
			</p>

			<Modal
				open={createAppKeyConfig?.showModal}
				onClose={() =>
					setcreateAppKeyConfig({
						showModal: false,
					})
				}
			>
				<Modal.Header></Modal.Header>
				<Modal.Body>
					<Form
						fluid
						style={{ padding: 20 }}
						onChange={(data) => {
							setcreateAppKeyConfig({
								...createAppKeyConfig,
								...data,
							});
						}}
					>
						<Form.Group controlId="name">
							<Form.ControlLabel>应用名称</Form.ControlLabel>
							<Form.Control name="name" />
						</Form.Group>
						<Form.Group controlId="website">
							<Form.ControlLabel>网站/应用 域名</Form.ControlLabel>
							<Form.Control name="website" type="website" />
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						onClick={() =>
							setcreateAppKeyConfig({
								showModal: false,
							})
						}
						appearance="subtle"
					>
						取消创建
					</Button>
					<Button
						loading={createAppKeyConfig?.netLoading}
						onClick={() => __APIcreateAppKey(createAppKeyConfig?.name, createAppKeyConfig?.website)}
						appearance="primary"
					>
						立即创建
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
