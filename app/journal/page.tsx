import Journal from "@/components/Journal";
import Protected from "@/components/shared/Protected";

export default function JournalPage() {
  return (
    <Protected>
      <Journal />
    </Protected>
  );
}
