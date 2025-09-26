import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { LogOut, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserProfile = () => {
  const { user, logout, updateUserRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.role || '');
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
    updateUserRole(newRole);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'user': return 'default';
      case 'nothing': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <Badge variant={getRoleColor(user.role)} className="mt-2">
              {user.role}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {user.role === 'admin' && (
          <div className="space-y-2">
            <Label htmlFor="role-select" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Role Management
            </Label>
            <p className="text-sm text-muted-foreground">
              Use the User Management page to configure roles for all users.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            Provider: {user.provider}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Settings className="w-4 h-4" />
            ID: {user.id}
          </div>
        </div>

        <Button 
          onClick={handleLogout} 
          variant="outline" 
          className="w-full"
          size="sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </CardContent>
    </Card>
  );
};