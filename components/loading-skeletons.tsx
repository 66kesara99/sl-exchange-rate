import LoadingSpinner from "./loading-spinner";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function LoadingSkeletons() {
  return (
    <div className="flex flex-col gap-4">
      <LoadingSpinner
        size="lg"
        text="Crawling Sampath Bank Exchange Rates..."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-7 w-24" />
              </div>

              <div className="space-y-1">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
