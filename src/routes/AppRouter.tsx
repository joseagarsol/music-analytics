import { useAuth } from '../context/AuthContext';
import { Route, Redirect, Switch } from 'wouter';
import Login from '../pages/Login';
import UserProfile from '../pages/UserProfile';
import NotFound from '../pages/NotFound';
import TopTracks from '../pages/TopTracks';
import Dashboard from '../pages/dashboard/Dashboard';

export default function AppRouter() {
  const auth = useAuth();

  return (
    <Switch>
      <Route path="/">
        {auth.isAuthenticated ? <Redirect to="/profile" /> : <Login />}
      </Route>
      <Route path="/profile">
        {auth.isAuthenticated ? <UserProfile /> : <Redirect to="/" />}
      </Route>
      <Route path="/top-tracks">
        {auth.isAuthenticated ? <TopTracks /> : <Redirect to="/" />}
      </Route>
      <Route path="/dashboard">
        {auth.isAuthenticated ? <Dashboard /> : <Redirect to="/" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}
