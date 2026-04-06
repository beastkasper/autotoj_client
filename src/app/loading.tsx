import { LoadingState } from "@/components/states/LoadingState";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-8">
      <div className="max-w-[1440px] mx-auto lg:px-6 lg:py-6 pt-8">
        <LoadingState />
      </div>
    </div>
  );
}
