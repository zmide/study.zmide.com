import CheckRoundIcon from '@rsuite/icons/CheckRound';
import { useNavigate } from 'react-router-dom';
interface  Steps00Props{
    uploadNumber:number
}
export default function Step03(props: Steps00Props) {
    const  {uploadNumber} = props;
    const navigate = useNavigate();
    return  (
       <div>
        <div style={{
            margin:"40px 0 20px 0",
            color:"#3CB371",
            fontSize:"24px",
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
        }}>
           < CheckRoundIcon color="#3CB371"/>
            <span style={{paddingLeft:8}}>上传成功，本次上传{uploadNumber}道题目，感谢您的支持！</span>
        </div>
        <div style={{
             display:"flex",
             justifyContent:"center",
             alignItems:"center",
             fontSize:"14px",
             cursor:"pointer"
        }} >
            <a onClick={ event => {
                event.preventDefault()
                navigate("/control/questions", {
                    replace: true,
                });
                
            }}>查看题目上传列表</a>
        </div>
       </div>
    )

}