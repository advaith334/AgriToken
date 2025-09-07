import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff } from "lucide-react";

interface MnemonicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMnemonicSubmit: (mnemonic: string) => Promise<boolean>;
}

export default function MnemonicModal({ isOpen, onClose, onMnemonicSubmit }: MnemonicModalProps) {
  const [mnemonic, setMnemonic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!mnemonic.trim()) {
      toast({
        title: 'Mnemonic required',
        description: 'Please enter your 25-word mnemonic phrase.',
        variant: 'destructive'
      });
      return;
    }

    // Basic validation - check if it has 25 words
    const words = mnemonic.trim().split(/\s+/);
    if (words.length !== 25) {
      toast({
        title: 'Invalid mnemonic',
        description: 'Mnemonic must contain exactly 25 words.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await onMnemonicSubmit(mnemonic.trim());
      
      if (success) {
        toast({
          title: 'Mnemonic set successfully',
          description: 'Your wallet is now connected and ready for transactions.',
        });
        setMnemonic("");
        onClose();
      } else {
        toast({
          title: 'Invalid mnemonic',
          description: 'The mnemonic you entered is invalid. Please check and try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set mnemonic. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setMnemonic("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>
            Enter your 25-word mnemonic phrase to connect your Algorand wallet for blockchain transactions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Security Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Security Notice</p>
                <p className="text-yellow-700">
                  Your mnemonic is used locally and securely. Never share it with anyone.
                </p>
              </div>
            </div>
          </div>

          {/* Mnemonic Input */}
          <div className="space-y-2">
            <Label htmlFor="mnemonic">25-Word Mnemonic Phrase</Label>
            <div className="relative">
              <Textarea
                id="mnemonic"
                placeholder="Enter your 25-word mnemonic phrase here..."
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                className="min-h-[100px] pr-10"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-6 w-6 p-0"
                onClick={() => setShowMnemonic(!showMnemonic)}
                disabled={isLoading}
              >
                {showMnemonic ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {mnemonic.trim().split(/\s+/).length}/25 words
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!mnemonic.trim() || isLoading}
              className="flex-1 gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
