// /src/components/admin/VerificationRequests.jsx
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const VerificationRequests = ({ isOpen, onClose, requests, onApprove, onDeny }) => {
  return (
    <Modal title="Pending Access Requests" isOpen={isOpen} onClose={onClose}>
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.$id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="text-gray-800 font-medium">{req.userName}</p>
                <p className="text-xs text-gray-500">{req.email}</p>
              </div>
              <div className="space-x-2">
                <Button onClick={() => onDeny(req.$id)} variant="secondary" className="text-xs px-3 py-1">
                  Deny
                </Button>
                <Button onClick={() => onApprove(req)} className="text-xs px-3 py-1">
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">There are no pending requests.</p>
      )}
    </Modal>
  );
};

export default VerificationRequests;