import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Megaphone, ToggleLeft, ToggleRight, Download } from 'lucide-react';
import { exportToExcel } from '../utils/exportToExcel';
import { API_BASE_URL, apiFetch } from '../config';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  message: string;
  is_active: boolean;
  created_at: string;
}

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/announcements/`);
      const data = await res.json();
      const announcementsArray = Array.isArray(data) ? data : (data.results || []);
      setAnnouncements(announcementsArray);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingAnnouncement 
        ? `${API_BASE_URL}/api/announcements/${editingAnnouncement.id}/`
        : `${API_BASE_URL}/api/announcements/`;
      
      const method = editingAnnouncement ? 'PATCH' : 'POST';
      
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify({ title, message, is_active: isActive }),
      });
      
      if (res.ok) {
        fetchAnnouncements();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await apiFetch(`${API_BASE_URL}/api/announcements/${id}/`, { method: 'DELETE' });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const handleToggleActive = async (announcement: Announcement) => {
    try {
      await apiFetch(`${API_BASE_URL}/api/announcements/${announcement.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !announcement.is_active }),
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement:', error);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setTitle(announcement.title);
    setMessage(announcement.message);
    setIsActive(announcement.is_active);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAnnouncement(null);
    setTitle('');
    setMessage('');
    setIsActive(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic text-white">Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">Manage gym announcements displayed on the homepage</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportToExcel(announcements, [
              { header: 'Title', key: 'title' },
              { header: 'Message', key: 'message' },
              { header: 'Status', key: 'is_active', transform: (v: any) => v ? 'Active' : 'Inactive' },
              { header: 'Created', key: 'created_at', transform: (v: any) => new Date(v).toLocaleDateString() },
            ], 'Sinen_Announcements_Report')}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border border-orange-500/30 text-orange-500 font-black uppercase rounded-full hover:bg-orange-500/10 transition-colors text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            Export Excel
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-orange-500 text-black font-black uppercase rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            New Announcement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-zinc-900 rounded-[2rem] border border-white/10 p-6 hover:border-orange-500/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Megaphone className="w-5 h-5 text-orange-500" />
                  <h3 className="text-xl font-black text-white">{announcement.title}</h3>
                  <button
                    onClick={() => handleToggleActive(announcement)}
                    className="ml-auto"
                  >
                    {announcement.is_active ? (
                      <ToggleRight className="w-8 h-8 text-orange-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-600" />
                    )}
                  </button>
                </div>
                <p className="text-gray-400 leading-relaxed mb-4">{announcement.message}</p>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>Created: {new Date(announcement.created_at).toLocaleDateString()}</span>
                  <span className={`px-3 py-1 rounded-full font-bold ${
                    announcement.is_active 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    {announcement.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(announcement)}
                  className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="bg-zinc-900 rounded-[2rem] border border-white/10 p-12 text-center">
            <Megaphone className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No announcements yet. Create your first one!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 rounded-[2rem] shadow-xl w-full max-w-2xl overflow-hidden border border-white/10"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-black text-white uppercase">
                  {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                </h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Title</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="e.g. New Class Schedule"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Message</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                    placeholder="Enter announcement details..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 rounded border-white/10 bg-black/50 text-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                  <label htmlFor="isActive" className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    Display on homepage
                  </label>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 rounded-full border border-white/10 text-white font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-full bg-orange-500 text-black font-black uppercase tracking-wider hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                  >
                    {editingAnnouncement ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
