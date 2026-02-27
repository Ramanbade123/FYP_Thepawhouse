import { MessageSquare } from 'lucide-react';

const AdopterMessagesTab = () => (
  <div>
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#063630]">Messages</h2>
      <p className="text-gray-500 mt-1">Chat with rehomers about the dogs you're interested in.</p>
    </div>
    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
      <div className="w-16 h-16 bg-[#008737]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <MessageSquare className="h-8 w-8 text-[#008737]" />
      </div>
      <h3 className="text-lg font-bold text-[#063630] mb-2">No messages yet</h3>
      <p className="text-gray-500 text-sm">When you apply to adopt a dog, you'll be able to message the rehomer here.</p>
    </div>
  </div>
);

export default AdopterMessagesTab;
