import React from 'react';
import { Youtube, Facebook, Twitter, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { CONTACT_EMAIL, FACEBOOK_URL, LINKEDIN_URL, WHATSAPP_URL, X_URL, YOUTUBE_URL } from '../../data/siteConfig';

// Social buttons: coloured (never black), with text labels for screen readers and tooltips.
const ITEMS = [
  { label: 'YouTube', href: YOUTUBE_URL, Icon: Youtube, color: 'bg-red-600 hover:bg-red-700' },
  { label: 'Facebook', href: FACEBOOK_URL, Icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700' },
  { label: 'X (Twitter)', href: X_URL, Icon: Twitter, color: 'bg-indigo-600 hover:bg-indigo-700' },
  { label: 'LinkedIn', href: LINKEDIN_URL, Icon: Linkedin, color: 'bg-blue-700 hover:bg-blue-800' },
  { label: 'WhatsApp', href: WHATSAPP_URL, Icon: MessageCircle, color: 'bg-green-600 hover:bg-green-700' },
  { label: 'E-mail', href: `mailto:${CONTACT_EMAIL}`, Icon: Mail, color: 'bg-teal-600 hover:bg-teal-700' },
];

export const SocialButtons: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => (
  <ul className="flex flex-wrap items-center gap-2.5" aria-label="JR Learners on social media">
    {ITEMS.map(({ label, href, Icon, color }) => {
      const external = href.startsWith('http');
      return (
        <li key={label}>
          <a
            href={href}
            title={label}
            aria-label={label}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`${color} ${size === 'sm' ? 'w-9 h-9' : 'w-11 h-11'} rounded-xl flex items-center justify-center shadow-md transition-all hover:-translate-y-0.5`}
          >
            <Icon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
          </a>
        </li>
      );
    })}
  </ul>
);

export default SocialButtons;
