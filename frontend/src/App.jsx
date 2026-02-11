import { useAuth } from "./auth/useAuth";
import Dashboard from "./pages/Dashboard";
import Loading from "./pages/Loading";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <div>Auth failed</div>;

  return <Dashboard user={user} />;
}

export default App;
