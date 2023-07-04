import { type NextPage } from "next";
import Head from "next/head";

import { useState } from "react";
import type { FormType } from "../components/LoanForm";
import { LoanForm } from "../components/LoanForm";
import { LoanProjection } from "../components/LoanProjection";

const Home: NextPage = () => {
  const [formData, setFormData] = useState<FormType>();

  const onFormDataChange = (data: FormType) => {
    setFormData(data);
  };

  return (
    <>
      <Head>
        <title>Student Loan Tracker</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-screen flex min-h-screen flex-col items-center bg-slate-100 dark:bg-gradient-to-b dark:from-[#163056] dark:to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 sm:px-4">
          <h1 className="text-center text-5xl font-extrabold tracking-tight text-black dark:text-white sm:text-[5rem]">
            Student <span className="dark:text-[hsl(216,92%,76%)]">Loan</span>{" "}
            Tracker
          </h1>
          <article className="">
            <p className="mx-auto w-2/3 text-xl dark:text-white">
              This tool is designed to demystify what your student loan may look
              like in decades time, and how differing income levels at various
              points in your life can significantly change how much you repay.
            </p>
          </article>
          <div className="w-full flex-row gap-4 sm:w-full md:gap-8">
            <LoanForm onFormDataChange={onFormDataChange} />
            {formData && (
              <LoanProjection
                loanBalance={formData?.loanBalance}
                graduatingYear={formData?.graduatingYear}
                plan={formData?.plan}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
