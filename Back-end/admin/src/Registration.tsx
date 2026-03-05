import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, ArrowLeft, CheckCircle2, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Registration() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/20">
              <Dumbbell className="text-black w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">Book Your Visit</h1>
            <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Start your journey at Sinen Fitness</p>
          </div>

          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); alert('Booking successful! See you at the gym.'); navigate('/'); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-4">Full Name</label>
                <input required type="text" placeholder="Abebe Bikila" className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-4">Phone Number</label>
                <input required type="tel" placeholder="0911..." className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-4">Telegram Username (Optional)</label>
              <input type="text" placeholder="@username" className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-colors" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-4">Preferred Time</label>
                <select required className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-colors appearance-none">
                  <option value="morning">Morning Session</option>
                  <option value="evening">Evening Session</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-4">Your Goal</label>
                <select required className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-colors appearance-none">
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
              className="w-full bg-orange-500 text-black py-6 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-500/20"
            >
              Book a Visit
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
