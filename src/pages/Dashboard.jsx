import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Welcome {user?.fullName}</h2>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
