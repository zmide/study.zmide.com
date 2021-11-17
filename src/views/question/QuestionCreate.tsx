/*
 * @Author: Bin
 * @Date: 2021-11-17
 * @FilePath: /so.jszkk.com/src/views/question/QuestionCreate.tsx
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';

import { AppHead, AppFooter } from 'components';
import { useNavigate } from 'react-router-dom';
import {
	Button,
	Row,
	Divider,
	Breadcrumb,
	Form,
	Radio,
	RadioGroup,
	Input,
	Toggle,
	IconButton,
	Message,
	toaster,
} from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';

// 获取选项序号字符串
const getSerialStr = (i: number) => {
	return String.fromCharCode(65 + i);
};

// 选择题 Item 组件
const OptionsItem = (props: any) => {
	const {
		data,
		index,
		onValueChange = (id: number, item: any) => {},
		onDeleteValue = (id: number, item: any) => {},
	} = props;
	const [inputCotent, setinputCotent] = useState(data?.content);

	return data ? (
		<div style={{ display: 'flex', alignItems: 'center', marginTop: 25 }}>
			<IconButton icon={<TrashIcon />} onClick={() => onDeleteValue(index, data)} />
			<p style={{ marginLeft: 15 }}>{getSerialStr(index)}.</p>
			<Input
				style={{ flex: 1, margin: '0 10px' }}
				defaultValue={inputCotent}
				onBlur={() => {
					// console.log('失去焦点', index);
					onValueChange(index, {
						...data,
						content: inputCotent,
					});
				}}
				onChange={(value) => setinputCotent(value)}
			/>
			<Toggle
				checked={data?.isanswer}
				checkedChildren="正确答案"
				unCheckedChildren="错误答案"
				onChange={(value) => {
					onValueChange(index, {
						...data,
						isanswer: value,
					});
				}}
			/>
		</div>
	) : null;
};

// 选项数据处理组件
interface OptionViewProps {
	type: number;
	onChange?: (value: string) => void;
}
const OptionView = (props: OptionViewProps) => {
	const { type, onChange = (value: string) => {} } = props;
	const [callBackData, setcallBackData] = useState('');

	const [radioValue, setradioValue] = useState<any>(1);
	const [optionsValue, setoptionsValue] = useState<Array<any>>([
		{ name: 'A', content: '', isanswer: false },
		{ name: 'B', content: '', isanswer: false },
		{ name: 'C', content: '', isanswer: false },
		{ name: 'D', content: '', isanswer: false },
	]);

	// 处理判断题选项数据格式
	const getJudgmentData = useCallback((value: any) => {
		const data = {
			answer: value === 1 ? true : false,
		};
		return JSON.stringify(data);
	}, []);

	// 处理选择题数据
	const getSelectData = useCallback((data: Array<any>) => {
		const newData: Array<any> = [];

		// 处理空选项数据
		data.map((item: any, index: number) => {
			// Bin: 更多数据校对规则可以添加到这里
			if (!item || !item?.content) {
				// 判断选项为空或者选项数据内容为空
				return null;
			}
			newData.push(item);
			return item;
		});

		return JSON.stringify(newData);
	}, []);

	// 选择题型选项数据改变监听
	useEffect(() => {
		if (optionsValue) {
			const data = getSelectData(optionsValue);
			setcallBackData(data);
		}
	}, [optionsValue, getSelectData]);

	// 组件数据改变回调
	useEffect(() => {
		if (callBackData) {
			onChange(callBackData);
		}
	}, [callBackData, onChange]);

	// 组件数据初始化，实现切换组件类型也能回调数据改变
	useEffect(() => {
		if (type == null || (!radioValue && !optionsValue)) {
			return;
		}
		if (type === 3) {
			setcallBackData(getJudgmentData(radioValue));
		}
		if (type === 0 || type === 1) {
			setcallBackData(getSelectData(optionsValue));
		}
	}, [type, setcallBackData, radioValue, optionsValue, getJudgmentData, getSelectData]);

	// 判断题
	if (type === 3) {
		return (
			<Form.Group>
				<RadioGroup
					onChange={(value) => {
						setradioValue(value);
						const data = getJudgmentData(value);
						setcallBackData(data);
					}}
					inline
					value={radioValue}
				>
					<Radio value={1}>正确</Radio>
					<Radio value={0}>错误</Radio>
				</RadioGroup>
			</Form.Group>
		);
	}

	// 选择题（包括多选和单选）
	return (
		<div>
			{optionsValue?.map((item: any, index: number) =>
				item ? (
					<OptionsItem
						key={JSON.stringify(item) + '_' + index}
						data={item}
						index={index}
						onValueChange={(id: number, data: any) => {
							// id 为数据序号，data 为改变后的数据
							optionsValue[id] = {
								...optionsValue[id],
								...data,
							};
							setoptionsValue([...optionsValue]);
							// console.log('数据改变', id, data);
						}}
						onDeleteValue={(id: number, item: any) => {
							let data: Array<any> = optionsValue;
							const start = data.slice(0, id);
							const end = data.slice(id + 1, data.length);
							data = [...start, ...end];
							// 处理序号名称
							data = data.map((item: any, index: number) => {
								return {
									...item,
									name: getSerialStr(index),
								};
							});
							setoptionsValue([...data]);
						}}
					/>
				) : null
			)}

			<Button
				style={{ width: '100%', marginTop: 25 }}
				onClick={() => {
					setoptionsValue([
						...optionsValue,
						{ name: getSerialStr(optionsValue?.length), content: '', isanswer: false },
					]);
				}}
			>
				<ExpandOutlineIcon style={{ marginRight: 10 }} />
				增加选项
			</Button>
		</div>
	);
};

export default function QuestionCreate() {
	const navigate = useNavigate();

	const [createConfig, setcreateConfig] = useState<any>({
		content: '',
		type: 0,
	});
	const refOptionsData = useRef('');

	/**
	 * @description: 检查选项数据是否合规，通过返回 null，不合规则返回提示信息
	 * @param {number} type
	 * @param {string} options
	 * @return @return {null | string}
	 */
	const __checkOptionsCompliance = (type: number, options: string) => {
		if (!options) {
			return '选项数据为空';
		}

		// 判断题暂不判断数据合格性
		if (type === 3) {
			return null;
		}

		// 选择题选项数据监测
		try {
			const optionsObj = JSON.parse(options);
			if (typeof optionsObj !== 'object') {
				return '选项数据异常';
			}

			let warningStr = null;
			let existCorrectOption = false;
			optionsObj.map((item: any, index: number) => {
				if (item?.isanswer) {
					// 遍历选项后发现存在正确答案
					existCorrectOption = true;
				}
				return item;
			});

			if (optionsObj?.length < 2) {
				return '选项不得少于两个';
			}

			if (!existCorrectOption) {
				return '必须有至少一个正确选项';
			}

			if (warningStr) {
				return warningStr;
			}

			return null;
		} catch (error: any) {
			return '选项数据可能不是 JSON 格式';
		}
	};

	return (
		<div className="container">
			<AppHead />
			<div className="context control">
				<div className="layout content">
					<div className="content_app">
						<div>
							<Row style={{ display: 'flex', padding: 10 }}>
								<h4 style={{ fontWeight: 300 }}>添加题目</h4>
								<div style={{ flex: 1 }} />
								<Button
									appearance="primary"
									disabled={refOptionsData.current && createConfig?.content ? false : true}
									onClick={() => {
										// 题目数据 createConfig
										// 选项数据 refOptionsData.current

										console.log('题目数据', createConfig);
										console.log('选项数据', refOptionsData.current);

										const warningMsg = __checkOptionsCompliance(
											createConfig?.type,
											refOptionsData.current
										);
										if (warningMsg) {
											toaster.push(<Message>{warningMsg}</Message>);
											return;
										}
									}}
								>
									确认提交
								</Button>
							</Row>
							<Divider style={{ margin: 0 }} />
						</div>
						<div style={{ padding: '10px 0' }}>
							<Breadcrumb>
								<Breadcrumb.Item
									onClick={() => {
										navigate('/control/', {
											replace: true,
										});
									}}
								>
									控制中心
								</Breadcrumb.Item>
								<Breadcrumb.Item active>添加题目</Breadcrumb.Item>
							</Breadcrumb>
						</div>
						<div style={{ flex: 1, width: '100%', margin: '0 auto', paddingTop: 30, maxWidth: 700 }}>
							<Form
								fluid
								onChange={(data) => {
									setcreateConfig({
										...setcreateConfig,
										...data,
									});
								}}
								formValue={createConfig}
							>
								<Form.Group>
									<Form.ControlLabel>
										<b>题目类型</b>
									</Form.ControlLabel>
									<Form.Control name="type" accepter={RadioGroup} inline>
										<Radio value={3}>判断题</Radio>
										<Radio value={0}>选择题</Radio>
										<Radio value={1}>多选题</Radio>
									</Form.Control>
								</Form.Group>
								<Form.Group>
									<Form.ControlLabel>
										<b>题目内容</b>
									</Form.ControlLabel>
									<Form.Control name="content" type="content" style={{ width: '100%' }} />
								</Form.Group>
								<Form.Group>
									<Form.ControlLabel>
										<b>题目选项</b>
									</Form.ControlLabel>
									<div>
										<OptionView
											type={createConfig?.type}
											onChange={(value: string) => {
												// 选项数据不能直接写入 createConfig ，不然会导致组件刷新死循环
												refOptionsData.current = value;
											}}
										/>
									</div>
								</Form.Group>
							</Form>
						</div>
					</div>
				</div>
			</div>
			<AppFooter />
		</div>
	);
}
