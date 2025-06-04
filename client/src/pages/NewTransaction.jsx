import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilePlus, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewTransaction = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1f3f6f]">New Transaction</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/transactions')}>
              Cancel
            </Button>
            <Button className="bg-[#1eafd0] text-white hover:bg-[#1eafd0]/90">Save Draft</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTransaction;
