import { CONTRACT_ADDRESS } from '../../constants';
import { fetchSigner, getContract } from '@wagmi/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useContract, useSigner } from 'wagmi';
import { epochToHumanReadable } from '../../utiils/dates';
import artifacts from '../../src/artifacts/contracts/Vote.sol/Vote.json'

function ElectionsIndex() {

  const router = useRouter();

  const [elections, setElections] = useState();


  const { data: signer } = useSigner()


  const getElections = async () => {

      try {
        const signer = await fetchSigner()
        
        const contract = getContract({
            address: CONTRACT_ADDRESS,
            abi: artifacts.abi,
            signerOrProvider: signer,
        })

        const elections = await contract.getAllElections();
        const formattedElections = elections.map(election => {
            return {
                electionName: election.electionName,
                electionDate: epochToHumanReadable(election.electionDate),
                startTime   : election.startTime?.toString(),
                endTime     : election.endTime?.toString(),
                electionId  : election.electionId?.toString(),
            }
        })
        console.log("🚀 ~ file: allelections.js:37 ~ formattedElections ~ formattedElections", formattedElections)
        setElections(formattedElections)
        
      } catch (error) {
        console.log(error)
      }

  }

  const handleElectionSelected = () => {

  }

  useEffect(() => {
      if(!signer) return;
      getElections();
  },[signer])

  return (
    <div>
        <div className='space-y-9'>
          {
            elections && elections.length > 0 && elections.map((election, idx) => {
              return <div key={idx} onClick={() => router.push(`/vote/${election.electionId}`)} className='bg-vote-400 shadow-md shadow-gray-400 text-white text-center rounded-2xl py-2 cursor-pointer'>{election.electionName}</div>
            })
          }
        </div>
    </div>
  )
}

export default ElectionsIndex