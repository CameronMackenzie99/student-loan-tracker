import type { FormDataType } from "./MultiStepForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";

type InputSummaryProps = {
  form: FormDataType;
  setStep: (step: number) => void;
};

export const InputSummary = ({ form, setStep }: InputSummaryProps) => {
  if (!form.data) throw new Error("data undefined");
  let totalLoan: number;
  if (form.student === "current") {
    totalLoan =
      (form.data.yearlyTuition + form.data.yearlyMaintenance) *
      form.data.courseLength;
  } else {
    totalLoan = form.data.currentLoanBalance;
  }

  function restartForm() {
    setStep(0);
  }
  return (
    <>
      <div>
        <div className="mb-4 flex gap-2">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Your total amount borrowed is:
          </h3>
          <p className="text-xl text-muted-foreground">£ {totalLoan}</p>
        </div>
      </div>
      <Button onClick={restartForm}>Restart</Button>
      <Accordion type="single">
        <AccordionItem value="assumptions">
          <AccordionTrigger>
            What assumptions does this tool make?
          </AccordionTrigger>
          <AccordionContent>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              The largest source of uncertainty comes from the interest rates of
              the loan. The tool takes the current interest rate that is applied
              to each loan type, and uses that to calculate the first row(s). It
              then takes a value of 3.4% as an average interest rate in the UK
              over{" "}
              <a
                href="https://www.propertyinvestmentproject.co.uk/property-statistics/uk-interest-rate-history-graph/"
                className="font-medium text-primary underline underline-offset-4"
              >
                the last 20 years
              </a>{" "}
              for the remaining projection. This is applied no matter the loan
              type but could make a large difference if interest rates are very
              high in the earlier years of your loan.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="interest">
          <AccordionTrigger>
            Why is my loan balance more than I borrowed when I graduate?
          </AccordionTrigger>
          <AccordionContent>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Your student loan accumulates interest while you are studying,
              until the April after you graduate. At this point you are eligible
              to start repayments if you are earning over the{" "}
              <a
                href="https://www.gov.uk/repaying-your-student-loan/what-you-pay"
                className="font-medium text-primary underline underline-offset-4"
              >
                repayment threshold for your plan type.
              </a>
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
