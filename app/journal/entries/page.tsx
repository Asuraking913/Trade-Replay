import EntriesView from "@/components/Journal/EntriesView";
import Protected from "@/components/shared/Protected";

export default function JournalEntriesPage() {
  return (
    <Protected>
      <EntriesView />
    </Protected>
  );
}
