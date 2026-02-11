import { MultiStepFormStep } from "@/components/MultiStepForm";
import React from "react";
import { StepSurveyItem } from "../components/StepSurveyItem";

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
  return questions.map((question, index) => {
    return {
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
    };
  });
};
