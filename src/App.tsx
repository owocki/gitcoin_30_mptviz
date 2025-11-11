import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CreatePage } from './pages/CreatePage';
import { StackedPage } from './pages/StackedPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/stacked" element={<StackedPage />} />
    </Routes>
  );
}

export default App;
