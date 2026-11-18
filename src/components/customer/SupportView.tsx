import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HelpCircle, Send, MessageSquare, ShieldCheck, Clock } from 'lucide-react';

export const SupportView: React.FC = () => {
  const { supportTickets, submitSupportTicket, replySupportTicket, currentUser } = useApp();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const userTickets = supportTickets.filter(t => t.userId === (currentUser?.id || 'cust-1'));

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    submitSupportTicket(subject, message);
    setSubject('');
    setMessage('');
    alert('Support ticket submitted successfully. Our team will respond shortly.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Customer Support & Dispute Resolution</h1>
        <p className="text-xs text-zinc-500 mt-1">Need help with an order, missing food, or payment refund? Submit a ticket below.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Ticket Submission Form */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">Create Support Ticket</h3>
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600">Subject / Issue</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Missing drink from order FD-2026-000101"
                required
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2.5 text-xs text-zinc-800 dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600">Detailed Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Please describe your issue in detail..."
                rows={4}
                required
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl p-3 text-xs text-zinc-800 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Submit Support Ticket
            </button>
          </form>
        </div>

        {/* Tickets History */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">Your Support History</h3>
          {userTickets.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
              No support tickets found.
            </div>
          ) : (
            userTickets.map(t => (
              <div key={t.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-zinc-900 dark:text-white">{t.subject}</span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${t.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {t.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">{t.message}</p>

                {t.replies.length > 0 && (
                  <div className="pl-4 border-l-2 border-orange-500 space-y-2 pt-2">
                    {t.replies.map((r, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-bold text-orange-600">{r.senderName}: </span>
                        <span className="text-zinc-700 dark:text-zinc-300">{r.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
