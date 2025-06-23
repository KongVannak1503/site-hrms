import { Popconfirm, Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Styles } from '../../utils/CsStyle'

export const ConfirmDeleteButton = ({
    onConfirm,
    title = "Delete the task",
    description = "Are you sure to delete this task?",
    tooltip = "Delete",
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
                <button className={Styles.btnDelete} >
                    <DeleteOutlined />
                </button>
            </Tooltip>
        </Popconfirm>
    )
}
