import {
  useState,
  ChangeEvent,
  // useEffect
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  // addElementToSlide,
  updateElement,
  deleteElement,
  CourseState,
  // selectElements,
} from "../../../../redux/courseSlice";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";
import List from "../../Elements/List";
// import { element } from "prop-types";

export interface ElementsAddProps {
  chapterIndex: number;
  slideIndex: number;
  // currentElement: string | null | string[] | boolean;
  setCurrentElement: React.Dispatch<
    React.SetStateAction<string | null | string[] | boolean>
  >;
}

function ElementsAdd({
  chapterIndex,
  slideIndex,
  // currentElement,
  setCurrentElement,
}: ElementsAddProps) {
  // console.log("chapter", chapterIndex);
  // console.log("slide", slideIndex);

  const dispatch = useDispatch();

  const chapters = useSelector(
    (state: { course: CourseState }) => state.course.chapters
  );
  const elements = chapters[chapterIndex]?.slides[slideIndex]?.elements || [];

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

  // Image preview state
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

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
        // Create a URL for the file
        const fileUrl = URL.createObjectURL(file);
        setImagePreviewUrl(fileUrl); // Set imagePreviewUrl state
      }
    }
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

  // Elements
  const [slidesDetails, setSlidesDetails] = useState<string[]>([]);
  const [currentSlideDetails, setCurrentSlideDetails] = useState<string>("");
  const [accordionTitles, setAccordionTitles] = useState<string[]>([]);
  const [accordionContents, setAccordionContents] = useState<string[]>([]);
  const [sequenceItems, setSequenceItems] = useState<string[]>([]);
  const [currentSequenceItem, setCurrentSequenceItem] = useState<string>("");
  const [revealTitles, setRevealTitles] = useState<string[]>([]);
  const [revealContents, setRevealContents] = useState<string[]>([]);

  // Slide related functions
  const handleAddSlide = () => {
    if (currentSlideDetails) {
      setSlidesDetails([...slidesDetails, currentSlideDetails]);
      setCurrentSlideDetails("");
    }
  };

  const handleSaveSlides = (id: string) => {
    dispatch(
      updateElement({
        chapterIndex,
        slideIndex,
        elementId: id,
        value: slidesDetails,
      })
    );
    // setSlidesDetails([]); // Clear slides details after adding
    setCurrentElement("");
  };

  const handleDeleteSlideItem = (indexToDelete: number) => {
    const updatedSlides = slidesDetails.filter(
      (_, index) => index !== indexToDelete
    );
    setSlidesDetails(updatedSlides);
  };

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

  const saveAccordionToRedux = (id: string) => {
    if (accordionTitles.length > 0 && accordionContents.length > 0) {
      const accordionItems = accordionTitles.map((title, index) => ({
        title,
        content: accordionContents[index],
      }));

      dispatch(
        updateElement({
          chapterIndex,
          slideIndex,
          elementId: id,
          value: accordionItems,
        })
      );

      // Reset accordion state
      // setAccordionTitles([]);
      // setAccordionContents([]);
    }
    setCurrentElement("");
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

  const saveQuizToRedux = (id: string) => {
    if (quizQuestion && quizChoices.length > 0) {
      dispatch(
        updateElement({
          chapterIndex,
          slideIndex,
          elementId: id,
          value: {
            question: quizQuestion,
            choices: quizChoices.map((text) => ({ text })),
            correctAnswer,
          },
        })
      );
      // Reset quiz state
      // setQuizQuestion("");
      // setQuizChoices([]);
      // setCorrectAnswer("");
    }
    setCurrentElement("");
  };

  // Sequence Related Functions.
  const handleSequenceInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentSequenceItem(event.target.value);
  };

  const handleAddSequenceItem = () => {
    if (currentSequenceItem) {
      setSequenceItems([...sequenceItems, currentSequenceItem]);
      setCurrentSequenceItem("");
    }
  };

  const handleAddSequenceElement = (id: string) => {
    if (sequenceItems.length > 0) {
      dispatch(
        updateElement({
          chapterIndex,
          slideIndex,
          elementId: id,
          value: sequenceItems,
        })
      );
      // setSequenceItems([]); // remove the lists
    }
    setCurrentElement("");
  };

  const handleDeleteSequenceItem = (indexToDelete: number) => {
    const updatedSequence = sequenceItems.filter(
      (_, index) => index !== indexToDelete
    );
    setSequenceItems(updatedSequence);
  };

  // Reveal Related Functions
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

  const saveRevealToRedux = (id: string) => {
    if (revealTitles.length > 0 && revealContents.length > 0) {
      const revealItems = revealTitles.map((title, index) => ({
        title,
        content: revealContents[index],
      }));

      dispatch(
        updateElement({
          chapterIndex,
          slideIndex,
          elementId: id,
          value: revealItems,
        })
      );

      // Reset state
      // setRevealTitles([]);
      // setRevealContents([]);
    }
    setCurrentElement("");
  };

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

  const saveDndToRedux = (id: string) => {
    if (dndQuestion && dndChoices.length > 0) {
      dispatch(
        updateElement({
          chapterIndex,
          slideIndex,
          elementId: id,
          value: {
            question: dndQuestion,
            choices: dndChoices.map((text) => ({ text })),
            correctDndAnswer,
          },
        })
      );
      // Reset quiz state
      // setDndQuestion("");
      // setDndChoices([]);
      // setCorrectDndAnswer("");
    }
    setCurrentElement("");
  };

  const uniqueKey = `${chapterIndex}-${slideIndex}`;

  const elementName = (elementType: string) => {
    switch (elementType) {
      case "title":
        return "Title";
      case "sub":
        return "Sub Title";
      case "text":
        return "Paragraph";
      case "img":
        return "Image";
      case "list":
        return "Bulleted list";
      case "slide":
        return "Horizontal series";
      case "quiz":
        return "Multiple choice";
      case "accordion":
        return "Expandable list";
      case "sequence":
        return "Sequence";
      case "reveal":
        return "Reveal";
      case "range":
        return "Slider";
      case "dnd":
        return "Missing Words";
      default:
        return "";
    }
  };

  // useEffect(() => {
  //   setCurrentElement("");
  // }, [chapterIndex, slideIndex]);

  // useEffect(() => {
  //   console.log("Effect ran: Checking new slide elements");
  //   const newSlideElements =
  //     chapters[chapterIndex]?.slides[slideIndex]?.elements || [];
  //   console.log("New slide elements:", newSlideElements);

  //   if (newSlideElements.length > 0) {
  //     console.log("First element type:", newSlideElements[[1]].type);
  //     setCurrentElement(newSlideElements[[1]].type);
  //   } else {
  //     console.log("No elements found, resetting currentElement");
  //     setCurrentElement("");
  //   }
  // }, [chapterIndex, slideIndex, chapters, setCurrentElement]);

  // console.log("Current element before rendering form:", currentElement);

  return (
    <div
      key={uniqueKey}
      className="bg-secondary-1 w-full h-full overflow-y-auto px-4 border border-secondary-3"
    >
      {elements.map((element, index) => {
        let elementComponent;
        if (
          element.type === "title" ||
          element.type === "sub" ||
          element.type === "text"
        ) {
          elementComponent = (
            <input
              id={element.id}
              placeholder={`Enter ${element.type}`}
              value={element.value?.toString()}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              className="w-[100%] border border-secondary-3 rounded-md outline-accent-6 bg-primary-4 p-2 my-3 placeholder:text-xl"
            />
          );
        } else if (element.type === "img") {
          elementComponent = (
            <div className="flex flex-col my-3 border-2 border-secondary-3 rounded-md hover:border-accent-5">
              <input
                type="file"
                id={element.id}
                onChange={(e) => handleFileInputChange(e, element.id)}
                className="w-[100%] file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0 text-sm
                file:text-lg  text-secondary-6 font-bold p-2 file:bg-accent-6
                file:text-primary-6 file:font-nokia-bold  hover:file:bg-accent-7
                rounded-xs bg-transparent hover:text-secondary-5
                focus:outline-none focus:border-accent-8 cursor-pointer"
              />

              {imagePreviewUrl && (
                <img
                  key={element.type}
                  src={imagePreviewUrl}
                  alt=""
                  className="rounded-b-md"
                />
              )}
            </div>
          );
        } else if (element.type === "list") {
          elementComponent = (
            <List
              key={index}
              chapterIndex={chapterIndex}
              slideIndex={slideIndex}
              setCurrentElement={setCurrentElement}
              element={element}
            />
          );
        } else if (element.type === "slide") {
          elementComponent = (
            <div id={element.id}>
              <div className="flex flex-col items-center w-[100%] gap-1 py-4">
                <textarea
                  value={currentSlideDetails}
                  onChange={(e) => setCurrentSlideDetails(e.target.value)}
                  placeholder="Enter slide details...."
                  className="border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md p-2 w-full placeholder:text-lg"
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
                    onClick={() => handleSaveSlides(element.id)}
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
        } else if (element.type === "quiz") {
          elementComponent = (
            <div id={element.id}>
              <div className="flex flex-col items-center w-[100%] gap-1 py-4">
                <input
                  type="text"
                  value={quizQuestion}
                  onChange={handleQuizQuestionChange}
                  placeholder="Enter quiz question"
                  className="border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md p-2 w-full placeholder:text-lg"
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
                    onClick={() => saveQuizToRedux(element.id)}
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
                      <input
                        type="text"
                        value={choice}
                        onChange={(e) =>
                          handleQuizChoiceChange(index, e.target.value)
                        }
                        placeholder={`Choice ${index + 1}`}
                        className="mt-1 border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6  rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
                      />
                      <Trash
                        onClick={() => {
                          // Add a function to handle removing choices
                          setQuizChoices(
                            quizChoices.filter((_, i) => i !== index)
                          );
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
              <div className="border-y-2 border-secondary-4 py-6">
                <h2 className="text-lg border border-secondary-3 w-fit px-1 bg-primary-4 rounded-md">
                  Correct Answer:
                </h2>
                <select
                  value={correctAnswer}
                  className="border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md text-lg font-Lato-Regular px-2 py-1 w-full placeholder:text-lg cursor-pointer"
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
              </div>
            </div>
          );
        } else if (element.type === "accordion") {
          elementComponent = (
            <div id={element.id}>
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
                  onClick={() => saveAccordionToRedux(element.id)}
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
        } else if (element.type === "sequence") {
          elementComponent = (
            <div id={element.id}>
              <div className="flex flex-col items-center w-[100%] gap-1 py-3">
                <input
                  type="text"
                  value={currentSequenceItem}
                  onChange={handleSequenceInputChange}
                  placeholder="Enter sequence item"
                  className="border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md p-2 w-full placeholder:text-lg"
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
                    onClick={() => handleAddSequenceElement(element.id)}
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
        } else if (element.type === "reveal") {
          elementComponent = (
            <div id={element.id}>
              <div className="flex justify-between items-center gap-2 w-full py-4">
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
                  onClick={() => saveRevealToRedux(element.id)}
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
                      <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                          handleRevealTitleChange(index, e.target.value)
                        }
                        placeholder={`Title ${index + 1}`}
                        className="mt-1  border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6 rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
                      />
                      <textarea
                        value={revealContents[index]}
                        onChange={(e) =>
                          handleRevealContentChange(index, e.target.value)
                        }
                        placeholder={`Content ${index + 1}`}
                        className="mt-1  border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6 rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
                      />
                      <Trash
                        onClick={() => {
                          setRevealTitles(
                            revealTitles.filter((_, i) => i !== index)
                          );
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
        } else if (element.type === "range") {
          elementComponent = null; // Here you can define what the 'range' type should render
        } else if (element.type === "dnd") {
          elementComponent = (
            <div id={element.id}>
              <div className="flex flex-col items-center w-[100%] gap-1 py-4">
                <input
                  type="text"
                  value={dndQuestion}
                  onChange={handleDndQuestionChange}
                  placeholder="Enter quiz question"
                  className="border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md p-2 w-full placeholder:text-lg"
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
                    onClick={() => saveDndToRedux(element.id)}
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
                      <input
                        type="text"
                        value={choice}
                        onChange={(e) =>
                          handleDndChoiceChange(index, e.target.value)
                        }
                        placeholder={`Choice ${index + 1}`}
                        className="mt-1 border-2 border-accent-6 rounded-md text-accent-6 font-bold px-2 py-1 w-[75%]"
                      />
                      <Trash
                        onClick={() => {
                          // Add a function to handle removing choices
                          setDndChoices(
                            dndChoices.filter((_, i) => i !== index)
                          );
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
              <div className="border-y-2 border-secondary-4 py-6">
                <h2 className="text-lg border border-secondary-3 w-fit px-1 bg-primary-4 rounded-md">
                  Correct Answer:
                </h2>
                <select
                  value={correctDndAnswer}
                  className="border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md text-lg font-Lato-Regular px-2 py-1 w-full placeholder:text-lg cursor-pointer"
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
              </div>
            </div>
          );
        }

        return (
          <div key={index} className="py-2">
            <div className="flex flex-col justify-between pb-2">
              <div className="flex justify-between items-center border-b-2 border-secondary-4 px-1 py-3 mb-1">
                <h2 className="text-secondary-7 font-bold text-xl">
                  {elementName(element.type)}
                </h2>
                <Trash
                  onClick={() => handleDeleteButtonClick(element.id)}
                  className="text-secondary-6 hover:text-secondary-7 hover:cursor-pointer transition-all"
                  weight="fill"
                  size={18}
                />
              </div>
              {elementComponent}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ElementsAdd;
