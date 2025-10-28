'use client';
import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ContactsPage() {
    const [contacts, setContacts] = useState([
    { id: 1, name: 'Sarah Wilson', email: 'sarah@example.com', subject: 'Wedding Photography', date: '2025-10-20', status: 'Mới nhất' },
    { id: 2, name: 'Tom Brown', email: 'tom@example.com', subject: 'Portrait Session', date: '2025-10-19', status: 'Cũ nhất' },
    { id: 3, name: 'Emily Davis', email: 'emily@example.com', subject: 'Event Coverage', date: '2025-10-18', status: 'Thường xuyên' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Liên hệ khách hàng</h1>
        <div className="flex items-center space-x-2">
          <select className="px-4 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none">
            <option>Trạng thái</option>
            <option>Mới nhất</option>
            <option>Cũ nhất</option>
            <option>Theo dõi nhiều nhất</option>
            <option>Thường xuyên</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chủ đề</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày / tháng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contacts.map(contact => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{contact.name}</td>
                <td className="px-6 py-4 text-gray-600">{contact.email}</td>
                <td className="px-6 py-4 text-gray-600">{contact.subject}</td>
                <td className="px-6 py-4 text-gray-600">{contact.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    contact.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    contact.status === 'Read' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {contact.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-blue-600 hover:text-blue-700">
                    <Eye className="w-4 h-4 inline" />
                  </button>
                  <button className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}