/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/components/AppHead.tsx
 */
import React, { useState, useRef, useEffect, ElementType } from 'react';
import {
	Drawer,
	Placeholder,
	Form,
	ButtonToolbar,
	Button,
	Whisper,
	Tooltip,
	InputGroup,
	Input,
	toaster,
	Message,
	Avatar,
	Popover,
	Dropdown,
	Divider,
} from 'rsuite';
import { axios } from 'api';
import { observe, UserStore } from 'stores';
import { useNavigate } from 'react-router-dom';

const MenuPopover = React.forwardRef(({ onSelect, ...rest }: any, ref: any) => {
	const { me } = UserStore;
	return (
		<Popover ref={ref} {...rest} full>
			<div style={{ padding: 15, paddingBottom: 0 }}>
				<p>
					<b>{me?.name}</b> 账号已登陆
				</p>
				<p style={{ margin: 0, color: '#0005' }}>{me?.email}</p>
			</div>

			<Dropdown.Menu onSelect={onSelect}>
				<Dropdown.Item divider />
				<Dropdown.Item eventKey={1}>控制中心</Dropdown.Item>
				<Dropdown.Item eventKey={2}>开发文档</Dropdown.Item>
				<Dropdown.Item eventKey={3}>退出登陆</Dropdown.Item>
			</Dropdown.Menu>
		</Popover>
	);
});

export default function AppHead() {
	const [loginDrawer, setloginDrawer] = useState(false);
	const [isRegister, setisRegister] = useState(false);
	const navigate = useNavigate();

	const __tooltip = (msg: string) => <Tooltip>{msg}</Tooltip>;

	const [loginConfig, setloginConfig] = useState<any>({});
	const __APILogin = (account: string, password: string) => {
		if (loginConfig?.netLoading) {
			return;
		}
		if (!account || !password) {
			toaster.push(<Message>账号或密码不得为空。</Message>);
			return;
		}
		setloginConfig({
			...loginConfig,
			netLoading: true,
		});
		const msgTitle = '登陆';
		const params = {
			email: account,
			password,
		};

		axios
			.post('/api/auth/login', params, {})
			.then((res: any) => {
				setloginConfig({
					...loginConfig,
					netLoading: false,
				});

				const { data: callback } = res;

				if (callback?.code !== 200 || !callback?.data) {
					toaster.push(<Message>{callback?.msg || msgTitle + '失败，请稍后重试！'}</Message>);
				} else {
					const { data } = callback;
					console.log('成功', callback);

					toaster.push(<Message>{msgTitle + '成功。'}</Message>);
					setloginDrawer(false);
					UserStore.login(data);

					// 成功，关闭弹窗，刷新列表数据，清空编辑框数据
					setloginConfig({
						netLoading: false,
					});
				}
			})
			.catch((error: any) => {
				setloginConfig({
					...loginConfig,
					netLoading: false,
				});
				toaster.push(<Message>{error + '' || msgTitle + '失败，请稍后重试！'}</Message>);
			});
	};

	const [registerConfig, setregisterConfig] = useState<any>({ netLoading: false });
	const __APIRegister = (name: string, email: string, code: string, password: string) => {
		if (registerConfig?.netLoading) {
			return;
		}
		if (!name || !email || !code || !password) {
			toaster.push(<Message>数据填写不完整。</Message>);
			return;
		}
		setregisterConfig({
			...registerConfig,
			netLoading: true,
		});
		const msgTitle = '注册账号';
		const params = {
			email,
			name,
			code,
			password,
		};

		axios
			.post('/api/auth/reg', params, {})
			.then((res: any) => {
				setregisterConfig({
					...registerConfig,
					netLoading: false,
				});

				const { data } = res;

				if (data?.code !== 200 || !data?.data) {
					toaster.push(<Message>{data?.msg || msgTitle + '失败，请稍后重试！'}</Message>);
				} else {
					// console.log('成功', data);

					toaster.push(<Message>{msgTitle + '成功。'}</Message>);

					// 成功，关闭弹窗，刷新列表数据，清空编辑框数据
					setregisterConfig({
						netLoading: false,
					});
				}
			})
			.catch((error: any) => {
				setregisterConfig({
					...registerConfig,
					netLoading: false,
				});
				toaster.push(<Message>{error + '' || msgTitle + '失败，请稍后重试！'}</Message>);
			});
	};

	const [getCodeConfig, setgetCodeConfig] = useState<any>({ netLoading: false });
	const __APIGetCode = (email: string) => {
		if (getCodeConfig?.netLoading || codeRetryStateConfig?.isLoading) {
			return;
		}
		if (!email) {
			toaster.push(<Message>邮箱地址未输入。</Message>);
			return;
		}
		setgetCodeConfig({
			...getCodeConfig,
			netLoading: true,
		});

		const msgTitle = '获取验证码';
		const params = {
			email,
			type: 0,
		};

		axios
			.post('/api/auth/send', params, {})
			.then((res: any) => {
				setgetCodeConfig({
					...getCodeConfig,
					netLoading: false,
				});

				const { data } = res;

				if (data?.errMessage || !data?.success) {
					// message.error(data?.errMessage || msgTitle + '失败，请稍后重试！');
				} else {
					// console.log('成功', data);

					toaster.push(<Message>{msgTitle + '成功。'}</Message>);

					// 启动重新获取验证码倒计时
					getCodeRetryState();

					// 成功，关闭弹窗，刷新列表数据，清空编辑框数据
					setgetCodeConfig({
						netLoading: false,
					});
				}
			})
			.catch((error: any) => {
				setgetCodeConfig({
					...getCodeConfig,
					netLoading: false,
				});
				toaster.push(<Message>{error + '' || msgTitle + '失败，请稍后重试！'}</Message>);
			});
	};
	const [codeRetryStateConfig, setcodeRetryStateConfig] = useState<any>({
		isLoading: false,
	});

	const codeRetryTime = 6;
	const refCodeRetryStateConfig = useRef<any>({
		endTime: codeRetryTime,
		timer: null,
	});
	const getCodeRetryState = () => {
		setcodeRetryStateConfig({
			isLoading: true,
		});
		// 设置倒计时定时
		refCodeRetryStateConfig.current = {
			...refCodeRetryStateConfig.current,
			timer: setInterval(() => {
				let time = codeRetryTime;
				if (refCodeRetryStateConfig.current.endTime <= 1) {
					setcodeRetryStateConfig({
						isLoading: false,
					});
					time = codeRetryTime;
					clearInterval(refCodeRetryStateConfig.current.timer);
				} else {
					time = --refCodeRetryStateConfig.current.endTime;
					setcodeRetryStateConfig({
						isLoading: true,
					});
				}
				refCodeRetryStateConfig.current = {
					...refCodeRetryStateConfig.current,
					endTime: time,
				};
			}, 1000),
		};
	};

	useEffect(() => {
		return () => {
			// 卸载定时器
			if (refCodeRetryStateConfig.current.timer) {
				clearInterval(refCodeRetryStateConfig.current.timer);
			}
		};
	}, []);

	const refUserWhisper = useRef<any>();

	let operateUserControl = false;
	const onUserControl = (key: number) => {
		if (operateUserControl) return;
		operateUserControl = true;

		// 关闭用户操作选项
		refUserWhisper?.current?.close();

		switch (key) {
			case 1:
				// 加载控制台
				navigate('/control', {
					replace: true,
				});
				break;
			case 3:
				// 用户退出登陆
				setTimeout(() => {
					UserStore.loginOut();
				}, 500); // Bin: 这里为啥要延迟呢？因为退出登陆执行太快，动画还没执行完可能会导致用户感觉 UI 卡一下
				break;
		}

		setTimeout(() => {
			operateUserControl = false;
		}, 500);
	};

	return (
		<>
			<header className="header">
				<div className="layout">
					<h1
						className="logo"
						onClick={() => {
							navigate('/', {
								replace: true,
							});
						}}
					>
						全能搜题
					</h1>
					<div style={{ flex: 1 }}></div>
					<Whisper
						placement="bottomEnd"
						trigger="contextMenu"
						ref={refUserWhisper}
						speaker={<MenuPopover onSelect={onUserControl} />}
					>
						<Avatar
							circle
							onClick={() => {
								if (UserStore.me) {
									refUserWhisper?.current?.open();
								} else {
									setloginDrawer(true);
								}
							}}
						>
							U
						</Avatar>
					</Whisper>
				</div>
			</header>
			<Drawer open={loginDrawer} onClose={() => setloginDrawer(false)}>
				<Drawer.Body>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							height: '100%',
							justifyContent: 'center',
						}}
					>
						<h3>登陆全能搜题开放平台</h3>
						<p style={{ marginTop: 5, marginBottom: 45 }}>登陆后可以上传题库，添加题目，调用搜题接口</p>

						{!isRegister ? (
							<Form
								onChange={(data) => {
									setloginConfig({ ...loginConfig, ...data });
								}}
								fluid
							>
								<Form.Group>
									<Form.ControlLabel>账号/邮箱</Form.ControlLabel>
									<Form.Control name="account" autoComplete="off" />
								</Form.Group>

								<Form.Group>
									<Form.ControlLabel>密码</Form.ControlLabel>
									<Form.Control
										name="password"
										type="password"
										autoComplete="off"
										onKeyUp={(e: any) => {
											if (e.keyCode === 13) {
												// 响应回车点击事件，立即登陆
											}
										}}
									/>
								</Form.Group>

								<Form.Group>
									<ButtonToolbar style={{ paddingTop: 20, display: 'flex' }}>
										<Button
											appearance="primary"
											loading={loginConfig?.netLoading}
											onClick={() => {
												__APILogin(loginConfig?.account, loginConfig?.password);
												// console.log('账号', loginConfig);
											}}
										>
											立即登陆
										</Button>
										<Whisper
											placement="top"
											trigger="hover"
											speaker={__tooltip('如需重置密码请登陆服务器或联系超级管理员操作！')}
										>
											<Button appearance="link">忘记密码？</Button>
										</Whisper>
										<div style={{ flex: 1 }}></div>
										<Button onClick={() => setisRegister(true)}>注册账号</Button>
									</ButtonToolbar>
								</Form.Group>
							</Form>
						) : (
							<Form
								onChange={(data) => {
									setregisterConfig({
										...registerConfig,
										...data,
									});
								}}
								fluid
							>
								<Form.Group>
									<Form.ControlLabel>昵称</Form.ControlLabel>
									<Form.Control name="name" type="name" autoComplete="off" />
								</Form.Group>

								<Form.Group>
									<Form.ControlLabel>邮箱地址</Form.ControlLabel>
									<Form.Control name="email" type="email" autoComplete="off" />
								</Form.Group>

								<Form.Group>
									<Form.ControlLabel>验证码</Form.ControlLabel>
									<InputGroup inside style={{ width: '100%' }}>
										<Input
											name="code"
											onChange={(value) => {
												setregisterConfig({
													...registerConfig,
													code: value,
												});
											}}
										/>
										<InputGroup.Button
											loading={getCodeConfig?.netLoading}
											disabled={codeRetryStateConfig?.isLoading}
											onClick={() => {
												__APIGetCode(registerConfig?.email);
											}}
										>
											{codeRetryStateConfig?.isLoading
												? `${refCodeRetryStateConfig?.current?.endTime} 秒后重试`
												: '获取验证码'}
										</InputGroup.Button>
									</InputGroup>
								</Form.Group>

								<Form.Group>
									<Form.ControlLabel>密码</Form.ControlLabel>
									<Form.Control name="password" type="password" autoComplete="off" />
								</Form.Group>

								<Form.Group>
									<ButtonToolbar style={{ paddingTop: 20, display: 'flex' }}>
										<Button
											appearance="primary"
											loading={registerConfig?.netLoading}
											onClick={() => {
												__APIRegister(
													registerConfig?.name,
													registerConfig?.email,
													registerConfig?.code,
													registerConfig?.password
												);
												// console.log('注册数据', registerConfig);
											}}
										>
											立即注册
										</Button>
										<div style={{ flex: 1 }}></div>
										<Button onClick={() => setisRegister(false)}>已经有账号，登陆</Button>
									</ButtonToolbar>
								</Form.Group>
							</Form>
						)}
					</div>
				</Drawer.Body>
			</Drawer>
		</>
	);
}
