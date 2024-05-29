import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SlArrowDown } from "react-icons/sl";
import { IoIosAdd } from "react-icons/io";
// import { MdEdit } from 'react-icons/md'
import { FaTrash } from "react-icons/fa";
import { IoIosCheckbox } from "react-icons/io";
import { IoIosCheckboxOutline } from "react-icons/io";

export default function CreateQuizQuestion({
  questionNumber,
  onSave,
  isExpanded,
  setIsExpanded,
}) {
  // const [isExpanded, setIsExpanded] = useState(false)
  const [options, setOptions] = useState([{ text: "", isSelected: false }]);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [questionInputValue, setQuestionInputValue] = useState("");
  // const [isSelected, setSelection] = useState(false)

  //call the onSave function everytime the values, questionInputValue and option changes. when something changes in the child component call the onSave so the parent component can handle it.
  //the dependency array contain a list of variabels the effect depend on, when they change react will run the onSave function

  //I have addade the initaRender state to true.So when the !isInitialRender(is not true), the useEffect is not initaly calling(onSave). OnSave is being called only when needed, re-renders when changes are made in the properties. Else setIsInitialRender(false) it has already completed its inital render

  useEffect(() => {
    if (!isInitialRender) {
      onSave(questionNumber, questionInputValue, options);
    } else {
      setIsInitialRender(false);
    }
  }, [questionInputValue, options]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    console.log("kör toggleExpanded");
  };

  // This function adds a new option to the 'options' state variable.
  // Each option is an object with two properties:
  // 'text': the text of the option, as an empty string.
  // 'isSelected': a boolean saying whether this option is the correct answer
  // By setting 'isSelected' to false saying that by default a new option is not the correct answer.
  const handleAddOption = () => {
    // setOptions([...options, '', Boolean])
    setOptions([...options, { text: "", isSelected: false }]);

    console.log(options);
    console.log("kör handleAddOption");
  };

  const handleSelectionChange = (index, isSelected) => {
    // takes two parameter
    const updatedOptions = [...options]; //creates a new array that is a copy of the option array
    updatedOptions[index].isSelected = isSelected; //updates the isSelected property of the option at the given index in the array. isSelected parameter is a boolean value saying  wheter the checkbox for the option should be selected
    setOptions(updatedOptions); //updates the state of options with the updatedOptions array
    console.log("kör handleSelectionChange");
  };

  //this function is used to update the text of an option at a given index.
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
    console.log("kör handleOptionChange");
  };

  //this function is to erase an option field
  const handleDeleteOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  return (
    <Container>
      <QuestionContainer>
        <p>Fråga {questionNumber}</p>
        <ArrowIcon onClick={toggleExpanded}>
          <SlArrowDown />
        </ArrowIcon>
      </QuestionContainer>

      {isExpanded && (
        <CreateQuestion>
          <QuestionInput
            type="text"
            placeholder="Fråga"
            value={questionInputValue}
            onChange={(e) => {
              console.log("Input value:", e.target.value);
              setQuestionInputValue(e.target.value);
            }}
          />
          <AddAnswereOptions>
            <p>Lägg till svarsalternativ</p>
            <AddOptionsBtn onClick={handleAddOption}>
              <IoIosAdd />
            </AddOptionsBtn>
          </AddAnswereOptions>

          {options.map((option, index) => (
            <OptionsField key={index}>
              <DesignContainers
                onClick={() => handleSelectionChange(index, !option.isSelected)}
              >
                {option.isSelected ? (
                  <IoIosCheckbox />
                ) : (
                  <IoIosCheckboxOutline />
                )}
              </DesignContainers>
              <OptionInput
                type="text"
                placeholder="..."
                value={options.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />

              <ChangeBtn onClick={() => handleDeleteOption(index)}>
                <FaTrash />
              </ChangeBtn>
            </OptionsField>
          ))}
        </CreateQuestion>
      )}
    </Container>
  );
}

const Container = styled.section`
  padding: 1rem;
`;
const QuestionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  border-radius: 10px;
  background-color: #cee1eb;
  border: none;
  font-size: 20px;
  align-items: center;
  padding: 8px;

  p {
    color: 000;
    font-weight: bold;
  }
`;
const ArrowIcon = styled.div`
  cursor: pointer;
`;
const CreateQuestion = styled.form`
  width: 100%;
  height: 480px;
  border-radius: 10px;
  background-color: #cee1eb;
  border: none;
  font-size: 20px;
  color: white;
  padding: 8px;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QuestionInput = styled.input`
  width: 390px;
  height: 40px;
  background-color: #2f4656;
  color: white;
  border: none;
  padding: 8px;
  margin-top: 2rem;

  &::placeholder {
    color: #fff;
  }
`;
const AddOptionsBtn = styled(IoIosAdd)`
  border-radius: 1px;
  width: 32px;
  height: 24px;
  border: 1px solid;
  background-color: #d48f23;
  border-radius: 5px;
  border: none;
`;

const AddAnswereOptions = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px 0;
  gap: 12rem;
  font-size: 15px;
  color: #000;
`;
const OptionsField = styled.div`
  display: flex;
  color: #000;
  position: relative;
  align-items: center;
`;

const OptionInput = styled.input`
  width: 340px;
  height: 30px;
  padding: 5px;
`;
const ChangeBtn = styled.div`
  position: absolute;
  right: 8px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const DesignContainers = styled.div`
  width: 35px;
  height: 30px;
  /* background-color: #7194ad; */
  margin: 5px;
  border-radius: 5px;
  display: flex;
  /* flex: 1; */
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
