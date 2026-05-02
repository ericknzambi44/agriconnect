// src/features/admin/pages/AdminUsers.tsx
import React from 'react';
import UserControlList from '../components/UserControlList';


export default function AdminUsers() {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <UserControlList />
    </div>
  );
}