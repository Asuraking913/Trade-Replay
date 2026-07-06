import Dashboard from "@/components/Dashboard";
import Protected from "@/components/shared/Protected";

export default function DashboardPage() {
  return (
    <Protected>
      <Dashboard />
    </Protected>
  );
}
