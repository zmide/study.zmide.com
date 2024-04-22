/*
 * @Author: Bin
 * @Date: 2023-12-05
 * @FilePath: /so.jszkk.com/src/views/question/XlsxAnalyze.tsx
 */
import React, { useState } from 'react'
import { AppHead, AppFooter } from 'components';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Row,
    Divider,
    Breadcrumb,
    Steps,
} from 'rsuite';

import Steps00 from './analyzes/Steps00';
import Steps01 from './analyzes/Steps01';
import Steps02 from './analyzes/Steps02';
import Steps03 from './analyzes/Steps03';

type DataAnalyzeConfig = {
    type: 'xlsx',
    inputLits: Array<any> | undefined,
}

export default function XlsxAnalyze() {
    const navigate = useNavigate();

    const [config, setConfig] = useState<DataAnalyzeConfig>({
        type: 'xlsx',
        inputLits: [],
    })


    // 获取文件数据
    const [fileData,setFileData] = useState<Array<Object>>([]);
    const handleSend  = (fileData:Array<Object>)=>  {
         setFileData(fileData);
    }
    // 通过ID删除行数据
    const deleteFileDataById  = (id:number|string) =>{
        
        setFileData(
            fileData.filter(item => {
                return  !((item as any).id === id)
            })
        )       
    }
    let  [uploadNumber,setUploadNumber] = useState(0);

    const [stepsIndex, setStepsIndex] = useState(0)

    return (
        <div className="container">
            <AppHead />
            <div className="context control">
                <div className="layout content">
                    <div className="content_app">
                        <div>
                            <Row style={{ display: 'flex', padding: 10 }}>
                                <h4 style={{ fontWeight: 300 }}>批量上传</h4>
                                <div style={{ flex: 1 }} />
                                <Button
                                    style={{ marginRight: 10 }}
                                    onClick={() => {
                                        let index = stepsIndex + 1;
                                        if (index > 3) {
                                            index = 0;
                                        }
                                        setStepsIndex(index)
                                    }}
                                >
                                    清空数据
                                </Button>
                            </Row>
                            <Divider style={{ margin: 0 }} />
                        </div>
                        <div style={{ padding: '10px 0' }}>
                            <Breadcrumb>
                                <Breadcrumb.Item
                                    onClick={() => {
                                        navigate('/control/questions', {
                                            replace: true,
                                        });
                                    }}
                                >
                                    控制中心
                                </Breadcrumb.Item>
                                <Breadcrumb.Item active>批量上传</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div style={{ flex: 1, width: '100%', margin: '0 auto', paddingTop: 30, maxWidth: 700 }}>

                            <Steps current={stepsIndex} style={{ marginBottom: 15 }}>
                                <Steps.Item title="选择数据格式" />
                                <Steps.Item title="上传数据" />
                                <Steps.Item title="校对数据" />
                                <Steps.Item title="确认上传数据" />
                            </Steps>

                            <div>
                                {stepsIndex === 0 && (
                                    <Steps00 onSelected={(index) => {
                                        console.log('onSelected', index);
                                        setConfig({
                                            ...config,
                                            type: 'xlsx'
                                        })
                                        setStepsIndex(1)
                                    }} />
                                )}
                                {stepsIndex === 1 && (
                                    <Steps01 type={config.type} onSelected={() => setStepsIndex(2)} onHandleSend = {handleSend} />
                                )}
                                {stepsIndex === 2 && (
                                    <Steps02 fileData  = {fileData} deleteFileDataById={deleteFileDataById} onSelected={
                                        (uploadNUm:number) => {
                                            setStepsIndex(3)
                                            setUploadNumber(uploadNUm);
                                        }
                                    }  />
                                )}
                                {stepsIndex === 3 && (
                                   <Steps03 uploadNumber={uploadNumber} />
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            <AppFooter />
        </div>

    )
}
