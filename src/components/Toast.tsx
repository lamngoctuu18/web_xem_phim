import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      style={{
        zIndex: 9999,
      }}
      toastStyle={{
        backgroundColor: '#1a1a2e',
        color: '#ffffff',
        borderRadius: '12px',
        border: '1px solid rgba(239, 68, 68, 0.3)',
      }}
    />
  );
};

export default Toast;
