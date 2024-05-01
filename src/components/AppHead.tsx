/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/components/AppHead.tsx
 */
import React, { useState, useRef, useEffect } from 'react';
import {
	Drawer,
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
} from 'rsuite';
import { axios } from 'api';
import { UserStore } from 'stores';
import { useNavigate } from 'react-router-dom';
import config from 'config';
import useAxios from 'axios-hooks';

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

const __tooltip = (msg: string) => <Tooltip>{msg}</Tooltip>;

interface PanelProps {
	switchTo:  React.Dispatch<React.SetStateAction<number>>
	setloginDrawer:  React.Dispatch<React.SetStateAction<boolean>>
}

const LoginPanel = ({ switchTo, setloginDrawer }: PanelProps) => {
	const [formData, setFormData] = useState<any>({})
	const [{ loading }, executeLogin] = useAxios({
		url: '/api/auth/login',
		method: 'POST'
	}, { manual: true })

	const handleLogin = (account: string, password: string) => {
		if (!account || !password) {
			toaster.push(<Message>账号或密码不得为空。</Message>);
			return	
		}

		executeLogin({data: {
			email: account,
			password: password
		}})
		.then(({data}) =>{
			if (data.code !== 200) {
				toaster.push(<Message>{`${data?.msg || "登录失败, 请稍后重试!"}`}</Message>);
			} else {
				toaster.push(<Message>{"登录成功"}</Message>);
				UserStore.login(data.data)
				setloginDrawer(false)
				setFormData({})
			}
		})
		.catch((err) => {
			toaster.push(<Message>{`登录失败!${err}`}</Message>);
		})
	}

	return (
		<Form
			onChange={(data: any) => {
				setFormData(data)
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
					required={true}
				/>
			</Form.Group>

			<Form.Group>
				<ButtonToolbar style={{ paddingTop: 20, display: 'flex' }}>
					<Button
						appearance="primary"
						loading={loading}
						onClick={() => {
							handleLogin(formData.account, formData.password)
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
					<Button onClick={() => switchTo(1)}>注册账号</Button>
				</ButtonToolbar>
			</Form.Group>
		</Form>
	)
}

const RegisterPanel = ({ switchTo }: PanelProps) => {
	const [formData, setFormData] = useState<any>({})
	const [netLoading, setNetLoading] = useState(false);

	const __APIRegister = (name: string, email: string, code: string, password: string, confirm_password: string) => {
		if (netLoading) {
			return;
		}
		if (!name || !email || !code || !password || !confirm_password) {
			toaster.push(<Message>数据填写不完整。</Message>);
			return;
		}
		if (password !== confirm_password) {
			toaster.push(<Message type="error">密码不匹配</Message>)
			return
		}
		setNetLoading(true)
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
				setNetLoading(false)
				
				const { data } = res;

				if (data?.code !== 200 || !data?.data) {
					toaster.push(<Message>{data?.msg || msgTitle + '失败，请稍后重试！'}</Message>);
				} else {
					// console.log('成功', data);

					toaster.push(<Message>{msgTitle + '成功。'}</Message>);

					// 成功，关闭弹窗，刷新列表数据，清空编辑框数据
					setNetLoading(false)
					setFormData({})
				}
			})
			.catch((error: any) => {
				setNetLoading(false)
				toaster.push(<Message>{error + '' || msgTitle + '失败，请稍后重试！'}</Message>);
			});
	};

	const [getCodeConfig, setgetCodeConfig] = useState<any>({ netLoading: false });
	const __APIGetCode = (email: string, type: number = 0) => {
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
			type: type,
		};

		axios
			.post('/api/auth/send', params, {})
			.then((res: any) => {
				setgetCodeConfig({
					...getCodeConfig,
					netLoading: false,
				});

				const { data } = res;

				if (data?.code !== 200) {
					toaster.push(<Message>{data?.msg || msgTitle + '失败，请稍后重试！'}</Message>);
				} else {
					// console.log('成功', data);
					toaster.push(<Message>{msgTitle + '成功。'}</Message>);

					// 启动重新获取验证码倒计时
					getCodeRetryState();

					// 成功，关闭弹窗，刷新列表数据，清空编辑框数据
					setgetCodeConfig({
						netLoading: false,
					});
					setFormData({})
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

	const codeRetryTime = 60;
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

	return (
		<Form
			formValue={formData}
			onChange={(data) => {
				setFormData(data)
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
							setFormData({...formData, code: value})
						}}
					/>
					<InputGroup.Button
						loading={getCodeConfig?.netLoading}
						disabled={codeRetryStateConfig?.isLoading}
						onClick={() => {
							__APIGetCode(formData?.email);
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
				<Form.ControlLabel>确认密码</Form.ControlLabel>
				<Form.Control name="confirm_password" type="password" autoComplete="off" />
			</Form.Group>

			<Form.Group>
				<ButtonToolbar style={{ paddingTop: 20, display: 'flex' }}>
					<Button
						appearance="primary"
						loading={netLoading}
						onClick={() => {
							__APIRegister(
								formData?.name,
								formData?.email,
								formData?.code,
								formData?.password,
								formData?.confirm_password,
							);
							// console.log('注册数据', registerConfig);
						}}
					>
						立即注册
					</Button>
					<div style={{ flex: 1 }}></div>
					<Button onClick={() => switchTo(0) }>已经有账号，登陆</Button>
				</ButtonToolbar>
			</Form.Group>
		</Form>
	)
}

const panels : Record<number, (props: any) => JSX.Element> = {
	0: LoginPanel,
	1: RegisterPanel
}

export default function AppHead() {
	const [loginDrawer, setloginDrawer] = useState(false);
	const navigate = useNavigate();
	const refUserWhisper = useRef<any>();
	const [currentPanel, setCurrentPanel] = useState(0)

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
			case 2:
				// 新窗口打开开发文档
				window.open(config.docsURL, '_blank');
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

	const Panel = panels[currentPanel]

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

						{  <Panel switchTo={setCurrentPanel} setloginDrawer={setloginDrawer} /> }
					</div>
				</Drawer.Body>
			</Drawer>
		</>
	);
}
