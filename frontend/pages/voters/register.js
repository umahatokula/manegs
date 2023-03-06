import { CONTRACT_ADDRESS } from '../../constants';
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { useAccount, useContract, useSigner } from 'wagmi';
import { calculateAge, increaseGasLimit } from '../../utiils/utils';

import { fetchSigner } from '@wagmi/core'
import { useIsMounted } from '../../hooks/useIsMounted';
import artifacts from '../../src/artifacts/contracts/Vote.sol/Vote.json'
import { useRouter } from 'next/router';

function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const mounted = useIsMounted();
    const { address } = useAccount();

    const [voter, setVoter] = useState();
    const [loading, setLoading] = useState(false);

    const router = useRouter();


    const { data: signer, isError, isLoading } = useSigner()
    const contract = useContract({
        address: CONTRACT_ADDRESS,
        abi: artifacts.abi,
        signerOrProvider: signer,
    })
    

    const createVoter = async (data) => {

        try {
            data.age = calculateAge(data.dob);
            console.log("🚀 ~ file: register.js:32 ~ createVoter ~ data:", data)
            
            // get params
            const age = data.age
            const stateCode = Number(data.stateCode)
            const voterIdNumber = Number(data.voterIdNumber)
            const constituencyCode = Number(data.constituencyCode)
            const name = data.name
            const voterAddress = address

            // call contract
            const tx = await contract.registerVoter(name, age, stateCode, voterIdNumber, constituencyCode, voterAddress);

            setLoading(true)
            tx.wait();
            setLoading(false)

            alert('Voter registered')

            router.push('/vote');

        } catch (error) {
            console.log("🚀 ~ file: register.js:45 ~ createVoter ~ error", error)
            
        }

    }

    
    const getVoterInfo = async () => {

        try {

            // estimate gas price 
            const signer = await fetchSigner();
            const voterAddress = await signer.getAddress();

            // call contract
            const voter = await contract.getVoterInfo(voterAddress);
            const formattedVoter = {
                name            : voter.name,
                age             : voter.age?.toString(),
                stateCode       : voter.stateCode?.toString(),
                voterIdNumber   : voter.voterIdNumber?.toString(),
                constituencyCode: voter.constituencyCode?.toString(),
                voterAddress    : voter.voterAddress,
                voted           : voter.voted?.toString(),
            }
            
            setVoter(formattedVoter);

        } catch (error) {
            console.log("🚀 ~ file: register.js:45 ~ createVoter ~ error", error)
            
        }

    }

    useEffect(() => {
        if(!signer) return;
        getVoterInfo()
    },[signer])

  return (
    <div className='bg-vote-300 p-4 rounded-md shadow-xl'>
        <p className='text-2xl mb-12 font-bold'>Voter Registration</p>
        <div>
            <form onSubmit={handleSubmit(createVoter)}>
                <div className='mb-4'>
                    <label className='text-sm font-semibold text-vote-700'>Name</label>
                    <div>
                        <input {...register("name", { required: true })} className='w-full h-9 rounded-md p-2 text-sm' type="text" />
                        <span className='text-red-900 text-sm'>{errors.name && <span>This field is required</span>}</span>
                    </div>
                </div>
                <div className='mb-4'>
                    <label className='text-sm font-semibold'>Date of Birth</label>
                    <div>
                        <input {...register("dob", { required: true })} className='w-full h-9 text-vote-700 rounded-md p-2 text-sm' type="date" />
                        <span className='text-red-900 text-sm'>{errors.dob && <span>This field is required</span>}</span>
                    </div>
                </div>
                <div className='mb-4'>
                    <label className='text-sm font-semibold text-vote-700'>State Code</label>
                    <div>
                        <input {...register("stateCode", { required: true })} className='w-full h-9 rounded-md p-2 text-sm' type="number" />
                        <span className='text-red-900 text-sm'>{errors.stateCode && <span>This field is required</span>}</span>
                    </div>
                </div>
                <div className='mb-4'>
                    <label className='text-sm font-semibold text-vote-700'>Constituency Code</label>
                    <div>
                        <input {...register("constituencyCode", { required: true })} className='w-full h-9 rounded-md p-2 text-sm' type="number" />
                        <span className='text-red-900 text-sm'>{errors.constituencyCode && <span>This field is required</span>}</span>
                    </div>
                </div>
                <div className='mb-4'>
                    <label className='text-sm font-semibold text-vote-700'>Voter Identification Number</label>
                    <div>
                        <input {...register("voterIdNumber", { required: true })} className='w-full h-9 rounded-md p-2 text-sm' type="number" />
                        <span className='text-red-900 text-sm'>{errors.voterIdNumber && <span>This field is required</span>}</span>
                    </div>
                </div>
                <div className='mb-4'>
                    <button type='submit' className='bg-vote-700 px-4 py-2 text-white rounded-md hover:bg-vote-900'>{loading ? 'Saving...' : 'Save'}</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Register