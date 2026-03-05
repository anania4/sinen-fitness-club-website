import React, { useEffect, useState } from 'react';
import { Check, Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface Plan {
  id: number;
  name: string;
  price: number;
  duration: string;
  features: string;
}

export const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({ name: '', price: 0, duration: 'Monthly', features: '' });

  const fetchPlans = () => {
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => {
        setPlans(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingPlan ? `/api/plans/${editingPlan.id}` : '/api/plans';
    const method = editingPlan ? 'PATCH' : 'POST';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setEditingPlan(null);
        setFormData({ name: '', price: 0, duration: 'Monthly', features: '' });
        fetchPlans();
      }
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const deletePlan = async (id: number) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      const res = await fetch(`/api/plans/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({ name: plan.name, price: plan.price, duration: plan.duration, features: plan.features });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingPlan(null);
    setFormData({ name: '', price: 0, duration: 'Monthly', features: '' });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Membership Plans</h2>
          <p className="text-slate-500">Configure and manage your gym's subscription offerings.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          Create New Plan
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Plan Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="e.g. Monthly Basic"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Price ($)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Duration</label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    >
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Annual</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Features (comma separated)</label>
                  <textarea
                    required
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all h-24 resize-none"
                    placeholder="Gym Access, Locker Room, Classes..."
                  />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                  >
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="p-8 border-b border-slate-50">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase rounded-lg tracking-wider">
                  {plan.duration}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openEdit(plan)}
                    className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deletePlan(plan.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">${plan.price}</span>
                <span className="text-slate-400 text-sm">/{plan.duration.toLowerCase()}</span>
              </div>
            </div>
            
            <div className="p-8 flex-1 bg-slate-50/30">
              <ul className="space-y-4">
                {plan.features.split(',').map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-orange-600" />
                    </div>
                    {feature.trim()}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 bg-white border-t border-slate-50">
              <button 
                onClick={() => navigate(`/members?plan=${encodeURIComponent(plan.name)}`)}
                className="w-full py-3 rounded-2xl border border-orange-500 text-orange-600 font-bold text-sm hover:bg-orange-500 hover:text-white transition-all"
              >
                View Subscribers
              </button>
            </div>
          </div>
        ))}
        
        {plans.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No plans configured yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
