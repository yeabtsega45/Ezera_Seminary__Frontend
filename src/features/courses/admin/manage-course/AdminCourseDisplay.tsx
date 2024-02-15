import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectSlides,
  Slide,
  Element,
  CourseState,
  CustomElement,
} from "@/redux/courseSlice";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/sea-green";
import "@splidejs/react-splide/css/core";

interface SelectedSlideIndex {
  chapter: number;
  slide: number;
}

interface AdminCourseDisplayProps {
  selectedSlideIndex: SelectedSlideIndex;
}

function AdminCourseDisplay({ selectedSlideIndex }: AdminCourseDisplayProps) {
  //Quiz Related functions
  //track whether the selected answer is correct or not.
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  //radio input switch
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const handleRadioChange = (choiceIndex: number, choiceValue) => {
    setSelectedChoice(choiceIndex);
    //logic to determine whether the selected answer is correct.
    if (selectedSlide.elements.some((el) => el.type === "quiz")) {
      const quizElement = selectedSlide?.elements?.find(
        (el) => el.type === "quiz"
      ) as Element[];
      const isCorrect = choiceValue === quizElement.value.correctAnswer;
      setIsAnswerCorrect(isCorrect);
    }
  };

  //isCorrect switch
  const renderQuizResult = () => {
    if (isAnswerCorrect === null) return null; // Don't show feedback before a choice has been made

    if (isAnswerCorrect) {
      return <p className="text-green-800 font-bold text-xl">Correct!</p>;
    } else {
      return <p className="text-red-700 font-bold text-xl">Wrong!</p>;
    }
  };

  const slides = useSelector((state: { course: CourseState }) =>
    selectSlides(state, selectedSlideIndex.chapter)
  ) as Slide[];
  const selectedSlide = slides[selectedSlideIndex.slide];

  //Display image from state
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  useEffect(() => {
    if (selectedSlide && selectedSlide?.elements) {
      const imgElement = selectedSlide.elements.find(
        (e) => e.type === "img"
      ) as Element[];
      if (imgElement && imgElement.value instanceof File) {
        const objectUrl = URL.createObjectURL(imgElement.value as File);
        setImagePreviewUrl(objectUrl);

        // Clean up the URL when the component unmounts
        return () => URL.revokeObjectURL(objectUrl);
      }
    }
  }, [selectedSlide]);

  return (
    <div className="mr-16 h-[80%] bg-chapter-img-1 bg-no-repeat bg-cover bg-center rounded-lg">
      <div className="flex flex-col justify-between w-full h-full">
        <div>
          <div className="w-[90%] pt-4 pb-2 flex justify-between mx-auto items-center">
            <h1 className="text-[#fff] text-sm font-Lato-Black">
              EZRA seminary
            </h1>
            <img
              src="../assets/close-icon.svg"
              className="w-[3%] z-40 cursor-pointer"
              alt=""
            />
          </div>
          <hr className="border-accent-5 border-1 w-[90%] mx-auto" />
        </div>
        {selectedSlide && selectedSlide.elements && (
          <div className="flex flex-col justify-center items-center flex-grow p-5 w-full h-full overflow-y-hidden">
            <h1 className="text-3xl text-[#fff] text-center font-nokia-bold">
              {selectedSlide.slide}
            </h1>
            <ul className="flex flex-col justify-center items-center w-full h-full overflow-y-auto scrollbar-thin relative">
              {selectedSlide.elements.map((element: CustomElement, index) => {
                let elementComponent = null;
                const uniqueKey = `${element.type}-${index}`;
                if (element.type === "title") {
                  elementComponent = (
                    <h1
                      key={element.type}
                      className="text-white text-2xl font-nokia-bold text-center"
                    >
                      {element.value}
                    </h1>
                  );
                } else if (element.type === "sub") {
                  elementComponent = (
                    <p
                      key={element.type}
                      className="text-white font-nokia-bold w-[100%] self-center tracking-wide text-1xl text-center"
                    >
                      {element.value}
                    </p>
                  );
                } else if (element.type === "text") {
                  elementComponent = (
                    <p
                      key={element.type}
                      className="text-white font-nokia-bold w-[100%] self-center tracking-wide text-justify text-lg"
                    >
                      {element.value}
                    </p>
                  );
                } else if (element.type === "img") {
                  elementComponent = (
                    <img
                      key={element.type}
                      src={imagePreviewUrl}
                      alt={element.value.name}
                      className="w-[40%] mx-auto"
                    />
                  );
                } else if (element.type === "list") {
                  const listItemsComponent = element.value.map(
                    (listItem, index) => (
                      <li
                        key={`${uniqueKey}-list-${index}`}
                        className="text-white font-nokia-bold w-[100%] tracking-wide text-lg"
                      >
                        {listItem}
                      </li>
                    )
                  );

                  elementComponent = (
                    <div className="flex flex-col justify-center items-center ml-8">
                      <ul className="list-disc mt-2">{listItemsComponent}</ul>
                    </div>
                  );
                } else if (element.type === "quiz") {
                  elementComponent = (
                    <div
                      key={uniqueKey}
                      className="flex flex-col justify-center items-center mb-4"
                    >
                      {/* Questions */}
                      <p className="text-white font-nokia-bold text-2xl">
                        {element.value.question}
                      </p>
                      {/* Choices */}
                      {element.value.choices && (
                        <div className="flex flex-col mt-2">
                          {element.value.choices.map((choice, choiceIndex) => {
                            return (
                              <label
                                key={`${uniqueKey}-choice-${choiceIndex}`}
                                className="inline-flex items-center"
                              >
                                <input
                                  type="radio"
                                  className="w-5 h-5 appearance-none bg-white focus:bg-orange-400 rounded-full transition-all"
                                  checked={selectedChoice === choiceIndex}
                                  onChange={() =>
                                    handleRadioChange(choiceIndex, choice.text)
                                  }
                                />
                                <span className="text-white font-nokia-bold text-lg ml-2">
                                  {choice.text}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                      {/* Correct Answer */}
                      {renderQuizResult()}
                    </div>
                  );
                } else if (element.type === "slide") {
                  const listItemsComponent = element.value.map(
                    (listItem, index) => (
                      <SplideSlide
                        key={index}
                        className="flex justify-center items-center text-white font-nokia-bold w-full tracking-wide text-left text-lg px-8"
                      >
                        {listItem}
                      </SplideSlide>
                    )
                  );

                  return (
                    <div
                      key={element._id}
                      className="flex flex-col w-full ml-8"
                    >
                      <Splide
                        options={{
                          gap: "1rem",
                        }}
                        className="w-full p-8 rounded-md list-disc mt-2"
                      >
                        {listItemsComponent}
                      </Splide>
                    </div>
                  );
                }

                return elementComponent;
              })}
            </ul>
            <button
              className="absolute bottom-20 p-1 bg-black opacity-60 rounded-full text-white text-3xl"
              onClick={() => {
                const container = document.querySelector(".overflow-y-auto");
                container.scrollTop += 50; // Adjust the scroll amount as needed
              }}
            >
              ▼
            </button>
          </div>
        )}
        <div className="mb-4 w-[100%] flex flex-col items-center justify-center">
          <hr className="border-accent-5  border-1 w-[90%] mx-auto z-50 " />
          <button className="text-white text-center font-nokia-bold mt-2 py-1 px-2 bg-accent-6 hover:bg-accent-7 w-[15%] rounded-3xl text-2xl transition-all">
            ቀጥል
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminCourseDisplay;
