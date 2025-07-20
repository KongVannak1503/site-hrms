import { Modal } from 'antd';

const showCustomConfirm = ({ title, content, onOk, onCancel, okButton, cancelButton }) => {
  Modal.confirm({
    title,
    content,
    centered: true,
    icon: null, // optional: remove default icon
    okButtonProps: { style: { display: 'none' } }, // hide default buttons
    cancelButtonProps: { style: { display: 'none' } },
    content: (
      <div>
        <p>{content}</p>
        <div className="flex justify-end gap-3 mt-4">
          {cancelButton || (
            <button onClick={onCancel} className="btn btn-cancel">No</button>
          )}
          {okButton || (
            <button onClick={onOk} className="btn btn-danger">Yes</button>
          )}
        </div>
      </div>
    ),
    onOk: () => {}, // required for Modal.confirm to work
  });
};

export default showCustomConfirm;
