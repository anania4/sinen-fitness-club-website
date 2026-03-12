import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, ArrowLeft, CheckCircle2, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';

export default function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    telegram: '',
    preferred_time: 'morning',
    goal: 'weight-loss'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/leads/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          goal: formData.goal,
          preferred_time: formData.preferred_time,
          status: 'pending'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      alert('Booking successful! See you at the gym.');
      navigate('/');
    } catch (err) {
      setError('Failed to submit booking. Please try again or call us directly.');
      console.error('Booking error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500 selection:text-black py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Home</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 rounded-[3rem] border border-orange-500/20 p-8 md:p-12 shadow-2xl"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
              <img src="/images/sinen_logo.png" alt="Sinen Fitness Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">Book Your Visit</h1>
            <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Start your journey at Sinen Fitness</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                <p className="text-red-500 text-sm font-bold">{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-4">Full Name</label>
                <input 
                  required 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Abebe Bikila" 
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-4">Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0911..." 
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-colors" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-4">Telegram Username (Optional)</label>
              <input 
                type="text" 
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                placeholder="@username" 
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-colors" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-4">Preferred Time</label>
                <select 
                  required 
                  name="preferred_time"
                  value={formData.preferred_time}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-colors appearance-none"
                >
                  <option value="morning">Morning Session</option>
                  <option value="evening">Evening Session</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-4">Your Goal</label>
                <select 
                  required 
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-colors appearance-none"
                >
                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="general-fitness">General Fitness</option>
                </select>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 p-8 rounded-3xl space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="text-black" size={18} />
                </div>
                <div>
                  <p className="text-lg font-black uppercase italic text-orange-500">Registration Fee: 200 ETB</p>
                  <p className="text-sm text-gray-400 mt-1">Payable on your first visit.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Award className="text-black" size={18} />
                </div>
                <div>
                  <p className="text-lg font-black uppercase italic text-white">Registration Day Requirements:</p>
                  <ul className="text-sm text-gray-400 mt-2 list-disc ml-4 space-y-2">
                    <li>One passport-sized photo</li>
                    <li>A copy of your ID card</li>
                  </ul>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-black py-6 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Book a Visit'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
