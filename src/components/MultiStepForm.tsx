import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { Steps } from "headless-stepper";
import { useStepper } from "headless-stepper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// type FormState = {
//   you: {
//     value: YouForm;
//   };
//   course: {
//     value: CourseForm | LoanForm;
//   };
//   loan: {
//     value: LoanForm;
//   };
// };

type FormState2 =
  | {
      student: "current";
      plan: "plan1" | "plan2" | "plan3" | "plan4" | "plan5";
      data?: CourseFormData;
    }
  | {
      student: "graduate";
      plan: "plan1" | "plan2" | "plan3" | "plan4" | "plan5";
      data?: LoanFormData;
    };

// const FORM_STATE: FormState = {
//   you: {
//     value: {
//       student: "current",
//       plan: "plan5",
//     },
//   },
//   // for prospective and current students
//   course: {
//     value: {
//       courseLength: 0,
//       courseStartYear: 0,
//       yearlyMaintenance: 0,
//     },
//   },
//   loan: {
//     value: {
//       graduatingYear: 0,
//       currentLoanBalance: 0,
//     },
//   },
// };

const FORM_STATE2: FormState2 = {
  student: "current",
  plan: "plan5",
};

type FormStateContext = {
  form: FormState2;
  setForm: Dispatch<SetStateAction<FormState2>>;
};

const FormStateContext = createContext<FormStateContext | null>(null);

function SecondStep(student: "current" | "graduate", props: SubFormProps) {
  if (student === "current") {
    return (
      <CourseForm
        form={props.form}
        setForm={props.setForm}
        onNext={props.onNext}
        onPrev={props.onPrev}
      />
    );
  } else if (student === "graduate") {
    return (
      <LoanForm
        form={props.form}
        setForm={props.setForm}
        onNext={props.onNext}
        onPrev={props.onPrev}
      />
    );
  }
}

export const MultiStepForm = () => {
  const [form, setForm] = useState<FormState2>(FORM_STATE2);

  const steps: Steps[] = useMemo(
    () => [
      {
        label: "You",
        key: "you",
      },
      { label: "Course", key: "course" },
      { label: "Complete", key: "complete" },
    ],
    []
  );

  const { state, nextStep, prevStep, stepsProps, stepperProps } = useStepper({
    steps,
  });

  useEffect(() => {
    if (state.currentStep === 2) console.log(form);
  }, [state.currentStep, form]);

  return (
    <div className="p-8">
      <nav className="flex gap-4" {...stepperProps}>
        {stepsProps?.map((step, index) => (
          <div
            key={index}
            className={
              state.currentStep === index
                ? "border-slate-400 bg-sky-400 p-2"
                : "border-slate-400 p-2"
            }
            // {...step}
          >
            {steps[index]?.label}
          </div>
        ))}
      </nav>

      {state.currentStep === 0 && (
        <YouForm form={form} setForm={setForm} onNext={nextStep} />
      )}
      {state.currentStep === 1 &&
        SecondStep(form.student, {
          form,
          setForm,
          onNext: nextStep,
          onPrev: prevStep,
        })}
      {state.currentStep === 2 && <pre>{JSON.stringify(form, null, 2)}</pre>}
    </div>
  );
};

type SubFormProps = {
  form: FormState2;
  setForm: Dispatch<SetStateAction<FormState2>>;
  onNext: () => void;
  onPrev?: () => void;
};

const YouSchema = z.object({
  student: z.enum(["current", "graduate"]),
  plan: z.enum(["plan1", "plan2", "plan3", "plan4", "plan5"]),
});

type YouFormData = z.infer<typeof YouSchema>;

function YouForm(props: SubFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<YouFormData>({
    defaultValues: { student: props.form.student, plan: props.form.plan },
    resolver: zodResolver(YouSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(({ student, plan }) => {
        props.setForm({
          student,
          plan,
        });
        props.onNext();
      })}
    >
      <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium dark:text-white">
            Current or grad?
          </label>
          <label htmlFor="student-current">Current</label>
          <input
            type="radio"
            value="current"
            id="student-current"
            {...register("student")}
          />
          <label htmlFor="student-graduate">Graduate</label>
          <input
            type="radio"
            value="graduate"
            id="student-graduate"
            {...register("student")}
          />
        </div>

        <div>
          <label
            htmlFor="plan"
            className="mb-2 block text-sm font-medium dark:text-white"
          >
            Plan:
          </label>
          <select
            id="plan"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
            {...register("plan")}
          >
            <option value="plan1">Plan 1</option>
            <option value="plan2">Plan 2</option>
            <option value="plan3">Plan 3</option>
            <option value="plan4">Plan 4</option>
            <option value="plan5">Plan 5</option>
          </select>
        </div>
        <button type="submit">Next</button>
      </div>
    </form>
  );
}

const CourseSchema = z.object({
  courseLength: z.coerce.number().min(1).max(10),
  courseStartYear: z.coerce
    .number()
    .min(1980)
    .max(new Date().getFullYear() + 10),
  yearlyMaintenance: z.coerce.number().min(0),
});

type CourseFormData = z.infer<typeof CourseSchema>;

const CourseForm = (props: SubFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(CourseSchema),
  });

  return (
    <form
      onSubmit={handleSubmit((value) => {
        if (props.form.student === "current") {
          props.setForm({
            ...props.form,
            data: value,
          });
        }
        props.onNext();
      })}
    >
      <div className="flex flex-row gap-6 p-4">
        <label htmlFor="course-length">Course Length</label>
        <input
          type="number"
          placeholder="2023"
          id="course-length"
          {...register("courseLength")}
        />
        <div>
          <label
            htmlFor="starting-year"
            className="mb-2 block text-sm font-medium dark:text-white"
          >
            Starting Year
          </label>
          <input
            type="text"
            placeholder="2023"
            id="starting-year"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
            {...register("courseStartYear")}
          />
        </div>
        <label htmlFor="yearly-maintenance">Yearly maintenance</label>
        <input
          type="number"
          placeholder="7000"
          id="yearly-maintenance"
          {...register("yearlyMaintenance")}
        />
        <button type="submit">Next</button>
        <button onClick={props.onPrev}>Back</button>
      </div>
    </form>
  );
};

const LoanSchema = z.object({
  currentLoanBalance: z.coerce.number().positive(),
  graduatingYear: z.coerce
    .number()
    .min(1980)
    .max(new Date().getFullYear() + 10),
});

type LoanFormData = z.infer<typeof LoanSchema>;

function LoanForm(props: SubFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormData>({
    resolver: zodResolver(LoanSchema),
  });

  return (
    <form
      onSubmit={handleSubmit((value) => {
        if (props.form.student === "graduate") {
          props.setForm({
            ...props.form,
            data: value,
          });
        }
        props.onNext();
      })}
    >
      <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6">
        <div>
          <label
            htmlFor="loanBalance"
            className="mb-2 block text-sm font-medium dark:text-white"
          >
            Current Loan Balance:
          </label>
          <input
            type="number"
            id="loanBalance"
            placeholder="£"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
            {...register("currentLoanBalance")}
          />
          {errors.currentLoanBalance && (
            <span className="mt-2 block text-sm text-amber-300">
              {errors.currentLoanBalance?.message}
            </span>
          )}
        </div>
        <div>
          <label
            htmlFor="graduatingYear"
            className="mb-2 block text-sm font-medium dark:text-white"
          >
            Graduating Year:
          </label>
          <input
            type="datetime"
            id="graduatingYear"
            placeholder="2023"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
            {...register("graduatingYear")}
          />
          {errors.graduatingYear && (
            <span className="mt-2 block text-sm text-amber-300">
              {errors.graduatingYear?.message}
            </span>
          )}
        </div>
        <button type="submit">Next</button>
        <button onClick={props.onPrev}>Back</button>
      </div>
    </form>
  );
}
