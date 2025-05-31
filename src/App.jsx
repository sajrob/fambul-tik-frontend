import AddMemberForm from "./components/AddMemberForm";
import MemberList from "./components/MemberList";

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      {/* Add a little spacing between components if needed */}
      <div className="mb-8">
        <AddMemberForm />
      </div>
      <div>
        <MemberList />
      </div>
    </div>
  );
}

export default App;
