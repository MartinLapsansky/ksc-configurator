import React from "react";

type PickerSectionProps = {
  children: React.ReactNode;
};

/**
 * Shared card shell for all configurator pickers. Keeps picker markup
 * consistent without duplicating the section classes across pickers.
 */
const PickerSection: React.FC<PickerSectionProps> = ({ children }) => {
  return (
    <section className="mb-4 min-w-[50vw] rounded-md border border-gray-200 bg-white p-3 shadow-sm md:min-w-0 md:w-full">
      {children}
    </section>
  );
};

export default PickerSection;