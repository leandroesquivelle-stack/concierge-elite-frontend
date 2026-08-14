import { Outlet } from 'react-router-dom';
import PublicNav from './PublicNav';
import Footer from './Footer';
import AgentChatBubble from './AgentChatBubble';

export default function PublicLayout({ user }) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav user={user} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AgentChatBubble />
    </div>
  );
}