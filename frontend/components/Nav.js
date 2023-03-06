import React, { Component } from 'react'
import MobileMenu from './MobileMenu';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import logo from '../public/Vote.png'

export class Nav extends Component {
  render() {
    return (
      <div className='bg-vote-400 px-4 md:p-14 text-white h-32 w-full flex justify-between items-center rounded-bl-3xl rounded-br-3xl'>
        <Image className='w-14 h-16' src={logo} alt='Vote' width={35} height={40} />
        <div className='flex justify-end items-center space-x-2'>
          <ConnectButton />
          <MobileMenu />
        </div>
      </div>
    )
  }
}

export default Nav