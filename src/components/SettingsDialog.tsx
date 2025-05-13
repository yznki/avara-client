'use client';

import { useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const profileSchema = z.object({
  name: z.string().min(1).trim(),
  phone: z.string().min(5).trim(),
  street: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

interface SettingsDialogProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export function SettingsDialog({ isOpen, setIsOpen }: SettingsDialogProps) {
  const { user, refetchAccountsAndTransactions, refetchUser } = useUserContext();
  const { getAccessTokenSilently } = useAuth0();

  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      street: user.address?.street ?? '',
      city: user.address?.city ?? '',
      zip: user.address?.zip ?? '',
      country: user.address?.country ?? '',
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    try {
      const token = await getAccessTokenSilently();
      let profilePictureUrl: string | undefined = undefined;

      if (profilePicture) {
        const formData = new FormData();
        formData.append('profilePicture', profilePicture);

        const uploadRes = await api.post('/user/me/upload-profile-picture', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        profilePictureUrl = uploadRes.data.profilePicture;
      }

      const payload = {
        name: values.name,
        phone: values.phone,
        profilePicture: profilePictureUrl ?? user.profilePicture,
        address: {
          street: values.street,
          city: values.city,
          zip: values.zip,
          country: values.country,
        },
      };

      await api.patch('/user/me', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await refetchUser();
      await refetchAccountsAndTransactions();
      toast.success('Profile updated');
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0 group">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={profilePicture ? URL.createObjectURL(profilePicture) : user.profilePicture}
                    alt={user.name}
                  />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition">
                  <Pencil className="w-4 h-4 text-white" />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files?.[0] ?? null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  title="Upload new profile picture"
                />
              </div>

              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
