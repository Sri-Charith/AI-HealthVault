// // src/components/NotificationModal.jsx
// import React from 'react';
// import { Modal, Button } from 'react-bootstrap';

// const NotificationModal = ({ notifications, onClose }) => {
//   return (
//     <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//       <div className="modal-dialog modal-dialog-scrollable" role="document">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Notifications</h5>
//             <button type="button" className="btn-close" onClick={onClose}></button>
//           </div>
//           <div className="modal-body">
//             {notifications.length === 0 ? (
//               <p className="text-muted">No notifications</p>
//             ) : (
//               <ul className="list-group">
//                 {notifications.map((n, index) => (
//                   <li key={index} className="list-group-item d-flex justify-content-between align-items-start">
//                     <div>
//                       <div className="fw-bold">{n.message}</div>
//                       <small className="text-muted">{new Date(n.timestamp).toLocaleString()}</small>
//                     </div>
//                     {!n.isRead && <span className="badge bg-primary">New</span>}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//           <div className="modal-footer">
//             <Button variant="secondary" onClick={onClose}>Close</Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotificationModal;

// src/components/NotificationModal.jsx
import React from 'react';

const NotificationModal = ({ notifications, onClose, onMarkAllRead }) => {
  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Notifications</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {notifications.length === 0 ? (
              <p className="text-muted">No notifications</p>
            ) : (
              notifications.map((notif, index) => (
                <div key={index} className={`alert ${notif.read ? 'alert-secondary' : 'alert-warning'}`}>
                  {notif.message}
                </div>
              ))
            )}
          </div>
          <div className="modal-footer">
            <button onClick={onMarkAllRead} className="btn btn-sm btn-outline-success">
              Mark All as Read
            </button>
            <button onClick={onClose} className="btn btn-sm btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
