import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, ShieldOff, Crown } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import type { User as UserType } from "@shared/schema";

export default function AdminUsers() {
  const { toast } = useToast();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  // Redirect to home if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.isAdmin)) {
      toast({
        title: "Unauthorized",
        description: "You need admin access to view this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }
  }, [isAuthenticated, authLoading, user, toast]);

  const { data: users = [], isLoading } = useQuery<UserType[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user?.isAdmin,
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, makeAdmin }: { userId: string; makeAdmin: boolean }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}`, { isAdmin: makeAdmin });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: `User ${variables.makeAdmin ? 'promoted to' : 'removed from'} admin successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user admin status.",
        variant: "destructive",
      });
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600 font-opensans">
            Manage admin access and user permissions for SA News JK
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              All Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No users found.</p>
              ) : (
                users.map((userItem) => (
                  <div
                    key={userItem.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {userItem.profileImageUrl ? (
                          <img
                            src={userItem.profileImageUrl}
                            alt={`${userItem.firstName} ${userItem.lastName}`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                        {userItem.isAdmin && (
                          <Crown className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">
                            {userItem.firstName} {userItem.lastName}
                          </h3>
                          {userItem.isAdmin && (
                            <Badge variant="default" className="bg-primary text-white">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{userItem.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined {formatDate(userItem.createdAt!)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {userItem.id === user.id ? (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          You
                        </Badge>
                      ) : (
                        <Button
                          variant={userItem.isAdmin ? "destructive" : "default"}
                          size="sm"
                          onClick={() =>
                            toggleAdminMutation.mutate({
                              userId: userItem.id,
                              makeAdmin: !userItem.isAdmin,
                            })
                          }
                          disabled={toggleAdminMutation.isPending}
                        >
                          {userItem.isAdmin ? (
                            <>
                              <ShieldOff className="h-4 w-4 mr-1" />
                              Remove Admin
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-1" />
                              Make Admin
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Admin Management Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Admins can create, edit, and delete articles and videos</li>
            <li>• Admins can promote or demote other users (except themselves)</li>
            <li>• Always ensure at least one admin exists in the system</li>
            <li>• Be careful when removing admin access from users</li>
          </ul>
        </div>
      </div>
    </div>
  );
}