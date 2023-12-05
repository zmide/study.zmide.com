/*
 * @Author: Bin
 * @Date: 2023-12-05
 * @FilePath: /so.jszkk.com/src/views/question/analyzes/Steps01.tsx
 */
import React, { useState } from 'react'
import {
    Uploader,
    Loader
} from 'rsuite';
import * as XLSX from "xlsx";

export interface Steps01Props {
    type: 'xlsx'
}

export default function Steps01(props: Steps01Props) {
    const { type } = props

    const [loading, setLoading] = useState(false)

    const parseFileForXlsx = async (file: File) => {
        return new Promise<any[]>((res, rej) => {
            const reader = new FileReader();
            const rABS = !!reader.readAsBinaryString;
            reader.onload = (e) => {
                if (!e.target) {
                    // 文件加载失败
                    rej(new Error('文件加载失败'))
                    return
                }
                /* Parse data */
                const bstr = e.target.result;
                const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                /* Update state */
                res(data)
            };
            if (rABS) reader.readAsBinaryString(file);
            else reader.readAsArrayBuffer(file);
        })

    }

    return (
        <div>
            <Uploader action='' disabled={loading} accept={'.xlsx'} fileListVisible={false} draggable shouldUpload={async (file) => {
                console.log('file', file);
                if (file.blobFile) {
                    setLoading(true)
                    const data = await parseFileForXlsx(file.blobFile)
                    console.log('data', data);
                    setLoading(false)
                } else {
                    // TODO:文件上传失败
                }
                return false
            }}>
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span>点击或拖拽文件到该区域即可上传</span>
                </div>
            </Uploader>
        </div>
    )
}
