'use client';

import { useUserContext } from '@/context/UserContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExternalTransferForm from './ExternalTransferForm';
import InternalTransferForm from './InternalTransferForm';

interface TransferDialogProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

export default function TransferDialog({ isVisible, setIsVisible }: TransferDialogProps) {
  const { refetchAccountsAndTransactions } = useUserContext();

  const onSuccess = () => {
    refetchAccountsAndTransactions();
    setIsVisible(false);
  };

  return (
    <Dialog open={isVisible} onOpenChange={setIsVisible}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Transfer Funds</DialogTitle>
          <DialogDescription>
            Send money between your accounts or to another user. Choose the appropriate transfer
            type.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="internal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="internal">Internal</TabsTrigger>
            <TabsTrigger value="external">External</TabsTrigger>
          </TabsList>

          <TabsContent value="internal">
            <InternalTransferForm onSuccess={onSuccess} />
          </TabsContent>

          <TabsContent value="external">
            <ExternalTransferForm onSuccess={onSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
