import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  message,
  Popconfirm,
  Select,
  Avatar,
  Tooltip,
} from "antd";
import {
  Trash2,
  ShieldCheck,
  Mail,
  UserCheck,
  Search,
  Plus,
} from "lucide-react";
import { getUsers, updateUserRole, deleteUser } from "../../api/userApi";

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Fetch Logic
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      message.error("Consultation failed: Unable to fetch client list");
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
      message.success(`Access level updated to ${newRole.toUpperCase()}`);
      fetchUsers();
    } catch (error) {
      message.error("Credential update failed");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      message.success("Client record successfully archived");
      fetchUsers();
    } catch (error) {
      message.error("Action denied");
    }
  };

  const columns = [
    {
      title: "CLIENT IDENTITY",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
            {text?.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {text}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400">
              ID: {record._id?.slice(-6)}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "COMMUNICATION",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Mail size={14} className="text-amber-500" />
          <span className="text-sm font-medium">{email}</span>
        </div>
      ),
    },
    {
      title: "ACCESS LEVEL",
      dataIndex: "role",
      key: "role",
      render: (role, record) => (
        <Select
          value={role}
          bordered={false}
          dropdownStyle={{
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
          }}
          className={`rounded-xl px-2 py-0.5 text-xs font-bold transition-all ${
            role === "admin"
              ? "bg-amber-500/10 text-amber-500"
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
          }`}
          style={{ width: 130 }}
          onChange={(value) => handleRoleChange(record._id, value)}
        >
          <Option value="user">
            <div className="flex items-center gap-2 dark:text-slate-300">
              <UserCheck size={12} /> Client
            </div>
          </Option>
          <Option value="admin">
            <div className="flex items-center gap-2 text-amber-500">
              <ShieldCheck size={12} /> Architect
            </div>
          </Option>
        </Select>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Archive client data?"
            onConfirm={() => handleDelete(record._id)}
            okText="Archive"
            cancelText="Cancel"
          >
            <Tooltip title="Delete Account">
              <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                <Trash2 size={18} />
              </button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="p-6 sm:p-10 min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Dynamic CSS to force Ant Design into Dark Theme */}
      <style>{`
        .dark .ant-table { background: transparent !important; color: #f1f5f9 !important; }
        .dark .ant-table-thead > tr > th { 
          background: #0f172a !important; 
          color: #94a3b8 !important; 
          border-bottom: 1px solid #1e293b !important;
          font-size: 11px;
          letter-spacing: 0.05em;
        }
        .dark .ant-table-tbody > tr > td { border-bottom: 1px solid #1e293b !important; }
        .dark .ant-table-tbody > tr:hover > td { background: #1e293b !important; }
        .dark .ant-pagination-item { background: #1e293b; border-color: #334155; }
        .dark .ant-pagination-item-active { border-color: #f59e0b; }
        .dark .ant-pagination-item-active a { color: #f59e0b; }
        .dark .ant-select-dropdown { background-color: #0f172a !important; border: 1px solid #1e293b; }
      `}</style>

      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em]">
              Administrator Space
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Manage <span className="text-amber-500 text-stroke-sm">Users</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search directory..."
              className="pl-10 pr-4 py-3 w-full md:w-80 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-sm dark:text-slate-200"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all duration-500">
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 7,
            className: "px-8 py-6",
          }}
        />
      </div>

      <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest opacity-50">
        Secure Infrastructure Layer — Rudra360 v2.0
      </p>
    </div>
  );
};

export default Users;
