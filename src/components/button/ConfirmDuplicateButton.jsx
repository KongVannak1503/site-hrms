import { Popconfirm, Button, Tooltip } from 'antd'
import { IoDuplicateOutline } from "react-icons/io5";
import { Styles } from '../../utils/CsStyle'

export const ConfirmDuplicateButton = ({
    onConfirm,
    title = "Duplicate the task",
    description = "Are you sure to Duplicate this task?",
    tooltip = "Duplicate",
    okText = "Yes",
    cancelText = "No"
}) => {
    return (
        <Popconfirm
            title={title}
            description={description}
            onConfirm={onConfirm}
            okText={okText}
            cancelText={cancelText}
        >
            <Tooltip title={tooltip}>
                <button className={Styles.btnDownload} >
                    <IoDuplicateOutline />
                </button>
            </Tooltip>
        </Popconfirm>
    )
}
