import { Popconfirm, Button, Tooltip } from 'antd'
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
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
                    <ReloadOutlined />
                </button>
            </Tooltip>
        </Popconfirm>
    )
}
