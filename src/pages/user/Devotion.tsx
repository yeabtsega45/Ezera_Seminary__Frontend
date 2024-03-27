// import { useState } from "react";
import DevotionDisplay from "@/features/devotions/DevotionDisplay";
import { useGetDevotionsQuery } from "@/redux/api-slices/apiSlice";
// import { Devotion as DevotionType } from "@/redux/types"; // Import the Devotion type

const Devotion = () => {
  // Explicitly type the useState hook to use Devotion | null
  // const [selectedDevotion, setSelectedDevotion] = useState<DevotionType | null>(
  //   null
  // );

  // Use the useGetDevotionsQuery hook to fetch devotions
  // Assuming the hook does not require an argument, remove `undefined`
  const { data: devotions, error, isLoading } = useGetDevotionsQuery();

  if (isLoading) return "Loading...";
  if (error) return `Error: ${(error as Error).message}`;

  return (
    <div className="absolute top-0">
      <div className="devotion-img bg-cover  w-full py-14  md:py-20 lg:py-28  flex  justify-center items-center pointer-events-none">
        <div className=" z-10 text-primary-1 align-middle font-bold text-center">
          <div className=" text-2xl md:text-5xl">
            Daily <span className="text-accent-6">Devotional</span>
          </div>

          <div className="text-lg md:text-3xl tracking-widest text-accent-6">
            <span className="text-primary-1">የዕለቱ</span> ጥቅስ
          </div>
        </div>
      </div>

      <div className=" flex h-full  pt-12  mx-auto">
        <DevotionDisplay
          devotions={devotions}
          // selectedDevotion={selectedDevotion}
          // setSelectedDevotion={setSelectedDevotion}
          showControls={false}
          toggleForm={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
};

export default Devotion;
