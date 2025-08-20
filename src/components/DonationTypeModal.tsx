import React from "react";
import { CareHome } from "../Types/types";

interface DonationTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  careHome: CareHome | null;
  onSelectDonationType: (type: "meal" | "drygood") => void;
}

const DonationTypeModal: React.FC<DonationTypeModalProps> = ({
  isOpen,
  onClose,
  careHome,
  onSelectDonationType,
}) => {
  if (!isOpen || !careHome) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold text-[#63C6F7] mb-4">
          Select Donation Type for {careHome.name}
        </h2>
        
        <div className="space-y-4 mb-6">
          <div 
            className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#63C6F7] hover:bg-[#63C6F7]/5 transition-all"
            onClick={() => onSelectDonationType("meal")}
          >
            <h3 className="font-semibold text-[#63C6F7] mb-2">Meal Donation</h3>
            <p className="text-sm text-gray-600">
              Donate meals by booking available time slots for breakfast, lunch, or dinner
            </p>
          </div>

          <div 
            className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#85C536] hover:bg-[#85C536]/5 transition-all"
            onClick={() => onSelectDonationType("drygood")}
          >
            <h3 className="font-semibold text-[#85C536] mb-2">Dry Good Donation</h3>
            <p className="text-sm text-gray-600">
              Donate essential items and supplies that the care home needs
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DonationTypeModal;