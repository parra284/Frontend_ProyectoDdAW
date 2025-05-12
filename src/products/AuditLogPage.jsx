import React from 'react';
import Navbar from '../components/Navbar';
import AuditLogViewer from '../components/AuditLogViewer';

/**
 * Page for viewing product deletion audit logs
 */
const AuditLogPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Product Removal Audit Logs</h1>
          <p className="mt-1 text-sm text-gray-600">
            View a history of all removed products with details about when, why, and by whom they were removed.
          </p>
        </div>

        <AuditLogViewer />
      </div>
    </div>
  );
};

export default AuditLogPage;
