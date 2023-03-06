import { CONTRACT_ADDRESS } from '../../constants';
import Image from 'next/image'
import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useAccount, useContract, useSigner } from 'wagmi'
import labour from '../../public/logos/pdp.png'
import pdp from '../../public/logos/pdp.png'
import apc from '../../public/logos/pdp.png'
import artifacts from '../../src/artifacts/contracts/Vote.sol/Vote.json'
import { convertEpochToSpecificTimezone, epochToHumanReadable, epochToHumanReadableTime, getCurrentEpoch } from '../../utiils/dates';


function ElectionId() {

  const router = useRouter();
  const electionId = router.query.electionId

  const { data: signer } = useSigner()
  const { address } = useAccount()
  const contract = useContract({
      address: CONTRACT_ADDRESS,
      abi: artifacts.abi,
      signerOrProvider: signer,
  })

  const [contestants, setContestants] = useState([]);
  const getContestants = async () => {

      try {
        const contestants = await contract.getAllContestants();
        const filteredContestants = contestants.map(contestant => {

          return {
              name            : contestant.name,
              platform        : contestant.platform,
              voteCount       : contestant.voteCount?.toString(),
              contestantId    : contestant.contestantId?.toString(),
              stateCode       : contestant.stateCode?.toString(),
              constituencyCode: contestant.constituencyCode?.toString(),
              electionID      : contestant.electionID?.toString(),
            }
        }).filter((contestant) => {
          return contestant.electionID === router.query.electionId
        })

        setContestants(filteredContestants)
      } catch (error) {
        console.log("🚀 ~ file: [electionId].jsx:32 ~ getContestants ~ error:", error)
        
      }

  }

  // GET ALL ELECTIONS
  const [elections, setElections] = useState([]);
  const getElections = async () => {

      try {
        const elections = await contract?.getAllElections();
        const formattedElections = elections.map(election => {
            return {
                electionName: election.electionName,
                electionDate: epochToHumanReadable(election.electionDate),
                startTime   : election.startTime?.toString(),
                endTime     : election.endTime?.toString(),
                electionId  : election.electionId?.toString(),
            }
        })

        setElections(formattedElections)
      } catch (error) {
        console.log("🚀 ~ file: [electionId].jsx:61 ~ getElections ~ error:", error)
        
      }

  }

  // GET SINGLE ELECTION
  const [singleElection, setSingleElection] = useState({});
  const getSingleElection = async () => {
    try {

        const [ election ] = elections?.filter(election => {
          return election.electionId == electionId
        })
        setSingleElection(election)
                
    } catch (error) {
      console.log("🚀 ~ file: [electionId].jsx:83 ~ getSingleElection ~ error:", error?.data?.message)
    }

  }

  // CAST VOTE
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const castVote = async(contestantId) => {

    try {

      const tx = await contract.castVote( contestantId, address);
      setLoading(true)
      await tx.wait();
      setLoading(false)

      getSingleElection();
      setVoted(true)

    } catch (error) {
      console.log(error.data?.code)
      if(error.data?.code === -32603) {
      console.log('Insufficient funds for gas', 'error');
      return;
  } 
      
    }
  }

  const [votingIsOpen, setVotingIsOpen] = useState(true)
  const [votingHasEnded, setVotingHasEnded] = useState(false)
  const ensureElectionStarted = () => {
    
    const currentTime = getCurrentEpoch();

    if((singleElection?.startTime / 1000) > currentTime) {
      setVotingIsOpen(false)
    }

    if((singleElection?.endTime / 1000) < currentTime) {
      setVotingHasEnded(true)
    }
  }

  useEffect(() => {
    if(elections.length == 0) return;

    getSingleElection();

  },[elections])

  useEffect(() => {
    if(!singleElection) return;

    ensureElectionStarted();

  },[singleElection])

  useEffect(() => {
      if(!signer) return;
      getContestants();
      getElections();
  },[signer])

  function convertEpochToHumanTime(epochTime) {
      var myDate = new Date( epochTime *1000);
      // return myDate.toGMTString();
      return myDate.toLocaleString();
  }
  
  return (
    <>
    {
      !votingIsOpen && <div className='flex justify-center items-center p-5 rounded-xl w-full border border-red-500 bg-red-200 text-red-700 text-center'>
        <p>Voting will open on <span>{convertEpochToHumanTime(singleElection?.startTime / 1000)}</span></p>
      </div>
    }

    {
      votingHasEnded && <div className='flex justify-center items-center p-5 rounded-xl w-full border border-red-500 bg-red-200 text-red-700 text-center'>
        <p>Voting has ended</p>
      </div>
    }

    {
      votingIsOpen && !votingHasEnded && 
        !voted ? <div className='space-y-8'>

          {
            contestants.length > 0 && contestants.map((contestant, idx) => {
              return  <div key={idx} onClick={() => castVote(contestant.contestantId)} className='flex justify-between items-center px-4 md:px-8 py-4 md:py-6 bg-white rounded-2xl cursor-pointer shadow-lg shadow-gray-400'>
                        <Image src={`/logos/${contestant.platform}.png`} className="w-12 md:w-16" alt="logo" width={50} height={50} />
                        <div className='text-white'>{loading ? 'Voting...': ''}</div>
                      </div>
            })
          }

        </div> 
        : 
        <div className='flex justify-center items-center p-5 rounded-xl w-full border border-green-500 bg-green-200 text-green-700 text-center'>
          <p>You have voted successfully.</p>
          <p>Voting results will be available by <span>{convertEpochToHumanTime(singleElection?.endTime / 1000)}</span></p>
        </div>
    }
        
    </>
  )
}

export default ElectionId