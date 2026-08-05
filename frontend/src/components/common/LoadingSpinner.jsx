export default function LoadingSpinner({ size = "md", text = "" }) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div
        className={`${sizeClasses[size]} border-3 border-forest-100 border-t-forest rounded-full animate-spin`}
      />
      {text && <p className="text-text-secondary text-sm">{text}</p>}
    </div>
  );
}
