import React, { useState, useEffect } from "react";
import { getDashboardStats } from "../../api/dashboardApi";
import { toast } from "react-hot-toast";
import {
  UsersIcon,
  BriefcaseIcon,
  StarIcon,
  EyeIcon,
  ArrowPathIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Sparkles, TrendingUp, Activity, Calendar } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError(err.message || "Failed to load dashboard data");
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num || 0);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Activity className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Unable to load dashboard
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchDashboardStats}
          className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          {lastRefresh && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {formatDate(lastRefresh)}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm md:text-base">
            Add New Media
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {formatNumber(stats?.overview?.totalUsers)}
              </p>
              <div className="flex items-center mt-2 text-xs text-green-600 dark:text-green-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>Active users</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Projects Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Total Projects
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {formatNumber(stats?.overview?.totalProjects)}
              </p>
              <div className="flex items-center mt-2 text-xs text-amber-600 dark:text-amber-400">
                <BriefcaseIcon className="h-3 w-3 mr-1" />
                <span>Portfolio items</span>
              </div>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
              <BriefcaseIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        {/* Featured Projects Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Featured Projects
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {formatNumber(stats?.overview?.featuredProjects)}
              </p>
              <div className="flex items-center mt-2 text-xs text-purple-600 dark:text-purple-400">
                <StarIcon className="h-3 w-3 mr-1" />
                <span>Highlighted work</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
              <StarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Public Projects Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Public Projects
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {formatNumber(stats?.overview?.publicProjects)}
              </p>
              <div className="flex items-center mt-2 text-xs text-green-600 dark:text-green-400">
                <EyeIcon className="h-3 w-3 mr-1" />
                <span>Visible to public</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
              <EyeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Users
              </h3>
              <UserGroupIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            {stats?.recentActivity?.recentUsers?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.recentUsers.map((user, index) => (
                  <div key={user._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {user.role}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserGroupIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No recent users</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Projects
              </h3>
              <BriefcaseIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            {stats?.recentActivity?.recentProjects?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.recentProjects.map((project, index) => (
                  <div key={project._id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {project.clientName} • {project.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(project.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BriefcaseIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No recent projects</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Project Status
            </h3>
          </div>
          <div className="p-6">
            {stats?.analytics?.projectStatusStats?.length > 0 ? (
              <div className="space-y-3">
                {stats.analytics.projectStatusStats.map((status) => (
                  <div key={status._id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {status._id}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {status.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <ChartBarIcon className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Categories
            </h3>
          </div>
          <div className="p-6">
            {stats?.analytics?.categoryStats?.length > 0 ? (
              <div className="space-y-3">
                {stats.analytics.categoryStats.map((category, index) => (
                  <div key={category._id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {category._id}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Sparkles className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* User Roles */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              User Roles
            </h3>
          </div>
          <div className="p-6">
            {stats?.analytics?.userRoleStats?.length > 0 ? (
              <div className="space-y-3">
                {stats.analytics.userRoleStats.map((role) => (
                  <div key={role._id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {role._id}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {role.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <UsersIcon className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
