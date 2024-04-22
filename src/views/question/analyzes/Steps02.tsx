/*
 * @Author: Bin
 * @Date: 2024-03-13
 * @FilePath: /so.jszkk.com/src/views/question/analyzes/Steps02.tsx
 */
import React, { useEffect, useMemo, useState } from 'react'
import { Row, Table, SelectPicker, Button, Modal } from 'rsuite';
import useAxios from 'axios-hooks';
import { useNavigate } from 'react-router-dom';
import { axios } from 'api';

const { Column, HeaderCell, Cell } = Table;
const CompactCell = (props: any) => <Cell {...props} style={{ padding: 4 }} />;
const CompactHeaderCell = (props: any) => <HeaderCell {...props} style={{ padding: 4 }} />;


export interface Steps02Props {
    fileData: Array<Object>,
    deleteFileDataById: Function,
    onSelected:Function
}

interface IColumn {
    key: string | number,
    label: string,
    fixed?: boolean,
    width?: number,
    flexGrow?: number
}
interface IKey {
    label: string,
    value: number,
}


export default function Steps02(props: Steps02Props) {
    const navigate = useNavigate();
    const { fileData, deleteFileDataById,onSelected } = props;
    const defaultColumns: Array<IColumn> = [];
    const defaultRowKeys: Array<IKey> = [];
    const [oldValue, setOldValue] = useState<Map<string, number>>(new Map([
        ['content', 0],
        ['answer', 1],

    ]))

    const [columns, setColumns] = useState<Array<IColumn>>([]);
    const [rowKeys, setRowKeys] = useState<Array<IKey>>([]);
    const [options, setOptions] = useState<Map<string, number>>(new Map());
    const [contentIndex, setContentIndex] = useState<number>(0);
    const [answerIndex, setAnswerIndex] = useState<number>(1);
    const [selectPickerNumber, setSelectPickerNumber] = useState<number>(4);
    const [disabledOptions, setDisabledOptions] = useState<Array<number>>([0, 1]);

    const [emptyModalConfig, setemptyModalConfig] = useState({
        showModal: false,
    });

    // 获取密钥
    const [secretKey, setSecretKey] = useState<string>('');
    const [{ data, loading }, refetch] = useAxios({
        method: 'GET',
        url: '/api/appsecret/list',
    });

    const defaultSecretKey = useMemo(() => {
        return data?.data.map((item: any) => {
            return {
                label: item.name,
                value: item.api_token
            }
        })
    }, [data])


    // 更多解析方案
    const moreParseAnswer = (answer: string): string[] => {
        // 解析字母答案，包括 ABC A#B#C A,B,C .....
        if (answer.match(/[A-Za-z]/g)) {
            return answer.match(/[A-Za-z]/g) || []
            // 解析中文答案 包括 苹果#梨子 苹果,梨子 ......
        } else if (answer.split(/[,#.]/).filter(item => item.trim().length > 0)) {
            return answer.split(/[,#.]/).filter(item => item.trim().length > 0)
        }else if (answer.split(/[\s^]/).filter(item => item.trim().length > 0)) {
            return answer.split(/[\s^]/).filter(item => item.trim().length > 0)
        }
        return []
    }

    const parseAnswer = (answer: string) => {
        if (answer.split('#').length != 1) {
            return answer.split('#')
        } else if (!(moreParseAnswer(answer).length <= 1)) {
            return moreParseAnswer(answer)
        }
        return answer
    }


    const createColumnsAndRowKeys = () => {
        for (let index = 0; index < max_len - 1; index++) {
            defaultColumns.push({
                key: index,
                label: '列 ' + String.fromCharCode((65 + index)),
                width: 140,
            })
            defaultRowKeys.push({
                label: String.fromCharCode((65 + index)),
                value: index
            })
        }
        defaultColumns.unshift({
            key: 'id',
            label: 'ID',
        })

        defaultColumns.push({
            key: 'ctl',
            label: '# 操作',
        })
    }
    /**
     * 
     * @param row 文件行数据
     * @returns 序列化对象
     */
    // 解析多选题或者单选题
    const parseQuestionOfOption = (row: any) => {
        let answer: Array<string> | string = '';
        if (typeof (row as any)[answerIndex] === 'string') {
            answer = parseAnswer((row as any)[answerIndex])
        } else {
            answer = (row as any)[answerIndex]
        }
        const content = (row as any)[contentIndex]
        const answer_arr: Array<any> = [];
        let index = 0;
        options.forEach((value, key) => {
            answer_arr.push({
                name: key,
                content: "" + (row as any)[value],
                isanswer: isAnswer(answer, row, value, key)
            })
            index++;
        })
        index = 0;
        return {
            content,
            name: answer instanceof Array ? "多选题" : "单选题",
            type: answer instanceof Array ? 1 : 0,
            answer: answer_arr
        }

    }

    // 解析判断题和填空题
    const parseQuestioOfGapOrEstimate = (row: any) => {
        let answer = "";
        const content = (row as any)[contentIndex]
        // 选项中有内容则解析选项中的内容作为答案
        for (let option of options.values()) {
            let option_answer = (row as any)[option]
            if (!(option_answer === undefined || option_answer === "null" || option_answer === "" || option_answer === null)) {
                answer = (row as any)[option]
                break;
            }
        }
        answer = answer === "" ? (row as any)[answerIndex]?.toString() : answer?.toString()
        return {
            content,
            answer: [
                { answer }
            ],
            name: "未知题型",
            type: -1
        }
    }

    // 循环控制
    const range = (start: number = 0, end: number) => {
        const arr = []
        for (let index = start; index < end; index++) {
            arr.push(index)
        }
        return arr
    }
    // 判断是否为答案
    const isAnswer = (answer: Array<string | number> | string, rowdata: any, value: number, key: string) => {
        let isAnswer = false;
        if (answer instanceof Array) {
            answer.forEach(option => {
                if (option === rowdata[value] || option === key) {
                    isAnswer = true;
                }
            })
        } else {
            isAnswer = (answer === (rowdata as any)[value] || answer === key)
        }
        return isAnswer
    }

    // 处理SelectPicker旧值
    const handleOldvalue = (key: string, value: any) => {
        if (oldValue.get(key) === undefined) {
            oldValue.set(key, value)
        } else {
            const old = oldValue.get(key)
            let index: number = disabledOptions.indexOf(old || 0)
            if (index !== -1) {
                disabledOptions.splice(index, 1)
                setOldValue(oldValue.set(key, value))
            }
        }
    }
    // 删除多余答案中Undefined
    const cleanUndefinedAnswer = (questionOfOption: any) => {
        const filter_answer = questionOfOption['answer'].filter((item: any) => {
            return !(item['content'] === undefined);
        })
        return {
            ...questionOfOption,
            answer: filter_answer
        }
    }
    // 提交数据到服务器
    const APICrreateQuestions = (secretKey: string, data: string) => {
        axios
            .post('/api/open/submit', data, {
                headers: {
                    "Authorization": secretKey,
                    "Content-Type": "application/json; charset=utf-8"
                }
            }).then((res: any) => {
                console.log(res);
                const { data } = res;
                if (data?.code !== 200 || !data?.data) {
                    alert(data?.msg + '' || '失败，请稍后重试！')
				}else {
                    onSelected(data?.data.success.length)
                }
                
            }).catch((error:any)=>{
                alert(error + '' || '失败，请稍后重试！')
            })
    }
    // 提交
    const commit = () => {
        const optionsIsNull = (options.size === 0);
        let nullCount = 0;
        let notNullCount = 0;
        let data: any = [];
        fileData.forEach(row => {
            options.forEach(value => {
                if ((row as any)[value] === "null" || (row as any)[value] === "" || (row as any)[value] == null) {
                    nullCount++;
                } else {
                    notNullCount++;
                }

            })
            // 用户没有选择答案或者不为空的答案小于等一
            if (optionsIsNull || notNullCount <= 1) {
                const questioOfGapOrEstimate = parseQuestioOfGapOrEstimate(row)
                data.push(questioOfGapOrEstimate)
            } else {
                const questionOfOption = parseQuestionOfOption(row)
                data.push(cleanUndefinedAnswer(questionOfOption))
            }
            nullCount = 0;
            notNullCount = 0;
        })
        // console.log(data);
        const json_data = JSON.stringify(data)
        console.log(json_data);
        if (!(secretKey === '')) {
            APICrreateQuestions(secretKey,json_data)
        } else {
            setemptyModalConfig({
                showModal: true
            })
        }

    }

    const cleanOptions = (index: number) => {
        const key = String.fromCharCode((65 + index))
        handleOldvalue(key, undefined)
        setDisabledOptions([...disabledOptions])
        const result = options.delete(key)
        if (result) {
            setOptions(options)
        }
    }




    let max_len = useMemo(() => {
        return Math.max.apply(null, fileData.map(item => Object.keys(item).length))
    }, [fileData])

    useEffect(() => {
        createColumnsAndRowKeys()
        setColumns(defaultColumns)
        setRowKeys(defaultRowKeys)
    }, [max_len])




    return (
        <div>
            <Table
                height={300}
                fillHeight={false}
                showHeader={true}
                autoHeight={false}
                data={fileData}
                bordered={true}
                cellBordered={true}
                headerHeight={30}
                rowHeight={30}
            >
                {columns.map(column => {
                    const { key, label, ...rest } = column;
                    return (
                        <Column {...rest} key={"col_" + key} align='center' fullText={true}>
                            <CompactHeaderCell>{label}</CompactHeaderCell>

                            <CompactCell dataKey={`${key}`}>
                                {
                                    (rowData: any) => {
                                        return key === 'ctl' ?
                                            <Button
                                                color="red"
                                                style={{ height: '100%' }}
                                                appearance="primary" onClick={() => {
                                                    deleteFileDataById(rowData['id'])
                                                }}>
                                                删除
                                            </Button> : <div style={
                                                answerIndex === key || contentIndex === key ?
                                                    { backgroundColor: '#87CEFA', color: "white" } : [...options.values()].indexOf((key as number)) !== -1 ?
                                                        { backgroundColor: '#40E0D0', color: "white" } : {}
                                            }>{rowData[`${key}`]}</div>
                                    }
                                }
                            </CompactCell>
                        </Column>
                    );
                })}
            </Table>

            <Row style={{ padding: '20px 5px', paddingBottom: 0 }}>
                <SelectPicker label="题目内容" defaultValue={contentIndex} data={rowKeys} searchable={false} style={{ width: 124, marginRight: 10 }} onChange={(value, event) => {
                    if (value !== null) {
                        handleOldvalue("content", value)
                        setDisabledOptions([...disabledOptions, value])
                        setContentIndex(value)
                    }
                }} disabledItemValues={disabledOptions} cleanable={false} />
                <SelectPicker label="正确答案" defaultValue={answerIndex} data={rowKeys} searchable={false} style={{ width: 124, marginRight: 10 }} onChange={(value, event) => {
                    if (value !== null) {
                        handleOldvalue("answer", value)
                        setDisabledOptions([...disabledOptions, value])
                        setAnswerIndex(value)
                    }
                }} disabledItemValues={disabledOptions} cleanable={false} />
            </Row>
            <Row style={{ padding: '10px 5px' }}>
                {
                    range(0, selectPickerNumber).map(index => {
                        return (<SelectPicker label={String.fromCharCode((65 + index)) + " 选项"}
                            data={rowKeys} searchable={false}
                            style={{ width: 124, marginRight: 10 }}
                            disabledItemValues={disabledOptions}
                            onChange={
                                (value, event) => {
                                    if (value !== null) {
                                        const key = String.fromCharCode((65 + index))
                                        handleOldvalue(key, value)
                                        setDisabledOptions([...disabledOptions, value])
                                        setOptions(options.set(key, value))
                                    }
                                }
                            }
                            onClean={
                                () => {
                                    cleanOptions(index)
                                }
                            }

                        />)
                    })
                }
                <Button onClick={() => {
                    if (selectPickerNumber < (max_len - 2)) {
                        setSelectPickerNumber(selectPickerNumber + 1)
                    } else {
                        alert("已经到达最大可选项")
                    }
                }}>增加选项</Button>
            </Row>

            <Row style={{ padding: '0px 5px', paddingBottom: 20 }}>
                <SelectPicker label="应用密钥" data={defaultSecretKey} searchable={false} style={{ width: 124, marginRight: 10 }} onChange={(value, event) => {
                    if (value !== '') {
                        setSecretKey((value as string))
                    }
                }} />
            </Row>

            <Row>
                <div style={{ flex: 1, display: 'flex' }}>
                    <Button appearance='link'>高级配置</Button>
                    <Button appearance='primary' onClick={commit}>确定提交</Button>
                </div>
            </Row>

            <Modal
                backdrop="static"
                role="alertdialog"
                open={emptyModalConfig.showModal}
                onClose={() =>
                    setemptyModalConfig({
                        showModal: false,
                    })
                }
                size="xs"
            >
                <Modal.Body>
                    {
                        defaultSecretKey?.length !== 0 ? "请选择一个应用密钥后进行上传。" : "您暂时没有创建应用，请前往控制中心>应用密钥创建密钥后再进行上传。"
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() =>
                            setemptyModalConfig({
                                showModal: false,
                            })
                        }
                        appearance="subtle"
                    >
                        知道了
                    </Button>
                    {
                        defaultSecretKey?.length !== 0 ? <></> : <Button
                            onClick={() => {
                                navigate("/control/appkeys", {
                                    replace: true,
                                });
                            }}
                            appearance="primary"
                        >
                            去创建
                        </Button>
                    }
                </Modal.Footer>
            </Modal>

        </div>
    )
}
