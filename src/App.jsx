import { useState } from "react";
import AddMemberForm from "./components/AddMemberForm";
import MemberList from "./components/MemberList";
import AddRelationshipForm from "./components/AddRelationshipForm"; // Import the new component

function App() {
  const [refreshMembersTrigger, setRefreshMembersTrigger] = useState(0); // State to trigger MemberList refresh

  const handleMemberAdded = () => {
    setRefreshMembersTrigger((prev) => prev + 1); // Increment to trigger refresh
  };

  const handleRelationshipAdded = () => {
    // You might want to trigger a refresh of a relationship list here later
    // For now, we just acknowledge it.
    console.log(
      "Relationship added. Consider refreshing relationship list if displayed."
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
          Welcome to Fambul Tik!
        </h1>
        <p className="mt-3 text-xl text-gray-600">
          Your digital family tree manager.
        </p>
      </header>

      <main className="container mx-auto px-4 space-y-8">
        <section>
          <AddMemberForm onMemberAdded={handleMemberAdded} />
        </section>

        <section>
          <AddRelationshipForm onRelationshipAdded={handleRelationshipAdded} />{" "}
          {/* Render the new form */}
        </section>

        <section>
          <MemberList key={refreshMembersTrigger} />{" "}
          {/* Use key to force remount/re-fetch */}
        </section>
      </main>
    </div>
  );
}

export default App;
