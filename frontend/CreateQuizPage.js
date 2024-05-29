import { useState } from "react";
import apiService from "../../services/apiService";
import styled from "styled-components";
import { IoIosAdd } from "react-icons/io";
import BackButton from "../../components/BackButton";
import CreateQuizQuestion from "./components/CreateQuizQuestion";
import { BlurBackground } from "../../styles/BlurBackground.styled";

export default function CreateQuizPage() {
  const [quizData, setQuizData] = useState({
    name: "",
    description: "",
    type: "",
    questions: [],
    solution: "",
  });

  //a state for my question array
  const [questions, setQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [popUp, setPopUp] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (event) => {
    setQuizData({ ...quizData, [event.target.name]: event.target.value });
  };

  //Checks if any option is selected for a specific question and pushes the index of selected one to seleectedIndices array
  const handleSaveQuestion = (questionNumber, question, options) => {
    // Find the indices(index) of all selected options, if its true execute the block of code
    const selectedIndices = options.reduce((indices, option, index) => {
      if (option.isSelected) {
        indices.push(index);
      }
      return indices;
    }, []);

    // Update the quizData state with the new question and solution
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionNumber - 1] = {
      question,
      options,
      solution: selectedIndices,
    };
    setQuizData({ ...quizData, questions: updatedQuestions });
    console.log("kör handleSaveQuestion ");
  };

  //a function to add a new question to the array with an unique id
  const handleAddQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: "",
      questions: ["", "", "", ""],
      solution: "",
      option: ["", Boolean],
    };
    setQuestions([...questions, newQuestion]);
    setIsExpanded(setIsExpanded);
    console.log("kör handleAddQuestion");
  };

  //handleSubmit is responsible for making the API request to save the quiz data when click on spara quiz
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("quizData", quizData);

    if (quizData.name.trim() === "") {
      setPopUp("Fyll i namnfältet för quiz");
      return;
    }

    if (!quizData.questions || quizData.questions.length === 0) {
      setPopUp("Lägg till minst en fråga");
      return;
    }

    // Check if question input is empty
    // const questionInputValue = quizData.questions.some(
    //   (question) => question.question.trim() === ''
    // )
    // if (questionInputValue) {
    //   setPopUp('skapa en fråga')
    //   return
    // }
    // Check if options array is empty or any option text is empty for any question
    //using the some method to check if my question passes any of the test  in my questions array. It checks if the option array is empty or if any option dont have text after deleting whitespace. If non of the element passes the test the function will render a popup state
    const noOptionsAdded = quizData.questions.some(
      (question) =>
        question.options.length === 0 ||
        question.options.some((option) => option.text.trim() === "")
    );
    if (noOptionsAdded) {
      setPopUp("lägg till svarsalternativ till frågan");
      return;
    }
    // Check if any question has no selected option
    const noOptionSelected = quizData.questions.some(
      (question) =>
        question.options.reduce((indices, option) => {
          if (option.isSelected) {
            indices.push(option);
          }
          return indices;
        }, []).length === 0
    );
    if (noOptionSelected) {
      setPopUp("Bocka för ett svartsalternativ som är rätta svaret");
      return;
    }

    try {
      const data = await apiService.makeRequest("quizzes", {
        method: "POST",
        body: JSON.stringify(quizData),
      });
      console.log(data);
      setQuizzes([...quizzes, quizData]);
      setPopUp("Du har skapat ett quiz");
      //reseting the expanded container
      setIsExpanded(false);
      //resetng the quizData after creating a quiz
      setQuizData({
        name: "",
        description: "",
        type: "",
        questions: [],
        solution: "",
      });
      setQuestions([]);
    } catch (error) {
      console.error("Misslyckades till att skapa ett quiz", error);
      if (error.response && error.response.status === 400) {
        setPopUp("Quiz namnet finns redan");
      } else {
        setPopUp("Ett fel inträffade, försök igen");
      }
    }
  };

  return (
    <Container>
      <QuizHeaderWrapper>
        <HeaderQuiz>Quizzes</HeaderQuiz>
        <HeaderQuizParagrah>Skapa quiz</HeaderQuizParagrah>
      </QuizHeaderWrapper>
      <BackButton />
      <NameQuizField
        type="text"
        placeholder="Namn på quiz"
        value={quizData.name}
        onChange={handleInputChange}
        name="name"
      ></NameQuizField>
      {popUp && (
        <BlurBackground>
          <PopupContainer>
            <Popup>
              {popUp && <p>{popUp}</p>}
              <OkButton onClick={() => setPopUp(false)}>OK</OkButton>
            </Popup>
          </PopupContainer>
        </BlurBackground>
      )}
      <AddQuestionContainer>
        <p>Lägg till fråga</p>
        <AddQuestionBtn onClick={handleAddQuestion}>
          <IoIosAdd />
        </AddQuestionBtn>
      </AddQuestionContainer>
      {/*using map here is for seperating CreateQuizQuestion component for each question in the questions array*/}
      {questions.map((question, index) => (
        <CreateQuizQuestion
          key={question.id}
          questionNumber={index + 1}
          onSave={handleSaveQuestion}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          //These props are being passed down from the parent component to the CreateQuizQuestion child component.
          //They are functions defined here in the parent component and passed down so that the child component can use them.
        />
      ))}
      <SaveBtn>
        <SaveQuiz onClick={(event) => handleSubmit(event)}>Spara quiz</SaveQuiz>
      </SaveBtn>
    </Container>
  );
}

const Container = styled.main`
  padding: 1rem;
  max-width: 1300px;
  width: 100%;
  padding-top: 40px;
  margin: auto;
`;

const QuizHeaderWrapper = styled.hgroup`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const HeaderQuiz = styled.h1`
  font-size: 35px;
`;

const HeaderQuizParagrah = styled.p`
  text-align: center;
  color: #000;
  font-weight: 500;
  font-size: 20px;
  margin-top: 8px;
`;

const NameQuizField = styled.input`
  width: 100%;
  height: 60px;
  border-radius: 5px;
  background-color: #2f4656;
  border: none;
  font-size: 20px;
  color: white;
  padding: 8px;
  margin-top: 20px;

  &::placeholder {
    color: #fff;
  }
`;

const AddQuestionBtn = styled(IoIosAdd)`
  border-radius: 1px;
  width: 32px;
  height: 24px;
  background-color: #d48f23;
  border: none;
  border-radius: 5px;
`;

const AddQuestionContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px 0;
`;
const SaveBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SaveQuiz = styled.button`
  width: 105px;
  height: 30px;
  border-radius: 5px;
  background-color: #6eab6d;
  font-size: 15px;
  border: none;
`;
const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 250px;
  z-index: 10;
  padding: 0 10%;

  @media (min-width: 768px) {
    padding: 0;
    width: 430px;
  }
`;

const Popup = styled.div`
  width: 100%;
  min-height: 250px;
  background-color: #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  box-shadow: 0px 4px 3px 0px rgba(0, 0, 0, 0.2);

  p {
    font-size: 25px;
    font-weight: bold;
    text-align: center;
  }
`;

const OkButton = styled.button`
  color: #000;
  background-color: #6eab6d;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 20px;
  cursor: pointer;
  width: 165px;
  height: 45px;
  font-size: 25px;
  filter: brightness(90%);
`;
