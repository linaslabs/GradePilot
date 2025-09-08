import React from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Degree } from '@/types';
import { BookOpen, LogOut, Settings } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
interface SidebarProps {
  degree: Degree | null;
}

export default function AppSidebar({ degree }: SidebarProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>Gradepilot</SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>
            {user?.name?.split(' ')[0]}'s{' '}
            {user?.degreeType === 'Doctorate' ||
            user?.degreeType === 'Major' ? (
              <>{user.degreeType}</>
            ) : (
              <>{user?.degreeType} degree</>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink to="/dashboard/overview">
                  <SidebarMenuButton>Overview</SidebarMenuButton>
                </NavLink>
              </SidebarMenuItem>
              {degree?.academicYears.map((year) => (
                <SidebarMenuItem key={year.id}>
                  <NavLink to={`/dashboard/year/${year.yearNumber}`}>
                    <SidebarMenuButton>
                      <BookOpen />
                      Year {year.yearNumber}
                    </SidebarMenuButton>
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink to="/dashboard/settings">
                  <SidebarMenuButton>
                    <Settings />
                    Settings
                  </SidebarMenuButton>
                </NavLink>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
                  Logout
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
