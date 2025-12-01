const SkeletonCard = () => {
  return (
    <div className="animate-pulse">
      <div className="relative overflow-hidden rounded-xl bg-dark-lighter">
        <div className="w-full h-[240px] bg-dark-light"></div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-dark-lighter rounded w-3/4"></div>
        <div className="h-3 bg-dark-lighter rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
