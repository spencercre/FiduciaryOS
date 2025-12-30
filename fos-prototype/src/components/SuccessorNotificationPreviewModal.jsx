import React, { useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';

export function SuccessorNotificationPreviewModal({ kind, onClose }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const previews = {
    '7day': {
      title: '7-Day Reminder (Email Only)',
      subject: 'FOS: Fiduciary Heartbeat Reminder - 7 Days Remaining',
      body: `Dear Larry,

This is a gentle reminder that your Fiduciary Operating System heartbeat has not been detected in 23 days.

Your successor protocol will automatically activate in 7 days if no login is detected.

To reset the countdown, simply log in to your FOS dashboard:
https://app.fiduciary-os.com

If you are traveling or temporarily unavailable, you may also verify via the FOS mobile app.

This is an automated message from your Digital Successor Protocol.

- Fiduciary Operating System`,
      channels: ['📧 Email']
    },
    '3day': {
      title: '3-Day Warning (Email + SMS)',
      subject: 'IMPORTANT: FOS Successor Protocol - 72 Hours Remaining',
      body: `IMPORTANT: Fiduciary Operating System Alert

Larry, your successor protocol will activate in 72 HOURS.

We have not detected a login in 27 days. If you are able, please log in immediately to reset the countdown:
https://app.fiduciary-os.com

If you do not log in by [DATE], the Master Encryption Key will be transmitted to your designated Successor Trustee:
• Sarah Jenkins (sarah@jenkinslaw.com)

If you are incapacitated and this message reaches someone who can assist, please contact our emergency line.

- Fiduciary Operating System`,
      smsBody: 'FOS ALERT: Your successor protocol activates in 72 hours. Log in now to reset: https://app.fiduciary-os.com',
      channels: ['📧 Email', '📱 SMS']
    },
    'dayof': {
      title: 'Day-Of Alert (Email + SMS - CRITICAL)',
      subject: 'CRITICAL: FOS Successor Protocol Activates TODAY',
      body: `🚨 CRITICAL ALERT 🚨

Larry, your FOS Successor Protocol will activate within HOURS.

This is your final warning. If you are able to log in, please do so IMMEDIATELY:
https://app.fiduciary-os.com

Once activated, the following will occur:
1. Master Encryption Key transmitted to Sarah Jenkins
2. All trust access credentials released to successor
3. Emergency contacts notified

This action is IRREVERSIBLE once initiated.

If you need emergency assistance, call: (800) 555-0199

- Fiduciary Operating System`,
      smsBody: '🚨 FOS CRITICAL: Successor protocol activates TODAY. Log in NOW to prevent: https://app.fiduciary-os.com',
      channels: ['📧 Email', '📱 SMS']
    }
  };

  const preview = previews[kind];
  if (!preview) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className={`p-4 border-b flex justify-between items-center ${
          kind === 'dayof' ? 'bg-red-600 text-white' :
          kind === '3day' ? 'bg-orange-500 text-white' :
          'bg-stone-100 text-stone-800'
        }`}>
          <div>
            <h2 className="font-serif font-bold text-lg">{preview.title}</h2>
            <div className="flex gap-2 mt-1">
              {preview.channels.map((ch, i) => (
                <span key={i} className={`text-xs px-2 py-0.5 rounded ${
                  kind === 'dayof' ? 'bg-red-700' :
                  kind === '3day' ? 'bg-orange-600' :
                  'bg-stone-200 text-stone-600'
                }`}>{ch}</span>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:opacity-70"><X size={24}/></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-4">
            <p className="text-xs text-stone-500 uppercase font-bold mb-1">Email Subject</p>
            <p className="font-mono text-sm bg-stone-50 p-2 rounded border">{preview.subject}</p>
          </div>
          <div className="mb-4">
            <p className="text-xs text-stone-500 uppercase font-bold mb-1">Email Body</p>
            <pre className="font-serif text-sm bg-stone-50 p-4 rounded border whitespace-pre-wrap leading-relaxed">{preview.body}</pre>
          </div>
          {preview.smsBody && (
            <div>
              <p className="text-xs text-stone-500 uppercase font-bold mb-1">SMS Message</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center"><MessageSquare size={16} className="text-white"/></div>
                  <div className="flex-1">
                    <p className="text-xs text-green-700 font-bold">FOS Alert System</p>
                    <p className="text-sm text-stone-800 mt-1">{preview.smsBody}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-stone-50 border-t flex justify-between items-center">
          <p className="text-xs text-stone-400">SMOKE & MIRRORS: Preview only - no actual notifications sent</p>
          <button onClick={onClose} className="px-4 py-2 bg-stone-800 text-white rounded font-bold text-sm">Close Preview</button>
        </div>
      </div>
    </div>
  );
}
