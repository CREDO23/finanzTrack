/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import TransactionItem from '@/components/transactions/transactionItem';
import { BiSolidArrowFromBottom, BiSolidArrowFromTop } from 'react-icons/bi';
import { transactionsCategories } from '@/components/transactions/categories';
import { useEffect } from 'react';
import { useViewDispatcher } from '@/store/viewState/hooks';
import { ViewActionType } from '@/store/viewState/action';
import { useAuth } from '@/store/auth/hooks';
import Link from 'next/link';
import useAxiosAction from '@/hooks/useAction';
import { AxiosResponse } from 'axios';
import APICall from '@/helpers/apiCall';
import { useTransCtgryDispatcher } from '@/store/transactionCategory/hooks';
import { TransCtgryActionType } from '@/store/transactionCategory/actions';

export default function Home(): JSX.Element {

  const dispatchView = useViewDispatcher();
  const dispatchTransCtgry = useTransCtgryDispatcher()

  useEffect(() => {
    dispatchView({ type: ViewActionType.SET_NAVIGATION, payload: true });
  }, []);

  const currentUser = useAuth();

  const fetchAllTransactionCategories = async () : Promise<AxiosResponse<IAPIResponse<ITransactionCategory[]>>> => {
        return await APICall.get('/transactions/', {}, '')
  }

  const [fetchAllTransactionCategoriesAction, {loading, data}] = useAxiosAction(fetchAllTransactionCategories)


  useEffect(() => {

    fetchAllTransactionCategoriesAction()

    if(data){
        dispatchTransCtgry({
          type : TransCtgryActionType.SET_CATEGORIES,
          payload : data.data.data as ITransactionCategory[]
        })
    }

  },[loading])

  const totalTransactions = [
    { name: 'expenses', totalAmount: 12000, icon: <BiSolidArrowFromTop /> },
    { name: 'incomes', totalAmount: 9400, icon: <BiSolidArrowFromBottom /> },
  ];

  const transactions = [
    {
      category: 'groceries',
      amount: 300,
      description: 'Monthly grocery shopping',
      type: 'expense',
    },
    { category: 'housing', amount: 1200, description: 'Monthly rent payment', type: 'expense' },
    {
      category: 'healthcare',
      amount: 150,
      description: 'Electricity and water bill',
      type: 'expense',
    },
   
    { category: 'education', amount: 400, description: 'Student loan payment', type: 'expense' },
    { category: 'education', amount: 100, description: 'Art supplies', type: 'expense' },
    { category: 'salary', amount: 5000, description: 'Monthly paycheck', type: 'income' },
    { category: 'freelance', amount: 1200, description: 'Web development project', type: 'income' },
    { category: 'investments', amount: 300, description: 'Stock dividends', type: 'income' },
    { category: 'side Job', amount: 600, description: 'Part-time gig', type: 'income' },
    { category: 'rental Income', amount: 800, description: 'Apartment rent', type: 'income' },
  ];



  return (
    <div className="w-full font-light h-full flex flex-col gap-12  bg-gradient-to-b top-0 left-0 from-[#FFF6E5] via-white to-white pt-10 px-4 overflow-auto">
      <div className="w-full flex flex-col gap-7">
        <div className="w-full  h-0 flex items-center">
          <span className="flex items-center justify-center rounded-full h-12 w-12 border border-primary">
            {currentUser.user?.name?.substring(0, 2)}
          </span>
        </div>
        <div className="w-full h-10 flex items-center justify-center">
          <span className="border rounded-2xl py-1 px-4">October</span>
        </div>
        <div className="w-full flex items-center justify-center flex-col gap-2">
          <p className=" font-light text-sm text-gray-500">Account Balance</p>
          <p className=" text-5xl font-semibold">$9400</p>
        </div>
        <div className="w-full flex items-center justify-center gap-12 ">
          {totalTransactions.map(el => {
            return (
              <div
                key={el.name}
                className={`rounded-3xl w-[10rem] ${
                  el.name == 'incomes' ? ' bg-cgreen' : el.name == 'expenses' ? 'bg-cred' : ''
                }  h-20 p-4 flex items-center gap-2`}
              >
                <span
                  className={`text-3xl border flex items-center justify-center h-full w-10 rounded-xl bg-white ${
                    el.name == 'incomes' ? ' text-cgreen' : el.name == 'expenses' ? 'text-cred' : ''
                  }`}
                >
                  {el.icon}
                </span>{' '}
                <div className="h-full flex flex-col justify-between text-white">
                  <p className=" text-xs capitalize">{el.name}</p>
                  <p className=" text-xl font-normal">${el.totalAmount}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full flex flex-col gap-8">
        {/* <div className="w-full flex flex-col gap-4">
          <p className=" font-medium text-xl">Spend frequency</p>
      <span>Chart</span>
          
        </div> */}
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex items-center justify-between">
            <p className=" font-medium text-xl">Recent transactions</p>
            <Link href={'/transactions'}>
            <span
            onClick={() => dispatchView({type : ViewActionType.SET_NAVIGATION_TAB, payload : 'trans'})}
              className="py-1 px-4 border cursor-pointer flex items-center justify-center border-cyellow/10
              rounded-2xl bg-cyellow/10 text-cyellow"
              >
              See all
            </span>
              </Link>
          </div>
          <ul className="w-full flex flex-col items-center gap-2 ">
            {transactions.map((item, key) => {
              return (
                <TransactionItem
                  type={item.type as 'income' | 'expense'}
                  description={item.description}
                  date="12/10/2014"
                  amount={item.amount}
                  icon={
                    {
                      ...(transactionsCategories[item.category] ??
                        transactionsCategories[item.type]),
                    }.icon
                  }
                  title={transactionsCategories[item.category] ? item.category : item.type}
                  key={key}
                  color={
                    {
                      ...(transactionsCategories[item.category] ??
                        transactionsCategories[item.type]),
                    }.color
                  }
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
