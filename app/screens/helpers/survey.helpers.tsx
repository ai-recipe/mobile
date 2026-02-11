import { MultiStepFormStep } from "@/components/MultiStepForm";
import React from "react";
import { StepSurveyItem } from "../components/StepSurveyItem";
import { StepSurveyLoader } from "../components/StepSurveyLoader";

interface SurveyOption {
  icon: string;
  label: string;
  value: string;
}

interface SurveyQuestion {
  key: string;
  title: string;
  type: "single_select" | "multi_select" | "number_input";
  options: SurveyOption[];
  isRequired: boolean;
}

export const createSurveySteps = ({
  questions,
}: {
  questions: SurveyQuestion[];
}): MultiStepFormStep[] => {
  const steps: MultiStepFormStep[] = [];

  questions.forEach((question, index) => {
    // Add the question step
    steps.push({
      id: question.key,
      title: question.title,
      fields: [question.key],
      shouldHandleNextStep: true,
      render: ({ data, setValue, nextStep }) => (
        <StepSurveyItem
          question={question}
          value={data[question.key] || []}
          onChange={(answers) => setValue(question.key, answers)}
          onNext={nextStep}
          isLastStep={index === questions.length - 1}
          direction="forward"
        />
      ),
    });

    // Add a loader step every 5 questions, but not after the last question
    if ((index + 1) % 5 === 0 && index !== questions.length - 1) {
      steps.push({
        id: `loader-${index}`,
        title: "",
        fields: [],
        shouldHandleNextStep: true,
        dontShowBackButton: true,
        render: ({ nextStep }) => <StepSurveyLoader onNext={nextStep} />,
      });
    }
  });

  return steps;
};
