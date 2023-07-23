import { type NextPage } from "next";
import Head from "next/head";

import { useState } from "react";
import type { FormType } from "../components/LoanForm";
import { LoanForm } from "../components/LoanForm";
import { LoanProjection } from "../components/LoanProjection";
import { MultiStepForm } from "../components/MultiStepForm";

const Home: NextPage = () => {
  const [formData, setFormData] = useState<FormType>();

  const onFormDataChange = (data: FormType) => {
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
        <header className="sticky top-0 z-40 w-full border-b bg-primary p-4">
          <div className="container flex h-12 items-center justify-between py-4">
            <h1 className="text-2xl tracking-tighter dark:text-white md:text-4xl">
              Student Loan Tracker
            </h1>
          </div>
        </header>
        <section className="container flex flex-col items-center justify-center gap-12 px-4 py-16 sm:px-4 md:w-2/3">
          <article className="flex flex-col items-center gap-4">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              Visualisation
            </h2>
            <p className="text-xl">
              This tool is designed to demystify what your student loan may look
              like in decades time, and how differing income levels at various
              points in your life can significantly change how much you repay.
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas
              laudantium aut saepe numquam consectetur, corrupti, recusandae
              dicta alias enim nulla nesciunt quasi est architecto nemo quisquam
              minus quo corporis provident!
            </p>
          </article>
          <div className="w-full flex-row gap-4 sm:w-full md:gap-8">
            <MultiStepForm />
            <LoanForm onFormDataChange={onFormDataChange} />
            {formData && (
              <LoanProjection
                loanBalance={formData?.loanBalance}
                graduatingYear={formData?.graduatingYear}
                plan={formData?.plan}
              />
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
