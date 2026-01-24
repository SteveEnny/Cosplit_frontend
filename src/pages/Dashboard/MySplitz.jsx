import { ChevronDown } from "lucide-react";
import screen from "../../assets/screen.svg";
import { useNavigate } from "react-router-dom"; 

function MySplitz() {
  const navigation = useNavigate();


  const goCreateSplitz = () => {
  navigation("/dashboard/create-splitz");
};


  return (
    <div className="w-full px-4 py-3 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Analytics
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track your savings and activity
          </p>
        </div>

        <button className="flex items-center gap-1 px-3 sm:px-4 py-2 border border-gray-300 text-black text-xs sm:text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
          This month
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center mt-6">
        <div className="w-full max-w-xl flex flex-col items-center text-center px-2 sm:px-4 md:px-6 lg:px-10">
          
          {/* Illustration */}
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <img
              src={screen}
              alt="analytics screen"
              className="w-full h-auto max-h-48 sm:max-h-56 md:max-h-64 object-contain"
            />
          </div>

          {/* Text */}
          <div className="space-y-4 w-full max-w-md mt-4">
            <div className="space-y-2">
              <h1 className="font-bold text-lg sm:text-xl text-[#67707E]">
                Your analytics will appear here
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-[#A3A9B2] px-2">
                Join or create a split to start tracking your savings and activity.
              </p>
            </div>

            {/* Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-3 mt-4">
              <button onClick={goCreateSplitz} className="w-full bg-[#1F8225] text-white px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base hover:bg-green-700 transition-colors active:scale-[0.98]">
                Create a splitz
              </button>

              <button className="w-full bg-white text-green-700 border border-green-600 px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base hover:bg-green-50 transition-colors active:scale-[0.98]">
                Join Splitz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MySplitz;
