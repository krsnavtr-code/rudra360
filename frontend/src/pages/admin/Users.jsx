import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Select } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getUsers, updateUserRole, deleteUser } from '../../api/userApi';

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      message.success('User role updated successfully');
      fetchUsers(); // Refresh the users list
    } catch (error) {
      message.error('Failed to update user role');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      message.success('User deleted successfully');
      fetchUsers(); // Refresh the users list
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => (
        <Select
          defaultValue={role}
          style={{ width: 120 }}
          onChange={(value) => handleRoleChange(record._id, value)}
        >
          <Option value="user">User</Option>
          <Option value="admin">Admin</Option>
        </Select>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        className="bg-white rounded-lg shadow"
      />
    </div>
  );
};

export default Users;
