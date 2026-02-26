import ListedDogs from '../ListedDogs';
import EditDogForm from '../EditDogForm';

// My Dogs tab = full ListedDogs component (already has all CRUD)
const MyDogsTab = () => (
  <div>
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#063630]">My Dogs</h2>
      <p className="text-gray-500 mt-1">Manage all your dog listings, track approvals and applications.</p>
    </div>
    <ListedDogs />
  </div>
);

export default MyDogsTab;