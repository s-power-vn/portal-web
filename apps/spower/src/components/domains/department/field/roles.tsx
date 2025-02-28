import { EditIcon, PlusIcon, XIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@minhdtb/storeo-theme';

export type Role = {
  id: string;
  name: string;
};

export type RolesProps = {
  value?: Role[];
  onChange?: (value: Role[]) => void;
};

export const Roles: FC<RolesProps> = ({ value = [], onChange }) => {
  const [roles, setRoles] = useState<Role[]>(value);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editingRoleId &&
        editInputRef.current &&
        !editInputRef.current.contains(event.target as Node)
      ) {
        saveRole();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingRoleId, editedName]);

  const handleAddRole = () => {
    const newRoleId = uuidv4();
    const updatedRoles = [...roles, { id: newRoleId, name: '' }];
    setRoles(updatedRoles);
    setEditingRoleId(newRoleId);
    setEditedName('');

    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 0);
  };

  const handleRemoveRole = (id: string) => {
    const updatedRoles = roles.filter(role => role.id !== id);
    setRoles(updatedRoles);
    onChange?.(updatedRoles);
    if (editingRoleId === id) {
      setEditingRoleId(null);
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRoleId(role.id);
    setEditedName(role.name);

    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 0);
  };

  const saveRole = () => {
    if (editingRoleId) {
      const editedNameTrimmed = editedName.trim();
      if (editedNameTrimmed === '') {
        const updatedRoles = roles.filter(role => role.id !== editingRoleId);
        setRoles(updatedRoles);
        onChange?.(updatedRoles);
      } else {
        const updatedRoles = roles.map(role =>
          role.id === editingRoleId
            ? { ...role, name: editedNameTrimmed }
            : role
        );
        setRoles(updatedRoles);
        onChange?.(updatedRoles);
      }
      setEditingRoleId(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <Button
          className="flex h-8 gap-1 px-3 text-sm"
          type="button"
          onClick={handleAddRole}
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Thêm chức danh
        </Button>
      </div>
      {roles.length > 0 && (
        <div className="border-appBlue relative overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-appBlueLight">
              <TableRow className="hover:bg-appBlue">
                <TableHead className="text-appWhite whitespace-nowrap">
                  Chức danh
                </TableHead>
                <TableHead className="text-appWhite w-32 whitespace-nowrap text-center">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role, index) => (
                <TableRow key={role.id} className="hover:bg-slate-50">
                  <TableCell>
                    {editingRoleId === role.id ? (
                      <Input
                        ref={editInputRef}
                        value={editedName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditedName(e.target.value)
                        }
                        onKeyDown={(e: React.KeyboardEvent) => {
                          if (e.key === 'Enter') {
                            saveRole();
                          }
                        }}
                      />
                    ) : (
                      <span>{role.name}</span>
                    )}
                  </TableCell>
                  <TableCell className="flex justify-center gap-2">
                    {editingRoleId !== role.id && (
                      <>
                        <Button
                          variant="outline"
                          className="h-6 px-3"
                          type="button"
                          onClick={() => handleEditRole(role)}
                        >
                          <EditIcon className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          className="h-6 px-3"
                          type="button"
                          onClick={() => handleRemoveRole(role.id)}
                        >
                          <XIcon className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
