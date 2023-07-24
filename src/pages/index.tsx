import { type NextPage } from "next";
import Head from "next/head";

import { useState } from "react";
import { LoanProjection } from "../components/LoanProjection";
import type { FormDataType } from "../components/MultiStepForm";
import { MultiStepForm } from "../components/MultiStepForm";

const Home: NextPage = () => {
  const [formData, setFormData] = useState<FormDataType>();

  const onFormDataChange = (data: FormDataType) => {
    setFormData(data);
  };

  return (
    <>
      <Head>
        <title>Student Loan Tracker</title>
        <meta
          name="Student Loan Tracker"
          content="Project your student loan to understand your financial decision"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-screen flex min-h-screen flex-col items-center bg-primary text-primary-foreground">
        <header className="sticky top-0 z-40 w-full bg-primary p-4">
          <div className="container flex h-12 items-center justify-between py-4">
            <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
              Student Loan Tracker
            </h1>
          </div>
        </header>
        <section className="container flex flex-col items-center justify-center gap-12 px-4 py-16 sm:px-4 md:w-2/3">
          <article className="flex flex-col items-center gap-4">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              Visualisation
            </h2>
            <p className="text-xl leading-7">
              This tool is designed to demystify what your student loan may look
              like in decades time, and how differing income levels at various
              points in your life can significantly change how much you repay.
              Complete the form below to visualise your loan. You can modify any
              of the salary cells, and the salaries in the rows below will be
              recalculated in line with average salary growth.
            </p>
          </article>
          <div className="flex w-full flex-col gap-4 md:gap-8">
            <MultiStepForm handleFormDataChange={onFormDataChange} />
            {formData && <LoanProjection formInput={formData} />}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
