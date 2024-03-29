# Student Loan Tracker

## Background

Students in England with Plan 5 student loans (courses starting September 2023) will have a 40 year repayment period, rather than 30 years as before. [Article](https://www.theguardian.com/money/2022/feb/24/students-in-england-to-pay-back-loans-over-40-years-instead-of-30)

This change, along with a reduction in the repayment threshold means students may end up paying tens of thousands more back over their working lives.

I want to create an app which helps demystify students loans. They are now a more consequential financial decision than ever, and in the words of Martin Lewis:

> _For around a quarter of a century, we've educated our youth **into** debt when they go to university, but never **about** debt._

The app allows current and graduate students to input their loan details, and returns a table which shows a projection over the remainder of the loan period.
You can edit any row to simulate a salary rise that goes above inflation (e.g. a promotion). Trying to visualise how much you might earn over your career is surprisingly tricky, as you have to decouple national earnings growth from personal career growth.
To highlight this, the median starting salary for graduates was £17,500 in 1999 compared to £30,000 in 2023. (IES Annual Graduate Review 2000)

## App

This app is made with Next.js, with accessible Shadcn/ui components and TailwindCSS styling. I plan to add login, save and comparison functionalities in the future.

### TODO

- [ ] Add login and session functionality with Clerk
- [ ] Add loading states / caching
- [x] Add full range of loan types / plans
- [ ] Implement ability to save results and edit
- [ ] Make more parameters adjustable through an advanced mode
- [x] Make cells editable in output projection to adjust the projection interactively
- [ ] Add ability to make comparisons between projections
- [ ] Simulate overpayments
