import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const DialogLoginAgain = ({ sessionExpired }) => {
  const navigate = useNavigate();

  return (
    <Dialog open={sessionExpired}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
        </DialogHeader>
        <div className="py-4">Your session has expired. Please log in again to continue.</div>
        <div className="flex justify-end">
          <Button className="bg-blue-600 text-white" onClick={() => navigate('/login')}>
            Login Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogLoginAgain;
