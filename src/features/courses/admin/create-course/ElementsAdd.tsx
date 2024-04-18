import { useState, ChangeEvent, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addElementToSlide,
  updateElement,
  deleteElement,
  CourseState,
} from "../../../../redux/courseSlice";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";

interface ElementsAddProps {
  chapterIndex: number;
  slideIndex: number;
}

const ElementsAdd: FC<ElementsAddProps> = ({ chapterIndex, slideIndex }) => {
  const dispatch = useDispatch();

  const chapters = useSelector(
    (state: { course: CourseState }) => state.course.chapters
  );
  const elements = chapters[chapterIndex]?.slides[slideIndex]?.elements || [];

  const [currentElement, setCurrentElement] = useState("");

  const [listItems, setListItems] = useState<string[]>([]);
  const [currentListItem, setCurrentListItem] = useState<string>("");
  const [slidesDetails, setSlidesDetails] = useState<string[]>([]);
  const [currentSlideDetails, setCurrentSlideDetails] = useState<string>("");
  const [accordionTitles, setAccordionTitles] = useState<string[]>([]);
  const [accordionContents, setAccordionContents] = useState<string[]>([]);
  const [sequenceItems, setSequenceItems] = useState<string[]>([]);
  const [currentSequenceItem, setCurrentSequenceItem] = useState<string>("");

  const handleSequenceInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentSequenceItem(event.target.value);
  };

  const handleAddSequenceItem = () => {
    if (currentSequenceItem) {
      setSequenceItems([...sequenceItems, currentSequenceItem]);
      setCurrentSequenceItem("");
    }
  };

  const handleAddSequenceElement = () => {
    if (sequenceItems.length > 0) {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: "sequence",
          value: sequenceItems,
        })
      );
      setSequenceItems([]);
    }
    setCurrentElement("");
  };

  const handleDeleteSequenceItem = (indexToDelete: number) => {
    const updatedSequence = sequenceItems.filter(
      (_, index) => index !== indexToDelete
    );
    setSequenceItems(updatedSequence);
  };

  const handleListInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentListItem(event.target.value);
  };

  const handleAddListItem = () => {
    if (currentListItem) {
      setListItems([...listItems, currentListItem]);
      setCurrentListItem("");
    }
  };

  const handleAddListElement = () => {
    if (listItems.length > 0) {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: "list",
          value: listItems,
        })
      );
      setListItems([]);
    }
    setCurrentElement("");
    console.log(elements);
  };

  const handleAddSlide = () => {
    if (currentSlideDetails) {
      setSlidesDetails([...slidesDetails, currentSlideDetails]);
      setCurrentSlideDetails("");
    }
  };

  const handleDeleteSlideItem = (indexToDelete: number) => {
    const updatedSlides = slidesDetails.filter(
      (_, index) => index !== indexToDelete
    );
    setSlidesDetails(updatedSlides);
  };

  const handleSaveSlides = () => {
    dispatch(
      addElementToSlide({
        chapterIndex,
        slideIndex,
        elementType: "slide",
        value: slidesDetails,
      })
    );
    setSlidesDetails([]); // Clear slides details after adding
  };

  const handleFileInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Get the first file from the input
      if (file) {
        dispatch(
          updateElement({
            chapterIndex,
            slideIndex,
            elementId: id,
            value: file,
          })
        );
      }
    }
  };

  const handleDeleteListItem = (indexToDelete: number) => {
    const updatedList = listItems.filter((_, index) => index !== indexToDelete);
    setListItems(updatedList);
  };

  const handleAccordionTitleChange = (index: number, text: string) => {
    setAccordionTitles(
      accordionTitles.map((title, i) => (i === index ? text : title))
    );
  };

  const handleAccordionContentChange = (index: number, text: string) => {
    setAccordionContents(
      accordionContents.map((content, i) => (i === index ? text : content))
    );
  };

  const handleAddAccordionItem = () => {
    setAccordionTitles([...accordionTitles, ""]);
    setAccordionContents([...accordionContents, ""]);
  };

  const saveAccordionToRedux = () => {
    if (accordionTitles.length > 0 && accordionContents.length > 0) {
      const accordionItems = accordionTitles.map((title, index) => ({
        title,
        content: accordionContents[index],
      }));

      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: "accordion",
          value: accordionItems,
        })
      );

      // Reset accordion state
      setAccordionTitles([]);
      setAccordionContents([]);
    }
    setCurrentElement("");
  };

  const renderListForm = () => (
    <div className="pb-4">
      <div className="flex flex-col items-center w-[100%] gap-1">
        <input
          type="text"
          value={currentListItem}
          onChange={handleListInputChange}
          placeholder="Enter list item"
          className="border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6 rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
        />

        <div className="flex justify-between items-center gap-2 mt-2 w-[80%] mx-auto">
          <button
            onClick={handleAddListItem}
            className=" flex gap-1 text-sm items-center text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
          >
            <PlusCircle
              className="text-primary-6  transition-all"
              size={16}
              weight="fill"
            />
            Add
          </button>
          <button
            onClick={handleAddListElement}
            className=" flex gap-1 items-center text-sm text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
          >
            <File
              className="text-primary-6  transition-all"
              size={16}
              weight="fill"
            />
            Save
          </button>
        </div>
      </div>
      <ul className="pt-4 w-[100%] cursor-pointer overflow-y-auto">
        {listItems.map((item, index) => (
          <label className="text-accent-6 ">
            List Item {index + 1}:
            <li
              key={index}
              className="flex justify-between border border-accent-6 rounded px-2 py-1 bg-secondary-4 text-primary-6"
            >
              {item}{" "}
              <span>
                <Trash
                  onClick={() => handleDeleteListItem(index)}
                  className="text-red-600 hover:text-red-700 hover:cursor-pointer transition-all"
                  weight="fill"
                  size={22}
                />
              </span>
            </li>
          </label>
        ))}
      </ul>
    </div>
  );

  const renderAccordionForm = () => (
    <div className="pb-4">
      <div className="flex justify-between items-center gap-2 w-full">
        <button
          onClick={handleAddAccordionItem}
          className=" flex gap-1 text-sm items-center text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
        >
          <PlusCircle
            className="text-primary-6  transition-all"
            size={16}
            weight="fill"
          />
          Add
        </button>
        <button
          onClick={saveAccordionToRedux}
          className=" flex gap-1 items-center text-sm text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
        >
          <File
            className="text-primary-6  transition-all"
            size={16}
            weight="fill"
          />
          Save
        </button>
      </div>
      <ul className="pt-4 w-[100%] cursor-pointer overflow-y-auto">
        {accordionTitles.map((title, index) => (
          <label className="text-accent-6 ">
            Accordion Item {index + 1}:
            <li key={index} className="flex flex-col space-y-2 mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) =>
                  handleAccordionTitleChange(index, e.target.value)
                }
                placeholder={`Title ${index + 1}`}
                className="mt-1  border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6 rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
              />
              <textarea
                value={accordionContents[index]}
                onChange={(e) =>
                  handleAccordionContentChange(index, e.target.value)
                }
                placeholder={`Content ${index + 1}`}
                className="mt-1  border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6 rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
              />
              <Trash
                onClick={() => {
                  setAccordionTitles(
                    accordionTitles.filter((_, i) => i !== index)
                  );
                  setAccordionContents(
                    accordionContents.filter((_, i) => i !== index)
                  );
                }}
                className="text-red-600 hover:text-red-700 hover:cursor-pointer transition-all mt-1 self-end"
                weight="fill"
                size={22}
              />
            </li>
          </label>
        ))}
      </ul>
    </div>
  );

  const renderSlideForm = () => (
    <div className="">
      <div className="flex flex-col items-center w-[100%] gap-1 ">
        <textarea
          value={currentSlideDetails}
          onChange={(e) => setCurrentSlideDetails(e.target.value)}
          placeholder="Enter slide details...."
          className="border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6  rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
        />
        <div
          className="flex justify-between items-center gap-2 mt-2 w-[80%] mx-auto"
          onClick={handleAddSlide}
        >
          <button className=" flex gap-1 text-sm items-center text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all">
            <PlusCircle
              className="text-primary-6  transition-all"
              size={16}
              weight="fill"
            />
            Add
          </button>
          <button
            onClick={handleSaveSlides}
            className=" flex gap-1 items-center text-sm text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
          >
            <File
              className="text-primary-6  transition-all"
              size={16}
              weight="fill"
            />
            Save
          </button>
        </div>
      </div>
      <ul className="w-[100%]  pb-4 cursor-pointer overflow-y-auto">
        {slidesDetails.map((details, index) => (
          <label className="text-accent-6 ">
            {" "}
            Slide {index + 1}:
            <li
              key={index}
              className="flex justify-between break-words border border-accent-6 rounded px-2 py-1 bg-secondary-4 text-primary-6"
            >
              {details}{" "}
              <span>
                <Trash
                  onClick={() => handleDeleteSlideItem(index)}
                  className="text-red-600 hover:text-red-700 hover:cursor-pointer transition-all"
                  weight="fill"
                  size={22}
                />
              </span>
            </li>
          </label>
        ))}
      </ul>
    </div>
  );

  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentElement(e.target.value);
  };

  const handleAddButtonClick = () => {
    // Only dispatch addElementToSlide when the add button is clicked and currentElement is not "list"
    if (
      currentElement &&
      currentElement !== "list" &&
      currentElement !== "img" &&
      currentElement !== "quiz" &&
      currentElement !== "sequence"
    ) {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: currentElement,
          value: "",
        })
      );
      setCurrentElement("");
    } else if (currentElement && currentElement === "img") {
      // For an image, just setup the element; don't add until an image is selected
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: currentElement,
          value: null, // Initially no image file chosen
        })
      );
    }
  };

  const handleInputChange = (id: string, value: string) => {
    dispatch(
      updateElement({
        chapterIndex,
        slideIndex,
        elementId: id,
        value: value,
      })
    );
  };

  const handleDeleteButtonClick = (elementId: string) => {
    dispatch(
      deleteElement({
        chapterIndex,
        slideIndex,
        elementId,
      })
    );
  };

  // Quiz-related state and functions
  const [quizQuestion, setQuizQuestion] = useState<string>("");
  const [quizChoices, setQuizChoices] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");

  const handleQuizQuestionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuizQuestion(event.target.value);
  };

  const handleQuizChoiceChange = (index: number, text: string) => {
    setQuizChoices(
      quizChoices.map((choice, i) => (i === index ? text : choice))
    );
  };

  const handleAddQuizChoice = () => {
    setQuizChoices([...quizChoices, ""]); // Adds a new empty choice
  };

  const handleCorrectAnswerChange = (value: string) => {
    setCorrectAnswer(value);
  };

  const saveQuizToRedux = () => {
    if (quizQuestion && quizChoices.length > 0) {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: "quiz",
          value: {
            question: quizQuestion,
            choices: quizChoices.map((text) => ({ text })),
            correctAnswer,
          },
        })
      );
      // Reset quiz state
      setQuizQuestion("");
      setQuizChoices([]);
      setCorrectAnswer("");
    }
    setCurrentElement("");
  };

  const renderQuizForm = () => (
    <div className="pb-4">
      <div className="flex flex-col items-center w-[100%] gap-1 pb-2">
        <input
          type="text"
          value={quizQuestion}
          onChange={handleQuizQuestionChange}
          placeholder="Enter quiz question"
          className="border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6  rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
        />
        <div className="flex justify-between items-center gap-2 mt-2 w-[80%] mx-auto">
          <button
            onClick={handleAddQuizChoice}
            className=" flex gap-1 text-sm items-center text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
          >
            <PlusCircle
              className="text-primary-6  transition-all"
              size={16}
              weight="fill"
            />
            Add
          </button>
          <button
            onClick={saveQuizToRedux}
            className=" flex gap-1 items-center text-sm text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
          >
            <File
              className="text-primary-6  transition-all"
              size={16}
              weight="fill"
            />
            Save
          </button>
        </div>
      </div>
      <ul className="space-y-2 py-4">
        {/* // Map over quizChoices to render choices */}
        {quizChoices.map((choice, index) => (
          // {`Choice ${index + 1}`}
          <label className="text-accent-6 ">
            Choice {index + 1}:
            <li key={index} className="flex justify-between">
              <input
                type="text"
                value={choice}
                onChange={(e) => handleQuizChoiceChange(index, e.target.value)}
                placeholder={`Choice ${index + 1}`}
                className="mt-1 border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6  rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
              />
              <Trash
                onClick={() => {
                  // Add a function to handle removing choices
                  setQuizChoices(quizChoices.filter((_, i) => i !== index));
                }}
                className="text-red-600 hover:text-red-700 hover:cursor-pointer transition-all mt-1"
                weight="fill"
                size={22}
              />
            </li>
          </label>
        ))}
      </ul>
      {/* choose the correct answer on the dropdown */}
      <label className="text-accent-6 ">
        Correct Answer:
        <select
          value={correctAnswer}
          className="mt-1 border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6  rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3 cursor-pointer"
          onChange={(e) => handleCorrectAnswerChange(e.target.value)}
          required
        >
          <option value="">Select the correct answer</option>
          {quizChoices.map((a, index) => (
            <option key={index} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  const renderSequenceForm = () => (
    <div className="pb-4">
      <div className="flex flex-col items-center w-[100%] gap-1">
        <input
          type="text"
          value={currentSequenceItem}
          onChange={handleSequenceInputChange}
          placeholder="Enter sequence item"
          className="border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6 rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
        />

        <div className="flex justify-between items-center gap-2 mt-2 w-[80%] mx-auto">
          <button
            onClick={handleAddSequenceItem}
            className="flex gap-1 text-sm items-center text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
          >
            <PlusCircle
              className="text-primary-6 transition-all"
              size={16}
              weight="fill"
            />
            Add
          </button>
          <button
            onClick={handleAddSequenceElement}
            className="flex gap-1 items-center text-sm text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
          >
            <File
              className="text-primary-6 transition-all"
              size={16}
              weight="fill"
            />
            Save
          </button>
        </div>
      </div>
      <ul className="pt-4 w-[100%] cursor-pointer overflow-y-auto">
        {sequenceItems.map((item, index) => (
          <label className="text-accent-6 ">
            Sequence Item {index + 1}:
            <li
              key={index}
              className="flex justify-between border border-accent-6 rounded px-2 py-1 bg-secondary-4 text-primary-6"
            >
              {item}{" "}
              <span>
                <Trash
                  onClick={() => handleDeleteSequenceItem(index)}
                  className="text-red-600 hover:text-red-700 hover:cursor-pointer transition-all"
                  weight="fill"
                  size={22}
                />
              </span>
            </li>
          </label>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="bg-secondary-1  w-[77%] mx-auto rounded-lg px-4 mt-3">
      <p className="font-nokia-Bold py-2 text-accent-6 text-center text-lg">
        Insert Element
      </p>
      <div className="flex justify-between pb-4">
        <select
          name="elements"
          id="elements"
          value={currentElement}
          onChange={handleDropdownChange}
          className="w-[90%] mx-auto border-2 border-accent-6 bg-primary-6 rounded-md mr-2 py-1 px-2 cursor-pointer"
        >
          <option value="" disabled>
            Choose Type
          </option>
          <option value="title">Title</option>
          <option value="sub">Sub-title</option>
          <option value="text">Paragraph</option>
          <option value="slide">Slide</option>
          <option value="img">Image</option>
          <option value="quiz">Quiz</option>
          <option value="list">List</option>
          <option value="accordion">Accordion</option>
          <option value="sequence">Sequence</option>
        </select>
        <button
          onClick={handleAddButtonClick}
          className=" px-2 font-semibold text-primary-6 bg-accent-6 rounded-md hover:bg-accent-7 hover:cursor-pointer transition-all"
        >
          Add
        </button>
      </div>

      {currentElement === "list" && renderListForm()}
      {currentElement === "slide" && renderSlideForm()}
      {currentElement === "quiz" && renderQuizForm()}
      {currentElement === "accordion" && renderAccordionForm()}
      {currentElement === "sequence" && renderSequenceForm()}

      {elements.map((element, index) => (
        <div key={index} className="py-2">
          <div className="flex flex-col justify-between pb-2">
            <div className="flex justify-between">
              <label className="text-accent-6 font-bold mb-1">
                {element.type}
              </label>
              <Trash
                onClick={() => handleDeleteButtonClick(element.id)}
                className="text-red-600 hover:text-red-700 hover:cursor-pointer transition-all"
                weight="fill"
                size={18}
              />
            </div>
            {element.type === "img" ? (
              <input
                type="file"
                id={element.id}
                onChange={(e) => handleFileInputChange(e, element.id)}
                className="w-[100%] border-2 border-accent-6 rounded-md file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm  text-secondary-6 font-bold p-2 file:bg-accent-6 file:text-primary-6 file:font-nokia-bold  hover:file:bg-accent-7 rounded-xs bg-transparent
                focus:outline-none focus:border-accent-8 cursor-pointer"
              />
            ) : (
              <input
                id={element.id}
                placeholder={`Enter ${element.type}`}
                value={
                  element.type === "quiz"
                    ? element.value?.question?.toString()
                    : element.value?.toString()
                }
                onChange={(e) => handleInputChange(element.id, e.target.value)}
                className="w-[100%] border border-accent-5 rounded-md text-accent-6 outline-accent-6 bg-primary-4 font-bold px-2 py-1 placeholder:text-sm placeholder:text-secondary-3"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ElementsAdd;
