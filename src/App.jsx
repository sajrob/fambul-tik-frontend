// src/App.jsx

import { useState } from "react";
import AddMemberForm from "./components/AddMemberForm";
import MemberList from "./components/MemberList";
import AddRelationshipForm from "./components/AddRelationshipForm";
import RelationshipList from "./components/RelationshipList";

function App() {
  const [refreshMembersTrigger, setRefreshMembersTrigger] = useState(0);
  const [refreshRelationshipsTrigger, setRefreshRelationshipsTrigger] =
    useState(0);

  const handleMemberAdded = () => {
    setRefreshMembersTrigger((prev) => prev + 1);
  };

  const handleRelationshipAdded = () => {
    setRefreshRelationshipsTrigger((prev) => prev + 1); // Trigger for Add
  };

  // New handler for relationship deletion
  const handleRelationshipDeleted = () => {
    setRefreshRelationshipsTrigger((prev) => prev + 1); // Trigger for Delete
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
          <AddRelationshipForm onRelationshipAdded={handleRelationshipAdded} />
        </section>

        <section>
          <MemberList key={refreshMembersTrigger} />
        </section>

        <section>
          <RelationshipList
            key={refreshRelationshipsTrigger} // Key to force refresh
            onRelationshipDeleted={handleRelationshipDeleted} // Pass the new handler
          />
        </section>
      </main>
    </div>
  );
}

export default App;
