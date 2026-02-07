import { MultiStepFormStep } from "@/components/MultiStepForm";
import React from "react";
import { StepPaywall } from "../components/StepPaywall";
import { StepRateUs } from "../components/StepRateUs";
import { StepSurveyItem } from "../components/StepSurveyItem";

interface SurveyOption {
  icon: string;
  label: string;
  value: string;
}

interface SurveyQuestion {
  key: string;
  title: string;
  type: "single_select" | "multi_select";
  options: SurveyOption[];
  isRequired: boolean;
}

export const createSurveySteps = ({
  questions,
  onFinish,
}: {
  questions: SurveyQuestion[];
  onFinish: () => void;
}): MultiStepFormStep[] => {
  const dynamicSteps: MultiStepFormStep[] = questions.map((question) => {
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
          isLastStep={false}
          direction="forward"
        />
      ),
    };
  });

  return [
    ...dynamicSteps,
    {
      id: "rate_us",
      title: "Uygulamamızı Puanlayın",
      fields: [],
      shouldHandleNextStep: true,
      render: ({ nextStep }) => <StepRateUs onNext={nextStep} />,
    },
    {
      id: "paywall",
      title: "Chef AI Premium",
      fields: [],
      shouldHandleNextStep: true,
      render: () => <StepPaywall onFinish={onFinish} />,
    },
  ];
};
