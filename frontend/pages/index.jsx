import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { GiVote } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { GoRepoClone } from "react-icons/go";
import { GiMatterStates } from "react-icons/gi";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useContract, useProvider } from 'wagmi'
import { CONTRACT_ADDRESS } from '../constants';
import artifacts from '../src/artifacts/contracts/Vote.sol/Vote.json'


export default function Home() {

  const router = useRouter();
 
  const provider = useProvider()
  const contract = useContract({
    address: CONTRACT_ADDRESS,
    abi: artifacts.abi,
    signerOrProvider: provider,
  })

  useEffect(() => {
  }, [])

  return (
    <div className='flex justify-center items-center'>
      <div className='grid grid-cols-2 gap-8'>
        <div onClick={() => router.push(`/vote/elections`)} className='p-8 text-center bg-vote-500 w-48 h-48 rounded-md text-white shadow-xl hover:bg-vote-600 transition ease-linear duration-200 cursor-pointer flex flex-col justify-center items-center'>
          <GiVote className='w-3/4 h-3/4 text-white' />
          <p className='text-white text-xl font-bold'>Vote</p>
        </div>
        <div onClick={() => router.push(`/contestants`)} className='p-8 text-center bg-vote-500 w-48 h-48 rounded-md text-white shadow-xl hover:bg-vote-600 transition ease-linear duration-200 cursor-pointer flex flex-col justify-center items-center'>
          <FaUsers className='w-3/4 h-3/4 text-white' />
          <p className='text-white text-xl font-bold'>Candidates</p>
        </div>
        <div className='p-8 text-center bg-vote-500 w-48 h-48 rounded-md text-white shadow-xl hover:bg-vote-600 transition ease-linear duration-200 cursor-pointer flex flex-col justify-center items-center'>
          <GiMatterStates className='w-3/4 h-3/4 text-white' />
          <p className='text-white text-xl font-bold'>Status</p>
        </div>
        <div onClick={() => router.push(`/results`)} className='p-8 text-center bg-vote-500 w-48 h-48 rounded-md text-white shadow-xl hover:bg-vote-600 transition ease-linear duration-200 cursor-pointer flex flex-col justify-center items-center'>
          <GoRepoClone className='w-3/4 h-3/4 text-white' />
          <p className='text-white text-xl font-bold'>Results</p>
        </div>
      </div>
    </div>
  )
}
