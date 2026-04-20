// components/ProgressBar.jsx
const ProgressBar = ({ step }) => {
  const steps = ["Personal", "Academic", "Program", "Documents"];

  return (
    <div className="flex gap-4">
      {steps.map((label, index) => (
        <div key={index} className="flex-1">
          <div
            className={`h-2 rounded ${
              step > index ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
          <p className="text-sm mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;