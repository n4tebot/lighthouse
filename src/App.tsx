import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Groups } from './pages/Groups';
import { GroupDetail } from './pages/GroupDetail';
import { Prayer } from './pages/Prayer';
import { Profile } from './pages/Profile';
import { Onboarding } from './pages/Onboarding';
import { getCurrentUser, seedDemoData } from './lib/storage';

// Seed demo data on first load
seedDemoData();

function App() {
  const [authed, setAuthed] = useState<boolean>(() => !!getCurrentUser());

  useEffect(() => {
    setAuthed(!!getCurrentUser());
  }, []);

  if (!authed) {
    return <Onboarding onComplete={() => setAuthed(true)} />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/prayer" element={<Prayer />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
