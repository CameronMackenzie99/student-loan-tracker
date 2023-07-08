import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const FormSchema = z.object({
  loanBalance: z.coerce.number().positive(),
  graduatingYear: z.coerce
    .number()
    .min(1980)
    .max(new Date().getFullYear() + 10),
  plan: z.enum(["plan1", "plan2", "plan3", "plan4", "plan5"]),
});

export type FormType = z.infer<typeof FormSchema>;

type FormSetter = {
  onFormDataChange: (data: FormType) => void;
};

export const LoanForm = ({ onFormDataChange }: FormSetter) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormType> = (data: FormType) =>
    onFormDataChange(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-8 flex flex-col items-center gap-4 sm:grid sm:grid-cols-3"
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
            {...register("loanBalance")}
          />
          {errors.loanBalance && (
            <span className="mt-2 block text-sm text-amber-300">
              {errors.loanBalance?.message}
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
      </div>
      <div className="space-y-4 md:space-y-6">
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
        <div className="flex flex-col items-center justify-center">
          <input
            type="submit"
            className="ring-offset-background inline-flex h-10 w-20 items-center justify-center rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            disabled={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
};
