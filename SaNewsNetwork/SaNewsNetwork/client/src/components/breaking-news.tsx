export default function BreakingNews() {
  const breakingNews = [
    "Major economic reforms announced by the government",
    "Technology sector shows significant growth", 
    "Sports championship results declared",
    "Weather updates for the region"
  ];

  return (
    <div className="bg-secondary text-white py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <span className="bg-white text-secondary px-3 py-1 rounded text-sm font-bold mr-4 flex-shrink-0">
            BREAKING
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="font-medium">
                {breakingNews.join(' • ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
