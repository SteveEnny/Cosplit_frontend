// pages/SplitDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  MapPin,
  DollarSign,
  UserPlus,
  ChevronLeft,
} from "lucide-react";


const SplitDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isJoining, setIsJoining] = useState(false);
  const [currentUserId] = useState(1);

  useEffect(() => {
    fetchSplitDetails();
  }, [id]);

  const fetchSplitDetails = async () => {
    if (!id) return;

    try {
      const splitId = parseInt(id);
      const data = await splitService.getSplitDetails(splitId);
      const participants = await splitService.getSplitParticipants(splitId);

      setCurrentSplit({
        ...data,
        participants: participants || [],
      });
    } catch (error) {
      console.error("Error fetching split details:", error);
    }
  };

  const handleJoinSplit = async () => {
    if (!id || !currentUserId) return;

    try {
      setIsJoining(true);
      await splitService.joinSplit(parseInt(id), currentUserId);

      const newParticipant = {
        id: Date.now(),
        user: currentUserId,
        username: "Current User",
        email: "user@example.com",
        joined_at: new Date().toISOString(),
      };

      addParticipant(parseInt(id), newParticipant);
      alert("Successfully joined the split!");
    } catch (error) {
      console.error("Error joining split:", error);
      alert("Failed to join split. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (!currentSplit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading split details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ChevronLeft size={20} />
            Back
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Split Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {currentSplit.image_url && (
            <div className="h-48 overflow-hidden">
              <img
                src={currentSplit.image_url}
                alt={currentSplit.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentSplit.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    {currentSplit.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(currentSplit.start_date).toLocaleDateString()} -
                    {new Date(currentSplit.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleJoinSplit}
                disabled={isJoining}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-70"
              >
                <UserPlus size={20} />
                {isJoining ? "Joining..." : "Join Split"}
              </button>
            </div>

            {/* Split Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <DollarSign size={20} className="text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold text-gray-900">
                    ₦{currentSplit.amount?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Users size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Participants</p>
                  <p className="font-semibold text-gray-900">
                    {currentSplit.participants?.length || 0}/
                    {currentSplit.max_participants}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <MapPin size={20} className="text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">
                    {currentSplit.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Calendar size={20} className="text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Split Method</p>
                  <p className="font-semibold text-gray-900">
                    {currentSplit.split_method}
                  </p>
                </div>
              </div>
            </div>

            {currentSplit.rules && (
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <h3 className="font-semibold text-yellow-800 mb-2">Rules</h3>
                <p className="text-yellow-700">{currentSplit.rules}</p>
              </div>
            )}
          </div>
        </div>

        {/* Participants Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={24} />
            Participants ({currentSplit.participants?.length || 0})
          </h2>

          {currentSplit.participants && currentSplit.participants.length > 0 ? (
            <div className="space-y-4">
              {currentSplit.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-green-800">
                        {participant.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {participant.username}
                      </p>
                      <p className="text-sm text-gray-600">
                        {participant.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Joined{" "}
                    {new Date(participant.joined_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No participants yet</p>
              <p className="text-sm">Be the first to join this split!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SplitDetailPage;
