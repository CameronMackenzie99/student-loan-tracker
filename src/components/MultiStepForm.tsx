import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { Steps } from "headless-stepper";
import { useStepper } from "headless-stepper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

type FormState =
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

const FORM_STATE: FormState = {
  student: "current",
  plan: "plan5",
};

function RenderSecondStepForm(
  student: "current" | "graduate",
  props: SubFormProps
) {
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
  const [form, setForm] = useState<FormState>(FORM_STATE);

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
    <Card className="mx-auto w-2/3">
      <CardHeader>
        <nav className="flex justify-between px-20 py-4" {...stepperProps}>
          {stepsProps?.map((step, index) => (
            <div
              key={index}
              className={
                state.currentStep === index
                  ? "border-b border-slate-900 p-2"
                  : "p-2"
              }
              // {...step}
            >
              {steps[index]?.label}
            </div>
          ))}
        </nav>
      </CardHeader>
      <CardContent className="p-8">
        {state.currentStep === 0 && (
          <YouForm form={form} setForm={setForm} onNext={nextStep} />
        )}
        {state.currentStep === 1 &&
          RenderSecondStepForm(form.student, {
            form,
            setForm,
            onNext: nextStep,
            onPrev: prevStep,
          })}
        {state.currentStep === 2 && <pre>{JSON.stringify(form, null, 2)}</pre>}
      </CardContent>
    </Card>
  );
};

type SubFormProps = {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  onNext: () => void;
  onPrev?: () => void;
};

const YouSchema = z.object({
  student: z.enum(["current", "graduate"]),
  plan: z.enum(["plan1", "plan2", "plan3", "plan4", "plan5"]),
});

type YouFormData = z.infer<typeof YouSchema>;

function YouForm(props: SubFormProps) {
  const form = useForm<YouFormData>({
    defaultValues: { student: props.form.student, plan: props.form.plan },
    resolver: zodResolver(YouSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ student, plan }) => {
          props.setForm({
            student,
            plan,
          });
          props.onNext();
        })}
        className="w-2/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="student"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                Are you a current / prospective student, or a graduate?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="current" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Current or prospective student
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="graduate" />
                    </FormControl>
                    <FormLabel className="font-normal">Graduate</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Select your student loan plan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="plan1">Plan 1</SelectItem>
                  <SelectItem value="plan2">Plan 2</SelectItem>
                  <SelectItem value="plan3">Plan 3</SelectItem>
                  <SelectItem value="plan4">Plan 4</SelectItem>
                  <SelectItem value="plan5">Plan 5</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can see which plan you are on{" "}
                <Link href="/examples/forms">on the gov.uk website</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Next</Button>
      </form>
    </Form>
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
  const form = useForm<CourseFormData>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      courseLength: 3,
      courseStartYear: 2023,
      yearlyMaintenance: 7000,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((value) => {
          if (props.form.student === "current") {
            props.setForm({
              ...props.form,
              data: value,
            });
          }
          props.onNext();
        })}
        className="w-2/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="courseLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How long is your course?</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="3"
                  className="w-fit"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Most undergraduate courses are 3 years long
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="courseStartYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What year did do you plan to start your course?
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="2023"
                  className="w-fit"
                  {...field}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearlyMaintenance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What amount of maintenance loan do you plan to borrow each year?
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="£ 7000"
                  className="w-fit"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can find out what loan you are entitled to{" "}
                <Link href="/examples/forms">on the gov.uk website</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button onClick={props.onPrev}>Back</Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
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
  const form = useForm<LoanFormData>({
    defaultValues: {
      currentLoanBalance: 50000,
      graduatingYear: 2022,
    },
    resolver: zodResolver(LoanSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((value) => {
          if (props.form.student === "graduate") {
            props.setForm({
              ...props.form,
              data: value,
            });
          }
          props.onNext();
        })}
        className="w-2/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="currentLoanBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your current loan balance?</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="50000"
                  className="w-fit"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can find out your loan balance{" "}
                <Link href="/examples/forms">
                  on the student loans company website
                </Link>
                . This may differ if you are studying in Scotland, Wales or NI.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="graduatingYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What year did you graduate?</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="2022"
                  className="w-fit"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You start paying back your loan the April after graduating,
                until the duration of the loan is up, or is cleared.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button onClick={props.onPrev}>Back</Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
