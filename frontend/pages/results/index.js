import { CONTRACT_ADDRESS } from '../../constants';
import React, { useEffect, useState } from 'react'
import { useContract, useSigner } from 'wagmi';
import artifacts from '../../src/artifacts/contracts/Vote.sol/Vote.json'
import { epochToHumanReadable, getCustomDateEpochFromDateAndTime } from '../../utiils/dates';
import ResultCard from '../../components/ResultCard';

function index() {
  
  
  
    const { data: signer } = useSigner();
    const contract = useContract({
        address: CONTRACT_ADDRESS,
        abi: artifacts.abi,
        signerOrProvider: signer,
    })
  
    const [scores, setScores] = useState();
    const getElectionResult = async () => {
  
        try {
  
          const scores = await contract.getElectionScore();
          const formattedResults = scores.map(score => {
              return {
                constituencyCode: score.constituencyCode.toNumber(),
                contestantId    : score.contestantId.toNumber(),
                name            : score.name,
                platform        : score.platform,
                stateCode       : score.stateCode.toNumber(),
                voteCount       : score.voteCount.toNumber(),
              }
          })
          setScores(formattedResults)
          
        } catch (error) {
          console.log(error)
        }
  
    }

    useEffect(() => {
        if(!signer) return;
        getElectionResult();
    },[signer])

  return (
    <>
      <div className='w-full p-2'>
        {
          scores?.length > 0 && scores.map(score => (
            <div key={score.name} className='flex flex-col md:flex-row w-full md:w-5/12 mb-8'>
              <ResultCard score={score} />
            </div>
          ))
        }
      </div>
    </>
  )
}

export default index