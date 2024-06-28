import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { useGetCourseByIdQuery, DndElement } from "../../../services/api";
import "@/index.css";
import {
  ArrowLeft,
  CheckCircle,
  DotsThreeVertical,
  X,
  XCircle,
  CheckFat,
  Lock,
  CornersOut,
  YoutubeLogo,
} from "@phosphor-icons/react";
import logo from "../../../assets/ezra-logo.svg";
import AccordionItemDisplay from "../Elements/AccordionItemDisplay";
import { useDispatch, useSelector } from "react-redux";
import { setProgress } from "@/redux/authSlice";
import { RootState } from "@/redux/store";
import axios from "axios";
import { PuffLoader } from "react-spinners";
import LoadingPage from "@/pages/user/LoadingPage";
import { toast, ToastContainer } from "react-toastify";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ReactCardFlip from "react-card-flip";
import Slider from "@mui/material/Slider";
import { sliderMarks } from "@/utils/SliderMarks";
import {
  DndContext,
  PointerSensor,
  useSensors,
  useSensor,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import DraggableItem from "../Elements/dragAndDrop/DraggableItem";
import DroppableArea from "../Elements/dragAndDrop/DroppableArea";
// import ChapterNotFound from "@/components/ChapterNotFound";

interface FlipState {
  [index: number]: boolean;
}

function SlidesDisplay() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  //radio input switch
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  //show quiz result
  const [showQuizResult, setShowQuizResult] = useState(false);

  const [progressLoading, setProgressLoading] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);

  // Flip state
  const [flip, setFlip] = useState<FlipState>({});
  // Slider state
  const [sliderValue, setSliderValue] = useState(2.5);

  // Define State for Each Condition of Next button
  const [isSlideComplete, setIsSlideComplete] = useState<boolean>(false);
  const [isQuizAnswered, setIsQuizAnswered] = useState<boolean>(false);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [isRevealFlipped, setIsRevealFlipped] = useState<boolean>(false);
  const [isSequenceCompleted, setIsSequenceCompleted] =
    useState<boolean>(false);
  const [isRangeChanged, setIsRangeChanged] = useState<boolean>(false);
  const [isDndCompleted, setIsDndCompleted] = useState<boolean>(false);
  const [isAudioPlayed, setIsAudioPlayed] = useState<boolean>(false);
  const [isVideoClicked, setIsVideoClicked] = useState<boolean>(false);

  const { courseId, chapterId } = useParams<{
    courseId: string;
    chapterId: string;
  }>();

  //get single course
  const {
    data: courseData,
    error,
    isLoading,
  } = useGetCourseByIdQuery(courseId as string);
  console.log(courseData);

  // Extracting chapter data from the fetched course data
  const chapter = courseData?.chapters.find((chap) => chap._id === chapterId);
  const chapterIndex = courseData?.chapters.findIndex(
    (chap) => chap._id === chapterId
  );

  //get the current user from the Root State
  const currentUser = useSelector((state: RootState) => state.auth.user);

  //find matching courseId from the user progress array
  const userProgress = currentUser?.progress?.find(
    (p) => p.courseId === courseId
  );

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [unlockedIndex, setUnlockedIndex] = useState<number>(0); // New state variable to track the unlocked index

  //Resume chapter
  // When component did mount or userProgress has changed, update the activeIndex
  useEffect(() => {
    console.log("Current chapter index:", chapterIndex);
    console.log("User progress:", userProgress);
    if (userProgress) {
      if (
        chapterIndex === userProgress.currentChapter &&
        userProgress.currentSlide !== undefined
      ) {
        // The current selected chapter is the same as the chapterIndex from progress
        setActiveIndex(userProgress.currentSlide);
        if (userProgress.currentSlide > unlockedIndex) {
          setUnlockedIndex(userProgress.currentSlide);
        }
      } else {
        //set the activeIndex to the beginning of the current chapter
        setActiveIndex(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterIndex]);

  {
    /* Function to open the chapters sidebar modal */
  }
  const handleArrowClick = () => {
    setOpen((prev) => !prev);
  };

  {
    /* Ref to listen the curser and close the chapters sidebar modal */
  }
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, open, () => setOpen(false));

  //Quiz Related functions
  //track whether the selected answer is correct or not.
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isDndAnswerCorrect, setIsDndAnswerCorrect] = useState<boolean | null>(
    null
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  // dropped choice
  const [droppedChoice, setDroppedChoice] = useState<string | null>(null);
  // Define Drag & Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // If the chapter is not found, handle accordingly
  if (!chapter) {
    // return <ChapterNotFound />;
    return <LoadingPage />;
  }
  // Setting the data to slides if the chapter is found
  const data = chapter.slides;
  // Selected Slide
  const selectedSlide = data[activeIndex];

  //function to select chapter buttons
  const updateIndex = (newIndex: number) => {
    // First adjust the new index if it's out of bounds
    const adjustedIndex = Math.max(0, Math.min(newIndex, data.length - 1));
    // Use a functional update to ensure we're using the latest state
    setUnlockedIndex((prevUnlockedIndex) => {
      // Only update if the new index is greater than the previous unlocked index
      if (adjustedIndex > prevUnlockedIndex) {
        return adjustedIndex;
      } else {
        return prevUnlockedIndex;
      }
    });
    setActiveIndex(adjustedIndex);
    setShowQuizResult(false); // Reset the showQuizResult state
    updateProgress();
  };

  // slide number
  const currentSlideNumber = activeIndex + 1;
  const totalDataNumber = data.length;

  const isLastSlide = activeIndex === totalDataNumber - 1;

  const isSlideUnlocked = (index: number) => {
    return index <= unlockedIndex; // Check if the slide is unlocked based on the unlocked index
  };

  //Quiz Related functions
  const handleRadioChange = (
    choiceIndex: number,
    choiceValue: string,
    elementCorrectAnswer: string
  ) => {
    setSelectedChoice(choiceIndex);
    //logic to determine whether the selected answer is correct.
    setIsAnswerCorrect(choiceValue === elementCorrectAnswer);
    setShowQuizResult(false); // Reset showResult when a new answer is selected
  };

  // For "dnd" type
  const handleCheckAnswer = () => {
    if (selectedSlide?.elements?.some((element) => element.type === "dnd")) {
      // Get the "dnd" element
      const dndElement = selectedSlide.elements.find(
        (element): element is DndElement => element.type === "dnd"
      );
      if (dndElement && droppedChoice) {
        // Assume that correctDndAnswer is the property that holds the correct answer for dndElement.
        const isDndCorrect =
          droppedChoice === dndElement.value.correctDndAnswer;
        setIsDndAnswerCorrect(isDndCorrect);
      }
    }

    setShowQuizResult(true);
    setIsDndCompleted(true); // Next button available when the check answer is confirmed
  };

  //isCorrect switch
  const renderQuizResult = () => {
    if (!showQuizResult || isAnswerCorrect === null) return null; // Don't show feedback before a choice has been made

    if (isAnswerCorrect) {
      return (
        <CheckFat size={40} weight="fill" className="text-green-700 pl-1" />
      );
    } else {
      return <XCircle size={40} weight="fill" className="text-red-700 pl-1" />;
    }
  };

  // Render dnd result
  const renderDndResult = () => {
    if (isDndAnswerCorrect === true) {
      return (
        <CheckFat size={40} weight="fill" className="text-green-700 pl-1" />
      );
    } else if (isDndAnswerCorrect === false) {
      return <XCircle size={40} weight="fill" className="text-red-700 pl-1" />;
    }

    return null;
  };

  // Check if courseData and courseData._id are not undefined
  const courseID = courseData && courseData._id ? courseData._id : "";

  const updateProgress = () => {
    if (chapterIndex !== undefined && chapterIndex !== -1) {
      dispatch(
        setProgress({
          courseId: courseID,
          currentChapter: chapterIndex,
          currentSlide: activeIndex,
        })
      );
    }
  };

  const token = localStorage.getItem("token");
  const userId = currentUser?._id;

  const submitProgress = () => {
    if (currentUser && currentUser.progress) {
      setTimeout(() => {
        setProgressLoading(true);
      }, 3000);
      console.log("CurrentUser Token:", token);
      axios
        .put(
          "/users/profile/" + userId,
          {
            userId: currentUser._id,
            progress: currentUser.progress,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("Progress updated successfully:", res.data);
          setProgressLoading(false);
          navigate(`/courses/get/${courseId}`);
        })
        .catch((err) => {
          console.error(
            "Error updating progress:",
            err.response ? err.response.data : err.message
          );
          toast.error(
            "Could not update progress: " +
              (err.response ? err.response.data : err.message)
          );
          setTimeout(() => {
            setProgressLoading(false);
            navigate(`/courses/get/${courseId}`);
          }, 3000);
        });
    } else {
      navigate(`/courses/get/${courseId}`);
    }
  };

  if (progressLoading)
    return (
      <div className="h-screen flex justify-center items-center bg-secondary-6">
        <PuffLoader
          color={"#EA9215"}
          loading
          size={56}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <h1 className="text-accent-6 font-nokia-bold text-2xl">
          Saving your progress
        </h1>
      </div>
    );

  //display a full screen functionality when clicking on the image
  const handleOpenFullScreen = () => {
    setIsFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
  };

  // Flip divs on Reveal Element
  const handleFlip = (index: number) => {
    setFlip((prevState) => {
      const isFlipped = !prevState[index]; // Toggle the state
      const newState = { ...prevState, [index]: isFlipped };

      // If any item is flipped, update the 'IsRevealFlipped' state for Next button
      if (isFlipped) {
        setIsRevealFlipped(true);
      }

      return newState;
    });
  };

  // Save the state of the slider
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setSliderValue(newValue);
      setIsRangeChanged(true); // Next button available when slider value is changed
    }
  };

  // Drag and Drop Functions
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDraggedItem(active.id as string);
    console.log(draggedItem);
    // Reset showResult when dragging starts
    setShowQuizResult(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id === "droppable" && active.data?.current?.choice) {
      const choiceToAdd = active.data.current.choice.text;
      if (typeof choiceToAdd === "string") {
        setDroppedChoice(choiceToAdd);
      }
    } else {
      setDroppedChoice(null); // Reset or handle this scenario if needed.
    }

    setDraggedItem(null);
  };

  // Get video id from youtube link
  const getYoutubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Get the youtube image
  const getYoutubeThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  };

  // Update the state indicating whether the accordion is expanded for Next button.
  const handleAccordionToggle = (values: string) => {
    // Set `isAccordionExpanded` to true if the accordion has ever been expanded
    if (values.includes("item-1")) {
      setIsAccordionExpanded(true);
    }
  };

  // Reset Next button conditional states
  const resetInteractions = () => {
    setIsSlideComplete(false);
    setIsQuizAnswered(false);
    setIsAccordionExpanded(false);
    setIsRevealFlipped(false);
    setIsSequenceCompleted(false);
    setIsRangeChanged(false);
    setIsDndCompleted(false);
    setIsAudioPlayed(false);
    setIsVideoClicked(false);
  };

  // Next button onClick
  const moveToNextSlide = () => {
    updateIndex(activeIndex + 1); // Navigate to the next slide
    resetInteractions(); // Reset Next button conditional states
  };

  // Element types whose Next button is always available
  const isNonInteractiveType = () => {
    if (!selectedSlide || !selectedSlide.elements) return false;
    return selectedSlide.elements.every((element) => {
      return ["title", "sub", "text", "img", "list", "mix"].includes(
        element.type
      );
    });
  };

  // Conditional Rendering of Next Button
  const shouldShowNextButton =
    !isLastSlide &&
    (isNonInteractiveType() ||
      isSlideComplete ||
      isQuizAnswered ||
      isAccordionExpanded ||
      isRevealFlipped ||
      isSequenceCompleted ||
      isRangeChanged ||
      isDndCompleted ||
      isAudioPlayed ||
      isVideoClicked);

  if (isLoading) return <LoadingPage />;

  if (error) return <div>Something went wrong.</div>;

  return (
    <>
      <ToastContainer />
      <div className="flex   md:flex-row  justify-center items-center w-full   absolute top-0 bottom-0 z-50 h-full overflow-y-hidden">
        {/* Back button */}
        {/* <div className="absolute top-3 -left-28 pl-24 flex justify-start w-full mb-2">
          <button
            className="flex items-center justify-between border-accent-5 border w-max rounded-3xl px-3 py-1 gap-2 hover:bg-[#FAE5C7]"
            onClick={submitProgress}
          >
            <ArrowLeft
              size={22}
              className="text-white bg-accent-6 border p-1 rounded-lg"
            />
            <p className="text-accent-6 text-xs font-nokia-bold">ዘግተህ ውጣ</p>
          </button>
        </div> */}
        {/* Slides side bar for mobile and tablet*/}
        <div
          ref={ref}
          className={`lg:hidden ${
            open
              ? "absolute left-0 top-0 flex flex-col justify-start items-center w-full  z-50 h-full"
              : "w-0 h-0"
          }`}
          style={{ transition: "width 0.3s" }}
        >
          {open ? (
            <X
              onClick={handleArrowClick}
              className="text-primary-3 z-50 text-2xl  bg-accent-6 border p-1 rounded-full absolute right-3  top-3 cursor-pointer"
            />
          ) : null}

          {/* Course title and description*/}
          <div className="w-[100%] h-full bg-secondary-6 opacity-95 pb-3 rounded-b-lg pt-3 ">
            <h1 className="text-primary-6 font-nokia-bold text-xs lg:text-sm xl:text-lg  text-center mt-2 mb-1 xl:mt-3 xl:mb-2 ">
              {courseData?.title}
            </h1>
            <hr className="border-accent-5 border w-[90%] mx-auto" />

            <div className="w-[90%] mx-auto mt-2  flex flex-col">
              <p
                className={`text-accent-5 text-xs font-nokia-Regular xl:text-lg mt-2 mb-2  text-justify  w-[90%] mx-auto leading-tight lg:text-xs  ${
                  isExpanded ? "line-clamp-none" : "line-clamp-3"
                } text-justify leading-tight lg:text-xs`}
              >
                {courseData?.description}
              </p>
              <button
                onClick={toggleExpand}
                className="bg-accent-6 rounded-full px-2 text-xs text-primary-2 mt-2 hover:bg-accent-7 transition-all self-end"
              >
                {isExpanded ? "Less" : "More"}
              </button>
            </div>

            {/* Header */}
            <div className="flex flex-col mt-2 border-accent-5 border-b  w-[95%] mx-auto">
              <h1 className="font-nokia-bold text-primary-6 pb-1 text-xs lg:text-sm">
                ትምህርት {currentSlideNumber}/{totalDataNumber}
              </h1>
              <hr className="border-accent-5 border-b-2 w-[30%] " />
            </div>
            {/* slide list */}
            <div className="flex flex-col h-[73%] px-2 pt-2 gap-2 md:px-3 overflow-y-auto">
              {data.map((slides, index) => {
                const unlocked = isSlideUnlocked(index - 1);
                const isActive = index === activeIndex;

                return (
                  <button
                    key={index}
                    className={`flex justify-between items-center font-nokia-bold border-b border-accent-5 px-2 cursor-pointer py-2 rounded-lg hover:bg-[#FAE5C7] hover:opacity-80  ${
                      unlocked
                        ? "text-secondary-6"
                        : "text-secondary-3 hover:cursor-not-allowed"
                    }  ${isActive ? "bg-[#FAE5C7]" : "bg-secondary-2"}

                    `}
                    onClick={() => {
                      updateIndex(index);
                      handleArrowClick();
                    }}
                    disabled={!unlocked} // Disable the button if the slide is locked
                  >
                    <div className="flex flex-col items-start justify-start w-[90%] ">
                      <h2 className="font-nokia-bold text-secondary-6 text-left text-xs lg:text-sm">
                        {slides.slide}
                      </h2>
                      <p className="font-lato-Bold text-accent-6 text-xs1 lg:text-xs">
                        {index + 1}/{totalDataNumber} Slides
                      </p>
                    </div>
                    {unlocked ? (
                      <CheckCircle size={16} weight="fill" color={"#EA9215"} />
                    ) : (
                      <Lock size={16} color={"#EC4000"} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* <div className="flex justify-between items-center w-[90%] mx-auto mt-2">
              <button
                className="text-accent-6 font-nokia-bold bg-white hover:bg-primary-5 border border-accent-6 rounded-xl py-1 px-4 transition-all text-xs1 w-auto"
                onClick={submitProgress}
              >
                ዘግተህ ውጣ
              </button>
              <CaretCircleLeft className="text-2xl bg-primary-1 rounded-full text-accent-6 mr-2 hover:bg-primary-5 transition-all" />
            </div> */}
          </div>
        </div>
        {/* Slides side bar for desktop*/}
        <div className="hidden  h-full lg:flex flex-col justify-start items-center bg-primary-7  z-40 lg:w-[27%] ">
          {/* Short information*/}

          <div className="flex   py-2 bg-secondary-5  pl-12 w-full text-xs1  lg:text-xs z-50">
            <ArrowLeft
              onClick={submitProgress}
              className="text-white text-2xl  bg-accent-6 border p-1 rounded-lg absolute left-3  top-2.5 cursor-pointer "
            />

            <h1 className="text-primary-6 font-nokia-bold text-xs lg:text-lg flex-grow   items-center ">
              {courseData?.title}
            </h1>
          </div>

          {/* Course title and description*/}
          <div className="flex flex-col w-full h-full bg-primary-3 opacity-90 pb-3 rounded-b-lg">
            <div className="w-[90%] mx-auto mt-2  flex flex-col">
              <p
                className={`text-secondary-5 text-xs1 font-nokia-bold xl:text-lg ${
                  isExpanded ? "line-clamp-none" : "line-clamp-3"
                } text-justify leading-tight lg:text-xs`}
              >
                {courseData?.description}
              </p>
              <button
                onClick={toggleExpand}
                className="bg-accent-6 rounded-full px-2 text-xs text-primary-2 mt-2 hover:bg-accent-7 transition-all self-end"
              >
                {isExpanded ? "Less" : "More"}
              </button>
            </div>

            {/* Header */}
            <div className="flex flex-col  border-accent-5 border-b  w-[95%] mx-auto">
              <h1 className="font-nokia-bold text-secondary-6 pb-1 text-xs lg:text-sm">
                ትምህርቶች {currentSlideNumber}/{totalDataNumber}
              </h1>
              <hr className="border-accent-5 border-b-2 w-[30%] " />
            </div>
            {/* slide list */}
            <div className="flex flex-col h-[73%] px-2 pt-2 gap-2 md:px-3 overflow-y-auto ">
              {data.map((slides, index) => {
                const unlocked = isSlideUnlocked(index - 1);
                const isActive = index === activeIndex;

                return (
                  <button
                    key={index}
                    className={`flex justify-between items-center font-nokia-bold border-b border-accent-5 px-2 cursor-pointer py-2 rounded-lg hover:bg-[#FAE5C7] hover:opacity-80  ${
                      unlocked
                        ? "text-secondary-6"
                        : "text-secondary-3 hover:cursor-not-allowed"
                    }  ${isActive ? "bg-[#FAE5C7]" : "bg-secondary-2"}

                    `}
                    onClick={() => {
                      updateIndex(index);
                      handleArrowClick();
                    }}
                    disabled={!unlocked} // Disable the button if the slide is locked
                  >
                    <div className="flex flex-col items-start justify-start w-[90%] text-left">
                      <h2 className="font-nokia-bold text-secondary-6 text-xs lg:text-sm xl:text-lg">
                        {slides.slide}
                      </h2>
                      <p className="font-lato-Bold text-accent-6 text-xs1 lg:text-sm xl:text-lg">
                        {index + 1}/{totalDataNumber} Slides
                      </p>
                    </div>
                    {unlocked ? (
                      <CheckCircle size={16} weight="fill" color={"#EA9215"} />
                    ) : (
                      <Lock size={16} color={"#EC4000"} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* <div className="flex justify-between items-center w-[90%] mx-auto mt-4">
              <button
                className="text-accent-6 font-nokia-bold bg-white hover:bg-primary-5 border border-accent-6 rounded-xl py-2 px-6 transition-all text-sm w-auto"
                onClick={submitProgress}
              >
                ዘግተህ ውጣ
              </button>
              <CaretCircleLeft className="text-3xl bg-primary-1 rounded-full text-accent-6 mr-2 hover:bg-primary-5 transition-all" />
            </div> */}
          </div>
        </div>
        {/* slides display window*/}
        <div className="lg:w-[73%]  w-full h-full chapter-img-1 bg-no-repeat bg-cover bg-center  relative">
          {/* Chapter display container */}
          <div className="flex flex-col justify-between h-full">
            {/* Header */}
            <div>
              <div className="w-[90%] pt-4 pb-2 flex justify-between mx-auto items-center">
                <div className="  h-full flex justify-center items-center  md:space-x-0   xl:space-x-1 cursor-pointer ">
                  <img src={logo} className="w-8 h-5 md:w-10 md:h-6 " alt="" />
                  <h3 className="text-white font-nokia-bold text-xs md:text-sm ">
                    <strong>Ezra</strong> Seminary
                  </h3>
                </div>
                <p className="hidden lg:block font-nokia-bold text-primary-6 text-xs lg:text-sm">
                  {currentSlideNumber} / {totalDataNumber}
                </p>
                <div className="flex lg:hidden items-center">
                  <DotsThreeVertical
                    onClick={handleArrowClick}
                    className="block lg:hidden font-bold text-xl cursor-pointer text-primary-6 transition-all "
                  />
                  <X
                    onClick={submitProgress}
                    className="  text-primary-3  text-xl  bg-accent-6 border p-1 rounded-full cursor-pointer"
                  />
                </div>
              </div>
              <hr className="border-accent-5 border-1 w-[90%] mx-auto" />
            </div>

            {/* Slide content */}
            {data.map((slides, index) => {
              if (index === activeIndex) {
                return (
                  <div
                    key={index}
                    className=" flex flex-col justify-center items-center w-full px-2 md:w-[90%] mx-auto h-full overflow-y-hidden py-5"
                  >
                    <div
                      className={`flex flex-col  items-center w-full h-full overflow-y-auto  rounded-lg bg-black bg-opacity-20 scrollbar-thin px-2 space-y-1 ${
                        slides.elements.some(
                          (element) => element.type === "text"
                        )
                          ? " overflow-y-auto h-auto pb-3 justify-start  lg:justify-center"
                          : "py-0 justify-center"
                      }`}
                    >
                      <h1 className="text-lg lg:text-3xl xl:text-3xl text-accent-6 text-center pt-4 font-nokia-bold">
                        {slides.slide}
                      </h1>
                      {slides.elements.map((element) => {
                        if (element.type === "title") {
                          return (
                            <h1
                              key={element._id}
                              className="text-accent-5 text-sm lg:text-2xl xl:text-3xl font-nokia-bold pt-2"
                            >
                              {element.value}
                            </h1>
                          );
                        } else if (element.type === "sub") {
                          return (
                            <p
                              key={element._id}
                              className="text-secondary-3 font-nokia-bold  self-center tracking-wide text-center text-xl w-[90%] mx-auto xl:text-xl"
                            >
                              {element.value}
                            </p>
                          );
                        } else if (element.type === "text") {
                          return (
                            <p
                              key={element._id}
                              className="text-secondary-3 font-nokia-bold  w-[80%] mx-auto  self-center md:tracking-wide text-justify text-xs lg:text-lg lg:pt-2 xl:text-xl"
                            >
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{element.value}
                            </p>
                          );
                        } else if (element.type === "img") {
                          return (
                            <div className="w-full h-auto">
                              {isFullScreen ? (
                                <div className="absolute top-0 right-0 w-full h-full z-50 p-4">
                                  <div className="relative w-full h-full bg-secondary-7 bg-opacity-50 p-4 rounded-xl">
                                    <ArrowLeft
                                      size={40}
                                      className="absolute top-4 left-4 text-primary-5 bg-secondary-7 border p-1 rounded-full z-50 cursor-pointer hover:bg-secondary-5 transition-all"
                                      weight="bold"
                                      onClick={handleCloseFullScreen}
                                    />
                                    <img
                                      src={`https://ezra-seminary.me/images/${element.value}`}
                                      alt="fullscreen content"
                                      className="w-full h-full object-contain rounded-3xl"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="relative w-[30vh] h-[30vh] mx-auto my-2 shadow-xl bg-secondary-7 bg-opacity-50 rounded-xl"
                                  onClick={handleOpenFullScreen}
                                >
                                  <img
                                    key={element._id}
                                    src={`https://ezra-seminary.me/images/${element.value}`}
                                    alt="no image"
                                    className="w-full h-full object-contain shadow-xl rounded-xl text-primary-5 text-center"
                                  />
                                  <CornersOut
                                    size={28}
                                    className="absolute bottom-1 right-1 text-primary-5 bg-secondary-7 border p-1 rounded-lg z-50 cursor-pointer hover:bg-secondary-5 transition-all"
                                    weight="bold"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        } else if (element.type === "list") {
                          const listItemsComponent = element.value.map(
                            (listItem: string, index: number) => (
                              <li
                                key={index}
                                className=" text-secondary-3 pt-2 font-nokia-bold w-[100%] tracking-wide text-lg xl:text-xl"
                              >
                                {listItem}
                              </li>
                            )
                          );

                          return (
                            <div key={element._id} className="w-[70%] mx-auto">
                              <ul className="flex w-full flex-col justify-center items-center list-disc my-2 custom-list-color ">
                                {listItemsComponent}
                              </ul>
                            </div>
                          );
                        } else if (element.type === "slide") {
                          const listItemsComponent = element.value.map(
                            (listItem: string, index: number) => (
                              <SplideSlide
                                key={index}
                                className="flex justify-center items-center mx-auto text-secondary-3 font-nokia-bold w-[100%] h-auto text-justify px-14 md:px-16 py-6 tracking-wide text-xs lg:text-lg xl:text-xl "
                              >
                                {listItem}
                              </SplideSlide>
                            )
                          );

                          return (
                            <div className="rounded-lg shadow-2xl my-2 bg-secondary-6 bg-opacity-20 w-full lg:py-6 overflow-y-auto scrollbar-thin ">
                              <div
                                key={element._id}
                                className="w-full  mx-auto h-auto px-2"
                              >
                                <Splide
                                  options={{
                                    perPage: 1,
                                    type: "fade",
                                    height: "auto",
                                    width: "100%",
                                    cursor: "pointer",
                                    autoWidth: false,
                                    arrows: true, // Enable arrow navigation
                                    pagination: true,
                                    focus: "center",
                                    trimSpace: true,
                                    isNavigation: false,
                                    gap: "1rem",
                                  }}
                                  // Add an event listener to Splide to track when you are on the last slide
                                  onMoved={(_, newIndex) => {
                                    if (newIndex === element.value.length - 1) {
                                      setIsSlideComplete(true);
                                    }
                                  }}
                                >
                                  {listItemsComponent}
                                </Splide>
                              </div>
                            </div>
                          );
                        } else if (element.type === "quiz") {
                          return (
                            <div
                              key={element._id}
                              className="flex flex-col justify-center items-center mb-4"
                            >
                              {/* Questions */}
                              <p className="text-secondary-2 text-justify w-[90%] mx-auto font-nokia-bold text-sm lg:text-lg xl:text-xl">
                                {element.value.question}
                              </p>
                              {/* Choices */}
                              {element.value.choices && (
                                <div className="flex flex-col mt-2 space-y-2">
                                  {element.value.choices.map(
                                    (
                                      choice: { text: string },
                                      choiceIndex: number
                                    ) => {
                                      return (
                                        <label
                                          key={`${element._id}-choice-${choiceIndex}`}
                                          className="inline-flex items-center"
                                        >
                                          <input
                                            type="radio"
                                            className="w-5 h-5 appearance-none bg-secondary-2 focus:bg-orange-400 focus-within:animate-pulse rounded-full transition-all pt-2 cursor-pointer"
                                            checked={
                                              selectedChoice === choiceIndex
                                            }
                                            onChange={() =>
                                              handleRadioChange(
                                                choiceIndex,
                                                choice.text,
                                                element.value.correctAnswer
                                              )
                                            }
                                          />
                                          <span className="text-accent-6 font-nokia-bold text-xs  lg:text-lg xl:text-xl ml-2 ">
                                            {choice.text}
                                          </span>
                                        </label>
                                      );
                                    }
                                  )}
                                </div>
                              )}
                              {/* Correct Answer */}
                              <div className="flex mt-4">
                                <button
                                  className="text-white text-center font-nokia-bold bg-accent-6 hover:bg-accent-7 w-max rounded-3xl mx-auto text-xs1 lg:text-lg xl:text-xl lg:py-1 px-2"
                                  onClick={() => {
                                    setShowQuizResult(true);
                                    setIsQuizAnswered(true); //Next button available when the check answer button is clicked
                                  }}
                                >
                                  Check Answer
                                </button>
                                {renderQuizResult()}
                              </div>
                            </div>
                          );
                        } else if (element.type === "accordion") {
                          const accordionItemsComponent = element.value.map(
                            (accordionItem, index: number) => (
                              <AccordionItemDisplay
                                key={`$accordion-${index}`}
                                title={accordionItem.title}
                                content={accordionItem.content}
                                onToggle={handleAccordionToggle}
                              />
                            )
                          );
                          return (
                            <div className="flex flex-col justify-center items-center w-full">
                              {accordionItemsComponent}
                            </div>
                          );
                        } else if (element.type === "sequence") {
                          return (
                            <div className="h-[65%] md:h-[30%] lg:h-[50%] w-full flex justify-center items-center">
                              <Carousel
                                orientation="vertical"
                                opts={{
                                  align: "center",
                                }}
                                onLastItemVisible={(visible) =>
                                  setIsSequenceCompleted(visible)
                                } // Next button available when the carouselItem is on the last sequenceItem.
                                key={element._id}
                                className="w-full flex justify-center items-center h-auto"
                              >
                                <CarouselContent className=" h-[200px] md:h-[150px] ">
                                  {element.value.map(
                                    (sequenceItem: string, index: number) => (
                                      <CarouselItem key={index}>
                                        <div className="flex items-center justify-center p-6 bg-secondary-4 bg-opacity-25 w-full rounded-xl shadow-2xl  h-full">
                                          <span className="text-accent-5 text-lg lg:text-xl text-justify font-nokia-bold ">
                                            {sequenceItem}
                                          </span>
                                        </div>
                                      </CarouselItem>
                                    )
                                  )}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                              </Carousel>
                            </div>
                          );
                        } else if (element.type === "reveal") {
                          return (
                            <>
                              {element.value.map((revealItem, index) => (
                                <ReactCardFlip
                                  isFlipped={flip[index] || false}
                                  flipDirection="vertical"
                                  key={index}
                                  containerClassName="w-full h-auto flex flex-col justify-center items-center font-nokia-bold "
                                >
                                  <div
                                    onClick={() => handleFlip(index)}
                                    className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto h-[100px] flex items-center justify-center text-center bg-secondary-4 bg-opacity-20  shadow-2xl  px-2 text-accent-5 text-sm hover:bg-secondary-2 hover:bg-opacity-20 cursor-pointer transition-all rounded-lg my-1"
                                  >
                                    {revealItem.title}
                                  </div>
                                  <div
                                    onClick={() => handleFlip(index)}
                                    className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto h-[100px] py-4 overflow-y-auto scrollbar-thin flex items-start justify-center text-center bg-secondary-2 border-2 border-secondary-2 shadow-2xl  px-2 text-accent-8 text-lg hover:bg-secondary-3  cursor-pointer transition-all rounded-lg my-1"
                                  >
                                    {revealItem.content}
                                  </div>
                                </ReactCardFlip>
                              ))}
                            </>
                          );
                        } else if (element.type === "range") {
                          return (
                            <>
                              <div className="w-[80%] pt-8 mx-auto">
                                <Slider
                                  min={0}
                                  max={5}
                                  step={1}
                                  marks={sliderMarks}
                                  valueLabelDisplay="on"
                                  valueLabelFormat={(value) =>
                                    value === 2.5 ? "Touch to slide" : value
                                  }
                                  value={sliderValue}
                                  onChange={handleSliderChange}
                                  sx={{
                                    color: "#EA9215",
                                    "& .MuiSlider-track": {
                                      backgroundColor: "",
                                    },
                                    "& .MuiSlider-thumb": {
                                      backgroundColor: "#AAB0B4",
                                    },
                                    "& .MuiSlider-mark": {
                                      backgroundColor: "#EEEEEE",
                                    },
                                    "& .MuiSlider-markLabel": {
                                      color: "#EEEEEE",
                                    },
                                    "& .MuiSlider-valueLabel": {
                                      color: "#EEEEEE",
                                    },
                                  }}
                                />
                              </div>
                              <div className="flex justify-between w-full">
                                <button className="text-primary-6 text-sm lg:text-lg xl:text-xl bg-accent-6 hover:bg-accent-7 transition-all w-max py-1 px-2 rounded-full">
                                  ምንም አልተማርኩም
                                </button>
                                <button className="text-primary-6 text-sm lg:text-lg xl:text-xl bg-accent-6 hover:bg-accent-7 transition-all w-max py-1 px-2 rounded-full">
                                  በጣም ተምሬያለሁ
                                </button>
                              </div>
                            </>
                          );
                        } else if (element.type === "dnd") {
                          return (
                            <div
                              key={element._id}
                              className="flex flex-col justify-center items-center w-[90%] mx-auto h-full"
                            >
                              {/* Questions */}
                              <p className="text-secondary-3 text-justify font-nokia-bold text-sm lg:text-lg xl:text-xl ">
                                {element.value.question}
                              </p>
                              {/* Choices */}
                              {element.value.choices && (
                                <DndContext
                                  onDragStart={handleDragStart}
                                  onDragEnd={handleDragEnd}
                                  sensors={sensors}
                                  collisionDetection={closestCenter}
                                >
                                  <div className="flex w-[80%] flex-wrap justify-center items-center gap-3 mx-auto pt-4">
                                    {element.value.choices.map(
                                      (choice, choiceIndex) => {
                                        if (droppedChoice !== choice.text) {
                                          return (
                                            // dragable item
                                            <div className="text-sm bg-secondary-6 bg-opacity-20">
                                              <DraggableItem
                                                key={choiceIndex}
                                                choice={choice}
                                                choiceIndex={choiceIndex}
                                                id="draggable"
                                              />
                                            </div>
                                          );
                                        }
                                      }
                                    )}
                                  </div>
                                  {/* dropable area */}
                                  <div className="flex justify-center items-center w-[80%] h-[100px] mx-auto">
                                    <DroppableArea
                                      key={`droppable_${element._id}`}
                                      droppedChoice={droppedChoice}
                                      id="droppable"
                                    />
                                  </div>
                                </DndContext>
                              )}
                              {/* Correct Answer */}
                              <div className="flex mt-2">
                                <button
                                  className="text-primary-6 text-center font-nokia-bold bg-accent-6 hover:bg-accent-7 w-max rounded-3xl mx-auto text-xs lg:text-lg xl:text-xl lg:py-1 px-2"
                                  onClick={handleCheckAnswer}
                                >
                                  Check Answer
                                </button>
                                {renderDndResult()}
                              </div>
                            </div>
                          );
                        } else if (element.type === "mix") {
                          return (
                            <div key={element._id}>
                              <p className="text-secondary-3 font-nokia-bold  w-[80%] mx-auto  self-center md:tracking-wide text-justify text-xs lg:text-lg xl:text-xl lg:pt-2 ">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {element.value.text1}
                              </p>
                              <div className="w-full h-auto">
                                {isFullScreen ? (
                                  <div className="absolute top-0 right-0 w-full h-full z-50 p-4">
                                    <div className="relative w-full h-full bg-secondary-7 bg-opacity-50 p-4 rounded-xl">
                                      <ArrowLeft
                                        size={40}
                                        className="absolute top-4 left-4 text-primary-5 bg-secondary-7 border p-1 rounded-full z-50 cursor-pointer hover:bg-secondary-5 transition-all"
                                        weight="bold"
                                        onClick={handleCloseFullScreen}
                                      />
                                      <img
                                        src={`https://ezra-seminary.me/images/${element.value.file}`}
                                        alt="fullscreen content"
                                        className="w-full h-full object-contain rounded-3xl"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="relative w-[30vh] h-[30vh] mx-auto my-2 shadow-xl bg-secondary-7 bg-opacity-50 rounded-xl"
                                    onClick={handleOpenFullScreen}
                                  >
                                    <img
                                      src={`https://ezra-seminary.me/images/${element.value.file}`}
                                      alt="no image"
                                      className="w-full h-full object-contain shadow-xl rounded-xl text-primary-5 text-center"
                                    />
                                    <CornersOut
                                      size={28}
                                      className="absolute bottom-1 right-1 text-primary-5 bg-secondary-7 border p-1 rounded-lg z-50 cursor-pointer hover:bg-secondary-5 transition-all"
                                      weight="bold"
                                    />
                                  </div>
                                )}
                              </div>
                              <p className="text-secondary-3 font-nokia-bold  w-[80%] mx-auto  self-center md:tracking-wide text-justify text-xs lg:text-lg xl:text-xl lg:pt-2 ">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {element.value.text2}
                              </p>
                            </div>
                          );
                        } else if (element.type === "audio") {
                          return (
                            <div
                              key={element.id}
                              className="flex flex-col items-center justify-center w-[80%] bg-gray-100 rounded-3xl shadow-md"
                            >
                              <audio
                                controls
                                className="w-full"
                                onPlay={() => setIsAudioPlayed(true)} // Next button available when played
                              >
                                <source
                                  src={`https://ezra-seminary.me/images/${element.value}`}
                                  type="audio/mpeg"
                                />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          );
                        } else if (element.type === "video") {
                          const videoId = getYoutubeVideoId(element.value);
                          const thumbnailUrl = videoId
                            ? getYoutubeThumbnailUrl(videoId)
                            : undefined;

                          return (
                            element.value && (
                              <a
                                href={element.value}
                                key={index}
                                className="relative inline-block"
                                onClick={() => setIsVideoClicked(true)} // Next button available when clicked
                              >
                                {videoId ? (
                                  <div className="relative w-[70%] mx-auto rounded-xl border-2 hover:border-accent-5 hover:opacity-90 transition-all">
                                    <img
                                      src={thumbnailUrl}
                                      alt="YouTube Thumbnail"
                                      className="rounded-xl"
                                    />
                                    <YoutubeLogo
                                      size={48}
                                      weight="fill"
                                      className="absolute inset-0 m-auto text-[#FF0000]"
                                    />
                                  </div>
                                ) : (
                                  <p className="text-white">
                                    Invalid YouTube URL
                                  </p>
                                )}
                              </a>
                            )
                          );
                        }
                      })}
                    </div>
                  </div>
                );
              } else {
                return null; // Hide the slide if it doesn't match the activeIndex
              }
            })}

            <div className="mb-4">
              <hr className="border-accent-5 border-1 w-[90%] mx-auto z-50" />
              <div className="flex justify-between items-center w-full ">
                <button
                  className={`text-white text-center font-nokia-bold mt-2 bg-accent-6 hover:bg-accent-7 w-auto rounded-3xl mx-auto text-xs1 lg:text-lg xl:text-xl lg:py-1 px-2  ${
                    activeIndex === 0 ? "hidden" : "block"
                  }`} // hidding the previous button for the first slide
                  onClick={() => {
                    updateIndex(activeIndex - 1);
                  }}
                >
                  ተመለስ
                </button>
                <p
                  className={`block lg:hidden font-nokia-bold text-primary-5 text-xs lg:text-sm pt-2 ${
                    activeIndex === 0 ? "hidden" : "block"
                  } ${isLastSlide ? "hidden" : "block"}`}
                >
                  {currentSlideNumber} / {totalDataNumber}
                </p>

                <button
                  className={`text-white text-center font-nokia-bold mt-2 bg-accent-6 hover:bg-accent-7 w-auto rounded-3xl mx-auto text-xs1 lg:text-lg xl:text-xl lg:py-1 px-2  ${
                    shouldShowNextButton ? "block" : "hidden"
                  }`}
                  onClick={moveToNextSlide}
                >
                  ቀጥል
                </button>

                <button
                  className={`text-primary-5 text-center font-nokia-bold mt-2 bg-accent-6 hover:bg-accent-7 w-auto rounded-3xl mx-auto text-xs1 lg:text-sm  lg:py-1 px-2  ${
                    isLastSlide ? "block" : "hidden"
                  }`}
                  onClick={submitProgress}
                >
                  ዘግተህ ውጣ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SlidesDisplay;
