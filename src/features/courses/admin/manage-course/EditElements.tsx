import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addElementToSlide,
  updateElement,
  deleteElement,
  selectChapters,
  Chapter,
} from "@/redux/courseSlice";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";
import CustomTextarea from "@/components/CustomTextarea";
import CustomInput from "@/components/CustomInput";

interface EditElementsProps {
  chapterIndex: number;
  slideIndex: number;
}

function EditElements({ chapterIndex, slideIndex }: EditElementsProps) {
  const dispatch = useDispatch();

  const chapters = useSelector(selectChapters) as Chapter[];
  const elements = chapters[chapterIndex]?.slides[slideIndex]?.elements || [];

  const [currentElement, setCurrentElement] = useState<string>("");

  //List items related functions
  const [listItems, setListItems] = useState<string[]>([]);
  const [currentListItem, setCurrentListItem] = useState("");

  const handleListInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentListItem(event.target.value);
  };

  const handleAddListItem = () => {
    if (currentListItem) {
      setListItems([...listItems, currentListItem]);
      setCurrentListItem("");
    }
  };

  const saveListElementToRedux = () => {
    if (listItems.length > 0) {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: "list",
          value: listItems, // Pass the array of list items as value
        })
      );
      setListItems([]); // Clearing list items after adding
    }
    setCurrentElement("");
    console.log(elements);
  };

  const handleDeleteListItem = (indexToDelete: number) => {
    const updatedLists = listItems.filter(
      (_, index) => index !== indexToDelete
    );
    setListItems(updatedLists);
  };

  const renderListForm = () => (
    <div className="pb-4">
      <div className="flex flex-col items-center w-[100%] gap-1">
        <CustomInput
          type="text"
          value={currentListItem}
          onChange={handleListInputChange}
          placeholder="Enter list item"
          className="border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6 rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
          maxLength={100}
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
            onClick={saveListElementToRedux}
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

  const handleFileInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Get the first file from the CustomInput
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

  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentElement(e.target.value);
  };

  const handleAddButtonClick = () => {
    // Only dispatch addElementToSlide when the add button is clicked and currentElement is not "list"
    if (currentElement && currentElement !== "list" && "img") {
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

  //Slide items related functions
  const [slidesDetails, setSlidesDetails] = useState<string[]>([]);
  const [currentSlideDetails, setCurrentSlideDetails] = useState("");

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

  const renderSlideForm = () => (
    <div className="">
      <div className="flex flex-col items-center w-[100%] gap-1">
        <CustomTextarea
          value={currentSlideDetails}
          onChange={(e) => setCurrentSlideDetails(e.target.value)}
          placeholder="Enter slide details"
          className="border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6  rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
          maxLength={150}
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

  const [accordionTitles, setAccordionTitles] = useState<string[]>([]);
  const [accordionContents, setAccordionContents] = useState<string[]>([]);

  // Accordion related functions
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
      // setAccordionTitles([]);
      // setAccordionContents([]);
    }
    setCurrentElement("");
  };

  const renderAccordionForm = () => (
    <div className="pb-4">
      <div className="flex justify-between items-center gap-2 w-full py-4">
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
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-secondary-6 text-xl">
                Accordion {index + 1}:
              </h2>
              <Trash
                onClick={() => {
                  setAccordionTitles(
                    accordionTitles.filter((_, i) => i !== index)
                  );
                  setAccordionContents(
                    accordionContents.filter((_, i) => i !== index)
                  );
                }}
                className="text-secondary-6 hover:text-secondary-7 hover:cursor-pointer transition-all"
                weight="fill"
                size={18}
              />
            </div>
            <li
              key={index}
              className="flex flex-col mb-4 p-2 bg-secondary-2 w-full rounded-md border-secondary-4"
            >
              <label className="text-xs text-secondary-10 border border-secondary-3 w-fit px-1 rounded-t-md">
                TITLE
              </label>
              <CustomInput
                type="text"
                value={title}
                onChange={(e) =>
                  handleAccordionTitleChange(index, e.target.value)
                }
                placeholder={`Title ${index + 1}`}
                className="border outline-accent-6 border-secondary-3 bg-primary-1 text-secondary-6 rounded-b-md font-Lato-Regular px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-4"
                maxLength={50}
              />
              <label className="text-xs text-secondary-10 border border-secondary-3 w-fit px-1 mt-2 rounded-t-md">
                CONTENT
              </label>
              <CustomTextarea
                value={accordionContents[index]}
                onChange={(e) =>
                  handleAccordionContentChange(index, e.target.value)
                }
                placeholder={`Content ${index + 1}`}
                className="border outline-accent-6 border-secondary-3 bg-primary-1 text-secondary-6 rounded-b-md font-Lato-Regular px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-4"
                maxLength={200}
              />
            </li>
          </div>
        ))}
      </ul>
    </div>
  );

  // Quiz-related state and functions
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizChoices, setQuizChoices] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

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
      <div className="flex flex-col items-center w-[100%] gap-1">
        <CustomInput
          type="text"
          value={quizQuestion}
          onChange={handleQuizQuestionChange}
          placeholder="Enter quiz question"
          className="border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6  rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
          maxLength={150}
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
          <label className="text-accent-6 ">
            Choice {index + 1}:
            <li key={index} className="flex justify-between">
              <CustomInput
                type="text"
                value={choice}
                onChange={(e) => handleQuizChoiceChange(index, e.target.value)}
                placeholder={`Choice ${index + 1}`}
                className="mt-1 border-2 border-accent-6 rounded-md text-accent-6 font-bold px-2 py-1 w-[75%]"
                maxLength={50}
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

  // Sequence related functions
  const [sequenceItems, setSequenceItems] = useState<string[]>([]);
  const [currentSequenceItem, setCurrentSequenceItem] = useState("");

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

  const renderSequenceForm = () => (
    <div className="pb-4">
      <div className="flex flex-col items-center w-[100%] gap-1">
        <CustomInput
          type="text"
          value={currentSequenceItem}
          onChange={handleSequenceInputChange}
          placeholder="Enter sequence item"
          className="border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6 rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
          maxLength={100}
        />
        <div className="flex justify-between items-center gap-2 mt-2 w-[80%] mx-auto">
          <button
            onClick={handleAddSequenceItem}
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
            onClick={handleAddSequenceElement}
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
        {sequenceItems.map((item, index) => (
          <label className="text-accent-6 ">
            Sequence {index + 1}:
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

  // Reveal Related Functions
  const [revealTitles, setRevealTitles] = useState<string[]>([]);
  const [revealContents, setRevealContents] = useState<string[]>([]);

  const handleRevealTitleChange = (index: number, text: string) => {
    setRevealTitles(
      revealTitles.map((title, i) => (i === index ? text : title))
    );
  };

  const handleRevealContentChange = (index: number, text: string) => {
    setRevealContents(
      revealContents.map((content, i) => (i === index ? text : content))
    );
  };

  const handleAddRevealItem = () => {
    setRevealTitles([...revealTitles, ""]);
    setRevealContents([...revealContents, ""]);
  };

  const saveRevealToRedux = () => {
    if (revealTitles.length > 0 && revealContents.length > 0) {
      const revealItems = revealTitles.map((title, index) => ({
        title,
        content: revealContents[index],
      }));

      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: "reveal",
          value: revealItems,
        })
      );

      // Reset state
      setRevealTitles([]);
      setRevealContents([]);
    }
    setCurrentElement("");
  };

  const renderRevealForm = () => (
    <div className="pb-4">
      <div className="flex justify-between items-center gap-2 w-full">
        <button
          onClick={handleAddRevealItem}
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
          onClick={saveRevealToRedux}
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
      <ul className="pt-4 w-[100%] cursor-pointer overflow-y-auto">
        {revealTitles.map((title, index) => (
          <label className="text-accent-6 ">
            Reveal Item {index + 1}:
            <li key={index} className="flex flex-col space-y-2 mb-4">
              <CustomInput
                type="text"
                value={title}
                onChange={(e) => handleRevealTitleChange(index, e.target.value)}
                placeholder={`Title ${index + 1}`}
                className="mt-1  border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6 rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
                maxLength={50}
              />
              <CustomTextarea
                value={revealContents[index]}
                onChange={(e) =>
                  handleRevealContentChange(index, e.target.value)
                }
                placeholder={`Content ${index + 1}`}
                className="mt-1  border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6 rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
                maxLength={200}
              />
              <Trash
                onClick={() => {
                  setRevealTitles(revealTitles.filter((_, i) => i !== index));
                  setRevealContents(
                    revealContents.filter((_, i) => i !== index)
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

  // DND-related state and functions
  const [dndQuestion, setDndQuestion] = useState("");
  const [dndChoices, setDndChoices] = useState<string[]>([]);
  const [correctDndAnswer, setCorrectDndAnswer] = useState("");

  const handleDndQuestionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDndQuestion(event.target.value);
  };

  const handleDndChoiceChange = (index: number, text: string) => {
    setDndChoices(dndChoices.map((choice, i) => (i === index ? text : choice)));
  };

  const handleAddDndChoice = () => {
    setDndChoices([...dndChoices, ""]); // Adds a new empty choice
  };

  const handleCorrectDndAnswerChange = (value: string) => {
    setCorrectDndAnswer(value);
  };

  const saveDndToRedux = () => {
    if (dndQuestion && dndChoices.length > 0) {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: "dnd",
          value: {
            question: dndQuestion,
            choices: dndChoices.map((text) => ({ text })),
            correctDndAnswer,
          },
        })
      );
      // Reset quiz state
      setDndQuestion("");
      setDndChoices([]);
      setCorrectDndAnswer("");
    }
    setCurrentElement("");
  };

  const renderDndForm = () => (
    <div className="pb-4">
      <div className="flex flex-col items-center w-[100%] gap-1">
        <CustomInput
          type="text"
          value={dndQuestion}
          onChange={handleDndQuestionChange}
          placeholder="Enter quiz question"
          className="border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6  rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
          maxLength={150}
        />

        <div className="flex justify-between items-center gap-2 mt-2 w-[80%] mx-auto">
          <button
            onClick={handleAddDndChoice}
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
            onClick={saveDndToRedux}
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
        {/* // Map over dndChoices to render choices */}
        {dndChoices.map((choice, index) => (
          <label className="text-accent-6 ">
            Choice {index + 1}:
            <li key={index} className="flex justify-between">
              <CustomInput
                type="text"
                value={choice}
                onChange={(e) => handleDndChoiceChange(index, e.target.value)}
                placeholder={`Choice ${index + 1}`}
                className="mt-1 border-2 border-accent-6 rounded-md text-accent-6 font-bold px-2 py-1 w-[75%]"
                maxLength={50}
              />
              <Trash
                onClick={() => {
                  // Add a function to handle removing choices
                  setDndChoices(dndChoices.filter((_, i) => i !== index));
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
          value={correctDndAnswer}
          className="mt-1 border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6  rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3 cursor-pointer"
          onChange={(e) => handleCorrectDndAnswerChange(e.target.value)}
          required
        >
          <option value="">Select the correct answer</option>
          {dndChoices.map((a, index) => (
            <option key={index} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  return (
    <div className="bg-secondary-1 w-full h-full px-4 border border-secondary-3 overflow-y-auto scrollbar-thin">
      <p className="font-bold py-2 text-accent-6 text-center text-lg">
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
          <option value="reveal">Reveal</option>
          <option value="range">Range</option>
          <option value="dnd">Missing Words</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
        </select>
        <button
          onClick={handleAddButtonClick}
          className="px-2 font-semibold text-white bg-accent-6 rounded-md hover:bg-accent-7"
        >
          Add
        </button>
      </div>

      {currentElement === "list" && renderListForm()}
      {currentElement === "slide" && renderSlideForm()}
      {currentElement === "accordion" && renderAccordionForm()}
      {currentElement === "quiz" && renderQuizForm()}
      {currentElement === "sequence" && renderSequenceForm()}
      {currentElement === "reveal" && renderRevealForm()}
      {currentElement === "dnd" && renderDndForm()}

      {elements.map((element, index) => (
        <div key={index} className="py-2">
          <div className="flex flex-col justify-between pb-2">
            <div className="flex justify-between items-center border-b-2 border-secondary-3 px-1 mb-1">
              <label className="text-accent-6 font-bold">{element.type}</label>
              <Trash
                onClick={() => handleDeleteButtonClick(element.id)}
                className="text-red-600 hover:text-red-700 hover:cursor-pointer transition-all"
                weight="fill"
                size={18}
              />
            </div>
            {element.type === "img" || element.type === "audio" ? (
              <CustomInput
                type="file"
                id={element.id}
                onChange={(e) => handleFileInputChange(e, element.id)}
                className="w-[100%] border-2 border-accent-6 rounded-md file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm  text-secondary-6 font-bold p-2 file:bg-accent-6 file:text-primary-6 file:font-nokia-bold  hover:file:bg-accent-7 rounded-xs bg-transparent
                focus:outline-none focus:border-accent-8 cursor-pointer"
              />
            ) : element.type === "range" ? null : (
              <CustomTextarea
                id={element.id}
                placeholder={`Enter ${element.type}`}
                value={
                  element.type === "quiz" || element.type === "dnd"
                    ? element.value?.question?.toString()
                    : element.value?.toString()
                }
                onChange={(e) => handleInputChange(element.id, e.target.value)}
                className="w-[100%] border border-accent-5 rounded-md text-accent-6 outline-accent-6 bg-primary-4 font-bold px-2 py-1 placeholder:text-sm placeholder:text-secondary-3"
                maxLength={300}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default EditElements;
