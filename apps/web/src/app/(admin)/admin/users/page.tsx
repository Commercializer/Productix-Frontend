"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { listAllUsersAction } from "@/lib/admin/actions";
import { UserTable, type AdminUser } from "@/components/admin/user-table";
import { CreateUserModal } from "@/components/admin/create-user-modal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isPending, startTransition] = useTransition();
  const [showCreate, setShowCreate] = useState(false);

  const loadUsers = useCallback(() => {
    startTransition(async () => {
      try {
        const data = await listAllUsersAction();
        setUsers(data as AdminUser[]);
      } catch (e) {
        console.error(e);
      }
    });
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-sub">Manage all platform users and their roles</p>
        </div>
      </div>

      {isPending && users.length === 0 ? (
        <div className="skeleton-table">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row" />
          ))}
        </div>
      ) : (
        <UserTable
          users={users}
          onCreateUser={() => setShowCreate(true)}
          onRefresh={loadUsers}
        />
      )}

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onSuccess={loadUsers}
        />
      )}
    </div>
  );
}
